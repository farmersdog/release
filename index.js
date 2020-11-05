const core = require('@actions/core');
// const github = require('@actions/github');

export async function run() {
  try {
    const tagRegex = /^v\d{2}\.\d+\.\d+$/;
    const tag = core.getInput('tag');
    const prerelease = core.getInput('prerelease');

    if (!tag) {
      return core.setFailed('Input tag is required.');
    }

    if (!tagRegex.test(tag)) {
      return core.setFailed('Tag must follow format rules: v##.##.##');
    }

    // Create release notes for prerelease
    // Create prerelease
    // Note on bools: https://github.com/actions/toolkit/issues/361
    if (prerelease === 'true') {
      core.info(`Tag ${tag}: Creating a prerelease...`);

      // Fetch git commits in this release
      // Get a list of story IDs from commits
      // Gather stories (grouped by story_type)
      // Gather PRs from stories (title)
      // changelogEntries = { [story_type] : { [chId]: 'PR Title', prUrl: '' }, ... };
    }

    // If already a prerelease, move to release state

    return core.setOutput('hi');
  } catch (error) {
    return core.setFailed(error.message);
  }
}

run();

export default run;
