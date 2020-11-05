const core = require('@actions/core');
const github = require('@actions/github');

export async function run() {
  try {
    const {
      payload: { ref },
    } = github.context;
    const tagRegex = /^(refs)\/(tags)\/v\d{2}\.\d+\.\d+$/;
    const previousTag = core.getInput('previousTag');
    const prerelease = core.getInput('prerelease');
    const validTag = ref.match(tagRegex);

    if (!validTag) {
      return core.setFailed('Tag must follow format rules: v##.##.##');
    }

    // Create release notes for prerelease
    // Create prerelease
    // Note on bools: https://github.com/actions/toolkit/issues/361
    if (prerelease === 'true') {
      if (!previousTag) {
        return core.setFailed(
          'Must provide a previousTag to create a prerelease'
        );
      }

      core.info(`Tag ${ref}: Creating a prerelease...`);

      // Fetch git commits in this release
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
