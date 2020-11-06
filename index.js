const core = require('@actions/core');
const github = require('@actions/github');

export async function run() {
  try {
    const previousTag = core.getInput('previousTag');
    const prerelease = core.getInput('prerelease');
    const ghToken = core.getInput('ghToken');
    const octokit = github.getOctokit(ghToken);
    const {
      payload: {
        ref,
        repository: { url: repoUrl },
      },
    } = github.context;
    const tagRegex = /(?<refs>refs)\/(?<tags>tags)\/(?<tag>v\d{2}\.\d+\.\d+)/;
    const validTag = ref.match(tagRegex);

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
      const {
        data: { commits },
      } = await octokit.repos.compareCommits({
        ...github.context.repo,
        base: previousTag,
        head: tag,
      });

      const formattedCommits = commits.reduce((acc, commit) => {
        const { message } = commit;
        const regex = /(?<chType>\(\w*\))\s(?<prMsg>\w*\W*.+?)\[(?<chId>ch\d+)\]\s\(#(?<prNumber>\d+)\)/gi;
        const matches = message.match(regex);
        const chType = (matches && matches.groups.chType) || 'other';
        const prMsg = (matches && matches.groups.prMsg) || message;
        const prIdLink =
          matches &&
          matches.groups.prId &&
          `[#${prId}](${repoUrl}/pull/${prId})`;
      }, {});
      // Get a list of story IDs from commits
      // Gather stories (grouped by story_type)
      // Gather PRs from stories (title)
      // changelogEntries = { [story_type] : { [chId]: 'PR Title', prUrl: '' }, ... };
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
