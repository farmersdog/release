import sha1 from 'sha1';

export const url = 'http://example.com/repo';
export const chStoryUrl = 'https://app.clubhouse.io/org/story';

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
    commit: { message: '(bug) I am a bug fix [ch678] (#678)' },
    sha: sha1(''),
  },
  {
    commit: { message: '(chore) I am a chore [ch345] (#345)' },
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

export const formattedFullCommits = {
  feature: [
    {
      chLink: `[ch123](${chStoryUrl}/123)`,
      prMsg: 'I am a feature',
      prLink: `[#123](${url}/pull/123)`,
      sha: fullCommits[0].sha.substring(0, 6),
    },
    {
      chLink: `[ch000](${chStoryUrl}/000)`,
      prMsg: 'I am a feature',
      prLink: `[#000](${url}/pull/000)`,
      sha: fullCommits[1].sha.substring(0, 6),
    },
  ],
  bug: [
    {
      chLink: `[ch678](${chStoryUrl}/678)`,
      prMsg: 'I am a bug fix',
      prLink: `[#678](${url}/pull/678)`,
      sha: fullCommits[3].sha.substring(0, 6),
    },
  ],
  chore: [
    {
      chLink: `[ch345](${chStoryUrl}/345)`,
      prMsg: 'I am a chore',
      prLink: `[#345](${url}/pull/345)`,
      sha: fullCommits[2].sha.substring(0, 6),
    },
  ],
};

export const formattedPrOnlyCommits = {
  other: [
    {
      chLink: null,
      prMsg: 'I am another type of task.',
      prLink: `[#340](${url}/pull/340)`,
      sha: prOnlyCommits[0].sha.substring(0, 6),
    },
    {
      chLink: null,
      prMsg: 'I am another type of task.',
      prLink: `[#341](${url}/pull/341)`,
      sha: prOnlyCommits[1].sha.substring(0, 6),
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
];

export const formattedChangelogCommits = {
  feature: [
    {
      chLink: `[ch123](${chStoryUrl}/123)`,
      prMsg: 'I am a feature',
      prLink: `[#123](${url}/pull/123)`,
      sha: fullCommits[0].sha.substring(0, 6),
    },
  ],
  bug: [
    {
      chLink: `[ch678](${chStoryUrl}/678)`,
      prMsg: 'I am a bug fix',
      prLink: `[#678](${url}/pull/678)`,
      sha: fullCommits[3].sha.substring(0, 6),
    },
  ],
  chore: [
    {
      chLink: `[ch345](${chStoryUrl}/345)`,
      prMsg: 'I am a chore',
      prLink: `[#345](${url}/pull/345)`,
      sha: fullCommits[2].sha.substring(0, 6),
    },
  ],
  other: [
    {
      chLink: null,
      prMsg: 'I am another type of task.',
      prLink: `[#340](${url}/pull/340)`,
      sha: prOnlyCommits[0].sha.substring(0, 6),
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
- ${formattedChangelogCommits.other[0].prMsg} ${formattedChangelogCommits.other[0].chLink} ${formattedChangelogCommits.other[0].prLink}

`;
