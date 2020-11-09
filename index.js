const core = require('@actions/core');
const github = require('@actions/github');

export function formatChType(type) {
  const featureRegex = /(feat+)/;
  const choreRegex = /(chore)/;
  const bugRegex = /(bug)/;

  if (type.match(featureRegex)) {
    return 'feature';
  }

  if (type.match(choreRegex)) {
    return 'chore';
  }

  if (type.match(bugRegex)) {
    return 'bug';
  }

  return 'other';
}

export function formatCommits(commits) {
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
    const regex = /(?<chType>\(\w*\))?(\s)?(?<prMsg>\w*\W*.+?)(\s+)?(\[)?(?<chId>ch\d+)?(\])?\s\(#(?<prNumber>\d+)\)/;
    const matches = message.match(regex);
    const chType = matches && formatChType(matches.groups.chType);
    const chId = matches && matches.groups.chId;
    const prMsg = matches && matches.groups.prMsg;
    const prLink =
      matches &&
      matches.groups.prNumber &&
      `[#${matches.groups.prNumber}](${repoUrl}/pull/${matches.groups.prNumber})`;
    const sha = origSha.substring(0, 6);

    const formattedCommit = { chId, prMsg, prLink, sha };
    return Object.assign(acc, {
      [chType]: [...((acc[chType] && acc[chType]) || []), formattedCommit],
    });
  }, {});
}

export async function run() {
  try {
    const previousTag = core.getInput('previousTag');
    const prerelease = core.getInput('prerelease');
    const ghToken = core.getInput('ghToken');
    const { ref } = github.context;
    const tagRegex = /(?<refs>refs)\/(?<tags>tags)\/(?<tag>v\d{2}\.\d+\.\d+)/;
    const validTag = ref.match(tagRegex);

    if (!ghToken) {
      return core.setFailed('Must provide ghToken');
    }

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
      console.log(formattedCommits);
      // Create a github release (type: prerelease) w/ changelog attached
    }

    // If already a prerelease, move to release state
    if (prerelease === 'false') {
      console.log('hello');
    }

    return core.setOutput('hi');
  } catch (error) {
    return core.setFailed(error.message);
  }
}

run();

export default run;
