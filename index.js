const core = require('@actions/core');
const github = require('@actions/github');
const list = require('markdown-list');

export function formatChType(type) {
  const featureRegex = /(feat+)/;
  if (!type) {
    return 'other';
  }

  if (type.match(featureRegex)) {
    return 'feature';
  }

  return type.replace(/[^a-zA-Z ]/g, '');
}

export function formatCommits(commits, chStoryUrl) {
  const {
    payload: {
      repository: { url: repoUrl },
    },
  } = github.context;

  return commits.reduce((acc, com) => {
    const {
      commit: { message },
      sha: origSha,
    } = com;
    const regex = /(?<chType>\(\w*\))?(\s)?(?<prMsg>\w*\W*.+?)(\s+)?(\[)?(ch)?(?<chId>\d+)?(\])?\s\(#(?<prNumber>\d+)\)/;
    const matches = message.match(regex);
    const chType = formatChType(matches && matches.groups.chType);
    const prMsg = (matches && matches.groups.prMsg) || message;
    const prLink =
      (matches &&
        matches.groups.prNumber &&
        `[#${matches.groups.prNumber}](${repoUrl}/pull/${matches.groups.prNumber})`) ||
      null;
    const chLink =
      (matches &&
        matches.groups.chId &&
        `[ch${matches.groups.chId}](${chStoryUrl}/${matches.groups.chId})`) ||
      null;
    const sha = origSha.substring(0, 6);

    const formattedCommit = { chLink, prMsg, prLink, sha };

    return Object.assign(acc, {
      [chType]: [...((acc[chType] && acc[chType]) || []), formattedCommit],
    });
  }, {});
}

export function generateChangelog(formattedCommits) {
  return Object.keys(formattedCommits).reduce((acc, type) => {
    const heading = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    const markdownCommits = formattedCommits[type].map((commit) => {
      let msg = commit.prMsg;

      if (commit.chLink) {
        msg = `${msg} ${commit.chLink}`;
      }

      if (commit.prLink) {
        msg = `${msg} ${commit.prLink}`;
      }

      return msg;
    });
    const listOfCommits = list(markdownCommits);

    const log = `${acc}### ${heading}\n${listOfCommits}\n`;

    return log;
  }, '');
}

export async function run() {
  try {
    const previousTag = core.getInput('previousTag');
    const prerelease = core.getInput('prerelease');
    const isPreRelease = prerelease === 'true';
    const ghToken = core.getInput('ghToken');
    const chStoryUrl = core.getInput('chStoryUrl');
    const { ref } = github.context;
    const tagRegex = /(?<refs>refs)\/(?<tags>tags)\/(?<tag>v\d{2}\.\d+\.\d+)/;
    const validTag = ref.match(tagRegex);

    if (!ghToken) {
      return core.setFailed('Must provide ghToken');
    }

    core.setSecret('ghToken');

    if (!validTag || !validTag.groups.tag) {
      return core.setFailed('Tag must follow format rules: v##.##.##');
    }

    const {
      groups: { tag },
    } = validTag;
    const octokit = github.getOctokit(ghToken);

    core.info(
      `Tag ${tag}: Creating a ${isPreRelease ? 'prerelease' : 'release'}...`
    );

    /* CREATE PRERELEASE */
    if (isPreRelease) {
      // CH Story URL is required for prerelease
      if (!chStoryUrl) {
        return core.setFailed('Must provide chStoryUrl');
      }

      core.setSecret('chStoryUrl');

      // Previous Tag is required for prerelease
      if (!previousTag) {
        return core.setFailed(
          'Must provide a previousTag to create a prerelease'
        );
      }

      const {
        data: { commits },
      } = await octokit.repos.compareCommits({
        ...github.context.repo,
        base: previousTag,
        head: tag,
      });

      const formattedCommits = formatCommits(commits);
      const changelog = generateChangelog(formattedCommits);

      core.info(changelog);

      return await octokit.repos.createRelease({
        ...github.context.repo,
        name: tag,
        tag_name: tag,
        body: changelog,
        prerelease: true,
      });
    }

    /* UPDATE PRERELEASE TO RELEASE */
    if (!isPreRelease) {
      return await octokit.repos.updateRelease({
        ...github.context.repo,
        release_id: github.context.payload.release.id,
        prerelease: false,
      });
    }

    return core.setFailed(
      'The workflow did not run the necessary steps! Double check your env vars.'
    );
  } catch (error) {
    return core.setFailed(error.message);
  }
}

run();

export default run;
