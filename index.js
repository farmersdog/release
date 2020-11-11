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
  core.info(formattedCommits);

  return Object.keys(formattedCommits).reduce((acc, type) => {
    const heading = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    const markdownCommits = formattedCommits[type].map(
      (commit) =>
        `${commit.prMsg} ${commit.chLink && commit.chLink} ${
          commit.prLink && commit.prLink
        }`
    );
    const listOfCommits = list(markdownCommits);

    const log = `${acc}### ${heading}\n${listOfCommits}\n`;

    return log;
  }, '');
}

export async function run() {
  try {
    const previousTag = core.getInput('previousTag');
    const prerelease = core.getInput('prerelease');
    const ghToken = core.getInput('ghToken');
    const chStoryUrl = core.getInput('chStoryUrl');
    const { ref } = github.context;
    const tagRegex = /(?<refs>refs)\/(?<tags>tags)\/(?<tag>v\d{2}\.\d+\.\d+)/;
    const validTag = ref.match(tagRegex);

    if (!ghToken) {
      return core.setFailed('Must provide ghToken');
    }

    if (!chStoryUrl) {
      return core.setFailed('Must provide chStoryUrl');
    }

    // Mask tokens:
    core.setSecret('ghToken');
    core.setSecret('chStoryUrl');

    if (!validTag || !validTag.groups.tag) {
      return core.setFailed('Tag must follow format rules: v##.##.##');
    }

    const {
      groups: { tag },
    } = validTag;

    // Create prerelease
    // Note on bools: https://github.com/actions/toolkit/issues/361
    if (prerelease === 'true') {
      if (!previousTag) {
        return core.setFailed(
          'Must provide a previousTag to create a prerelease'
        );
      }

      core.info(`Tag ${tag}: Creating a prerelease...`);

      // Get list of commits
      const octokit = github.getOctokit(ghToken);
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
      // Create a github release (type: prerelease) w/ changelog attached
    }

    // If already a prerelease, move to release state
    if (prerelease === 'false') {
      core.info('hello');
    }

    return core.setOutput('hi');
  } catch (error) {
    return core.setFailed(error.message);
  }
}

run();

export default run;
