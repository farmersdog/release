const core = require('@actions/core');
const github = require('@actions/github');

export async function run() {
  try {
    const tagRegex = /^v\d{2}\.\d+\.\d+$/;
    const tag = core.getInput('tag');

    if (!tag) {
      return core.setFailed('Input tag is required.');
    }

    if (!tagRegex.test(tag)) {
      return core.setFailed('Tag must follow format rules: v##.##.##');
    }

    // If not prerelease yet, create release notes for prerelease
    // Create prerelease

    // If already a prerelease, move to release state
  } catch (error) {
    return core.setFailed(error.message);
  }
}

run();
