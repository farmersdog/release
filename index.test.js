import * as github from '@actions/github';
import * as core from '@actions/core';
import sha1 from 'sha1';
import { formatCommits, run } from '.';

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
github.context.payload = { repository: { url: 'http://example.com/repo' } };

describe('Release', () => {
  describe('formatCommits(commits)', () => {
    describe('when commit messages contain all regex groups', () => {
      const commits = [
        {
          commit: { message: '(feat) I am a feature [ch123] (#123)' },
          sha: sha1(''),
        },
        {
          commit: { message: '(chore) I am a chore [ch345] (#345)' },
          sha: sha1(''),
        },
        {
          commit: { message: '(bug) I am a bug fix [ch678] (#678)' },
          sha: sha1(''),
        },
      ];

      const formattedCommits = formatCommits(commits);

      const expectedCommits = {
        feat: [],
        chore: [],
        bug: [],
      };

      expect(formattedCommits).toEqual(expectedCommits);
    });

    describe('when commit messages contain prMsg and prNumber', () => {});

    describe('when commit messages do not contain a chType', () => {});
  });

  describe('run()', () => {
    describe('on prerelease', () => {
      beforeEach(() => {
        // Reset inputs
        inputs = {};
      });

      test('should exit if no ghToken provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = { prerelease: 'true', previousTag: 'v20.0.0' };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Must provide ghToken');
      });

      test("should exit if tag isn't properly formatted", async () => {
        github.context.ref = 'refs/tags/testing';
        inputs = { ghToken: '123', prerelease: 'true', previousTag: 'v20.0.0' };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith(
          'Tag must follow format rules: v##.##.##'
        );
      });

      test('should exit if no previousTag provided', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = { ghToken: '123', prerelease: 'true' };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith(
          'Must provide a previousTag to create a prerelease'
        );
      });

      test('should call core.info', async () => {
        github.context.ref = 'refs/tags/v20.0.0';
        inputs = { ghToken: '123', prerelease: 'true', previousTag: 'v20.0.0' };

        await run();

        expect(core.info).toHaveBeenCalledWith(
          'Tag v20.0.0: Creating a prerelease...'
        );
      });
    });
  });
});
