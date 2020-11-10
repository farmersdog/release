import * as github from '@actions/github';
import * as core from '@actions/core';
import { formatCommits, run } from '.';
import { fullCommits, prOnlyCommits } from './testData';

let inputs = {};
const chStoryUrl = 'https://app.clubhouse.io/org/story';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: {},
  getOctokit: jest.fn(),
}));

jest.spyOn(core, 'getInput').mockImplementation((name) => {
  return inputs[name];
});

jest.spyOn(core, 'info').mockImplementation((msg) => msg);
jest.spyOn(core, 'setFailed').mockImplementation((msg) => msg);

github.context.ref = 'refs/tags/v20.0.0';
github.context.sha = '1234567890123456789012345678901234567890';
github.context.payload = { repository: { url: 'http://example.com/repo' } };

describe('Release', () => {
  describe('formatCommits(commits, chStoryUrl)', () => {
    test('when commit messages contain all regex groups', () => {
      const commits = fullCommits;

      const formattedCommits = formatCommits(commits, chStoryUrl);

      const expectedCommits = {
        feature: [
          {
            chLink: `[ch123](${chStoryUrl}/123)`,
            prMsg: 'I am a feature',
            prLink: `[#123](${github.context.payload.repository.url}/pull/123)`,
            sha: fullCommits[0].sha.substring(0, 6),
          },
          {
            chLink: `[ch000](${chStoryUrl}/000)`,
            prMsg: 'I am a feature',
            prLink: `[#000](${github.context.payload.repository.url}/pull/000)`,
            sha: fullCommits[1].sha.substring(0, 6),
          },
        ],
        chore: [
          {
            chLink: `[ch345](${chStoryUrl}/345)`,
            prMsg: 'I am a chore',
            prLink: `[#345](${github.context.payload.repository.url}/pull/345)`,
            sha: fullCommits[2].sha.substring(0, 6),
          },
        ],
        bug: [
          {
            chLink: `[ch678](${chStoryUrl}/678)`,
            prMsg: 'I am a bug fix',
            prLink: `[#678](${github.context.payload.repository.url}/pull/678)`,
            sha: fullCommits[3].sha.substring(0, 6),
          },
        ],
      };

      expect(formattedCommits).toEqual(expectedCommits);
    });

    test('when commit messages contain prMsg and prNumber only', () => {
      const commits = prOnlyCommits;

      const formattedCommits = formatCommits(commits, chStoryUrl);

      const expectedCommits = {
        other: [
          {
            chLink: null,
            prMsg: 'I am another type of task.',
            prLink: `[#340](${github.context.payload.repository.url}/pull/340)`,
            sha: prOnlyCommits[0].sha.substring(0, 6),
          },
          {
            chLink: null,
            prMsg: 'I am another type of task.',
            prLink: `[#341](${github.context.payload.repository.url}/pull/341)`,
            sha: prOnlyCommits[1].sha.substring(0, 6),
          },
        ],
      };

      expect(formattedCommits).toEqual(expectedCommits);
    });

    test('when commit messages are of mixed types', () => {
      const commits = [...fullCommits, ...prOnlyCommits];

      const formattedCommits = formatCommits(commits, chStoryUrl);

      const expectedCommits = {
        feature: [
          {
            chLink: `[ch123](${chStoryUrl}/123)`,
            prMsg: 'I am a feature',
            prLink: `[#123](${github.context.payload.repository.url}/pull/123)`,
            sha: fullCommits[0].sha.substring(0, 6),
          },
          {
            chLink: `[ch000](${chStoryUrl}/000)`,
            prMsg: 'I am a feature',
            prLink: `[#000](${github.context.payload.repository.url}/pull/000)`,
            sha: fullCommits[1].sha.substring(0, 6),
          },
        ],
        chore: [
          {
            chLink: `[ch345](${chStoryUrl}/345)`,
            prMsg: 'I am a chore',
            prLink: `[#345](${github.context.payload.repository.url}/pull/345)`,
            sha: fullCommits[2].sha.substring(0, 6),
          },
        ],
        bug: [
          {
            chLink: `[ch678](${chStoryUrl}/678)`,
            prMsg: 'I am a bug fix',
            prLink: `[#678](${github.context.payload.repository.url}/pull/678)`,
            sha: fullCommits[3].sha.substring(0, 6),
          },
        ],
        other: [
          {
            chLink: null,
            prMsg: 'I am another type of task.',
            prLink: `[#340](${github.context.payload.repository.url}/pull/340)`,
            sha: prOnlyCommits[0].sha.substring(0, 6),
          },
          {
            chLink: null,
            prMsg: 'I am another type of task.',
            prLink: `[#341](${github.context.payload.repository.url}/pull/341)`,
            sha: prOnlyCommits[1].sha.substring(0, 6),
          },
        ],
      };

      expect(formattedCommits).toEqual(expectedCommits);
    });
  });

  describe('run()', () => {
    describe('on prerelease', () => {
      beforeEach(() => {
        // Reset inputs
        inputs = {};
      });

      test('should exit if no ghToken provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = { chStoryUrl, prerelease: 'true', previousTag: 'v20.0.0' };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Must provide ghToken');
      });

      test('should exit if no chStoryUrl provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = { ghToken: '123', prerelease: 'true', previousTag: 'v20.0.0' };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Must provide chStoryUrl');
      });

      test('should exit if no ghToken provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = { chStoryUrl, prerelease: 'true', previousTag: 'v20.0.0' };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Must provide ghToken');
      });

      test("should exit if tag isn't properly formatted", async () => {
        github.context.ref = 'refs/tags/testing';
        inputs = {
          chStoryUrl,
          ghToken: '123',
          prerelease: 'true',
          previousTag: 'v20.0.0',
        };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith(
          'Tag must follow format rules: v##.##.##'
        );
      });

      test('should exit if no previousTag provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = { chStoryUrl, ghToken: '123', prerelease: 'true' };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith(
          'Must provide a previousTag to create a prerelease'
        );
      });

      test('should call core.info', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = {
          chStoryUrl,
          ghToken: '123',
          prerelease: 'true',
          previousTag: 'v20.0.0',
        };

        await run();

        expect(core.info).toHaveBeenCalledWith(
          'Tag v20.0.0: Creating a prerelease...'
        );
      });
    });
  });
});
