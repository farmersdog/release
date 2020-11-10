import sha1 from 'sha1';

export const fullCommits = [
  {
    commit: { message: '(feat) I am a feature [ch123] (#123)' },
    sha: sha1(''),
  },
  {
    commit: { message: '(feature) I am a feature [ch000] (#000)' },
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

export const prOnlyCommits = [
  {
    commit: { message: 'I am another type of task. (#340)' },
    sha: sha1(''),
  },
  {
    commit: { message: 'I am another type of task. (#341)' },
    sha: sha1(''),
  },
];
