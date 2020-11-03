import * as core from '@actions/core';
import github from '@actions/github';
import * as action from '.';

let inputs = {};

jest.mock('@actions/core');

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
}));

jest.spyOn(core, 'getInput').mockImplementation((name) => {
  return inputs[name];
});

jest.spyOn(core, 'info').mockImplementation(jest.fn());
jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
jest.spyOn(core, 'setSecret').mockImplementation(jest.fn());

describe('Release', () => {
  describe('run()', () => {
    beforeEach(() => {
      inputs = {};
    });

    test('should exit if no tag input', async () => {
      await action.run();
      expect(core.setFailed).toHaveBeenCalledTimes(1);
    });

    test("should exit if tag isn't properly formatted", async () => {
      inputs.tag = 'this-wont-work';
      await action.run();
      expect(core.setFailed).toHaveBeenCalledTimes(1);
    });
  });
});
