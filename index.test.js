import * as core from '@actions/core';
import { run } from '.';

let inputs = {};

jest.mock('@actions/core');

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
}));

jest.spyOn(core, 'getInput').mockImplementation((name) => {
  return inputs[name];
});

jest.spyOn(core, 'info');
jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

describe('Release', () => {
  describe('run()', () => {
    beforeEach(() => {
      inputs = { prerelease: 'true' };
    });

    test('should exit if no tag input', async () => {
      await run();
      expect(core.setFailed).toHaveBeenCalledTimes(1);
    });

    test("should exit if tag isn't properly formatted", async () => {
      inputs.tag = 'this-wont-work';
      await run();
      expect(core.setFailed).toHaveBeenCalledTimes(1);
    });

    test('should start prerelease steps', async () => {
      inputs.tag = 'v20.0.00';
      await run();
      expect(core.info).toHaveBeenCalledTimes(1);
    });
  });
});
