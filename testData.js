export const url = 'http://example.com/repo';
export const chStoryUrl = 'https://app.shortcut.com/org/story';

export const fullCommits = [
  {
    commit: { message: '(feat) I am a feature [sc-123] (#123)' },
  },
  {
    commit: { message: '(feature) I am a feature [sc-000] (#000)' },
  },
  {
    commit: { message: '(bug) I am a bug fix [sc-678] (#678)' },
  },
  {
    commit: { message: '(chore) I am a chore [sc-345] (#345)' },
  },
];

export const prOnlyCommits = [
  {
    commit: { message: 'I am another type of task. (#340)' },
  },
  {
    commit: { message: 'I am another type of task. (#341)' },
  },
];

export const prMsgOnlyCommits = [
  {
    commit: {
      message:
        'I am another type of task that was merged directly to master! Oops!',
    },
  },
];

export const formattedFullCommits = {
  feature: [
    {
      chLink: `[sc-123](${chStoryUrl}/123)`,
      prMsg: 'I am a feature',
      prLink: `[#123](${url}/pull/123)`,
    },
    {
      chLink: `[sc-000](${chStoryUrl}/000)`,
      prMsg: 'I am a feature',
      prLink: `[#000](${url}/pull/000)`,
    },
  ],
  bug: [
    {
      chLink: `[sc-678](${chStoryUrl}/678)`,
      prMsg: 'I am a bug fix',
      prLink: `[#678](${url}/pull/678)`,
    },
  ],
  chore: [
    {
      chLink: `[sc-345](${chStoryUrl}/345)`,
      prMsg: 'I am a chore',
      prLink: `[#345](${url}/pull/345)`,
    },
  ],
};

export const formattedPrOnlyCommits = {
  other: [
    {
      chLink: null,
      prMsg: 'I am another type of task.',
      prLink: `[#340](${url}/pull/340)`,
    },
    {
      chLink: null,
      prMsg: 'I am another type of task.',
      prLink: `[#341](${url}/pull/341)`,
    },
  ],
};

export const formattedCommitsAll = {
  ...formattedFullCommits,
  ...formattedPrOnlyCommits,
};

export const changelogCommits = [
  fullCommits[0],
  fullCommits[2],
  fullCommits[3],
  prOnlyCommits[0],
  prMsgOnlyCommits[0],
];

export const formattedChangelogCommits = {
  feature: [
    {
      chLink: `[sc-123](${chStoryUrl}/123)`,
      prMsg: 'I am a feature',
      prLink: `[#123](${url}/pull/123)`,
    },
  ],
  bug: [
    {
      chLink: `[sc-678](${chStoryUrl}/678)`,
      prMsg: 'I am a bug fix',
      prLink: `[#678](${url}/pull/678)`,
    },
  ],
  chore: [
    {
      chLink: `[sc-345](${chStoryUrl}/345)`,
      prMsg: 'I am a chore',
      prLink: `[#345](${url}/pull/345)`,
    },
  ],
  other: [
    {
      chLink: null,
      prMsg: 'I am another type of task.',
      prLink: `[#340](${url}/pull/340)`,
    },
    {
      chLink: null,
      prMsg:
        'I am another type of task that was merged directly to master! Oops!',
      prLink: null,
    },
  ],
};

export const fullChangelog = `### Feature
- ${formattedChangelogCommits.feature[0].prMsg} ${formattedChangelogCommits.feature[0].chLink} ${formattedChangelogCommits.feature[0].prLink}

### Bug
- ${formattedChangelogCommits.bug[0].prMsg} ${formattedChangelogCommits.bug[0].chLink} ${formattedChangelogCommits.bug[0].prLink}

### Chore
- ${formattedChangelogCommits.chore[0].prMsg} ${formattedChangelogCommits.chore[0].chLink} ${formattedChangelogCommits.chore[0].prLink}

### Other
- ${formattedChangelogCommits.other[0].prMsg} ${formattedChangelogCommits.other[0].prLink}
- ${formattedChangelogCommits.other[1].prMsg}

`;
