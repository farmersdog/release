import github from '@actions/github';
import * as core from '@actions/core';
import { run } from '.';

let inputs = {};

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { payload: { ref: 'refs/tags/v20.0.0' } },
}));

jest.spyOn(core, 'getInput').mockImplementation((name) => {
  return inputs[name];
});

jest.spyOn(core, 'info').mockImplementation((msg) => msg);
jest.spyOn(core, 'setFailed').mockImplementation((msg) => msg);

describe('Release', () => {
  describe('run()', () => {
    describe('on prerelease', () => {
      beforeEach(() => {
        inputs = { prerelease: 'true', previousTag: 'v20.0.0' };
      });

      test("should exit if tag isn't properly formatted", async () => {
        github.context = { payload: { ref: 'refs/tags/testing' } };
        await run();
        expect(core.setFailed).toHaveBeenCalledWith(
          'Tag must follow format rules: v##.##.##'
        );
      });

      test('should exit if no previousTag provided', async () => {
        github.context = { payload: { ref: 'refs/tags/v20.0.0' } };
        inputs.previousTag = null;

        await run();
        expect(core.setFailed).toHaveBeenCalledWith(
          'Must provide a previousTag to create a prerelease'
        );
      });

      test('should call core.info', async () => {
        github.context = { payload: { ref: 'refs/tags/v20.0.0' } };
        await run();
        expect(core.info).toHaveBeenCalledWith(
          'Tag v20.0.0: Creating a prerelease...'
        );
      });
    });
  });
});
