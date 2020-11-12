import * as github from '@actions/github';
import * as core from '@actions/core';
import { formatCommits, generateChangelog, run } from '.';
import {
  changelogCommits,
  chStoryUrl,
  formattedFullCommits,
  formattedCommitsAll,
  formattedPrOnlyCommits,
  fullChangelog,
  fullCommits,
  prOnlyCommits,
  url,
} from './testData';

let inputs = {};

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
github.context.payload = { repository: { url } };

describe('Release', () => {
  describe('formatCommits(commits, chStoryUrl)', () => {
    test('when commit messages contain all regex groups', () => {
      const commits = fullCommits;

      const formattedCommits = formatCommits(commits, chStoryUrl);

      const expectedCommits = formattedFullCommits;

      expect(formattedCommits).toEqual(expectedCommits);
    });

    test('when commit messages contain prMsg and prNumber only', () => {
      const commits = prOnlyCommits;

      const formattedCommits = formatCommits(commits, chStoryUrl);

      const expectedCommits = formattedPrOnlyCommits;

      expect(formattedCommits).toEqual(expectedCommits);
    });

    test('when commit messages are of mixed types', () => {
      const commits = [...fullCommits, ...prOnlyCommits];
      const formattedCommits = formatCommits(commits, chStoryUrl);
      const expectedCommits = formattedCommitsAll;

      expect(formattedCommits).toEqual(expectedCommits);
    });
  });

  describe('generateChangelog(formattedCommits)', () => {
    test('returns a properly formatted changelog', () => {
      const commits = changelogCommits;
      const formattedCommits = formatCommits(commits, chStoryUrl);
      const changelog = generateChangelog(formattedCommits);
      const expectedChangelog = fullChangelog;

      expect(changelog).toEqual(expectedChangelog);
    });
  });

  describe('run()', () => {
    test('should exit if no ghToken provided', async () => {
      github.context.ref = 'refs/tags/v20.0.0';
      inputs = {
        createChangelog: 'true',
        chStoryUrl,
        prerelease: 'true',
        previousTag: 'v20.0.0',
      };

      await run();

      expect(core.setFailed).toHaveBeenCalledWith('Must provide ghToken');
    });

    test("should exit if tag isn't properly formatted", async () => {
      github.context.ref = 'refs/tags/testing';
      inputs = {
        createChangelog: 'true',
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

    describe('on createChangelog: true', () => {
      beforeEach(() => {
        // Reset inputs
        inputs = {};
      });

      test('should exit if no chStoryUrl provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = {
          createChangelog: 'true',
          ghToken: '123',
          prerelease: 'true',
          previousTag: 'v20.0.0',
        };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Must provide chStoryUrl');
      });

      test('should exit if no ghToken provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = {
          createChangelog: 'true',
          chStoryUrl,
          prerelease: 'true',
          previousTag: 'v20.0.0',
        };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Must provide ghToken');
      });

      test('should exit if no previousTag provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = {
          createChangelog: 'true',
          chStoryUrl,
          ghToken: '123',
          prerelease: 'true',
        };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith(
          'Must provide a previousTag to create a changelog'
        );
      });
    });

    describe('on prerelease: true', () => {
      beforeEach(() => {
        // Reset inputs
        inputs = {};
      });

      test('should call core.info', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = {
          createChangelog: 'true',
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

    describe('on prerelease: false', () => {
      beforeEach(() => {
        // Reset inputs
        inputs = {};
      });

      test('should call core.info', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = {
          createChangelog: 'false',
          chStoryUrl,
          ghToken: '123',
          prerelease: 'false',
          previousTag: 'v20.0.0',
        };

        await run();

        expect(core.info).toHaveBeenCalledWith(
          'Tag v20.0.0: Creating a release...'
        );
      });
    });
  });
});
