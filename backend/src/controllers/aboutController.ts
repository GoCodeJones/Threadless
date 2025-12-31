import { Request, Response } from 'express';

export class AboutController {
  getAbout(req: Request, res: Response) {
    return res.status(200).json({
      project: {
        name: 'Threadless',
        tagline: 'A quiet network of personal blogs',
        version: '0.1.0 (MVP)',
        description: 'Threadless is a decentralized social network where each user owns their content and connections are made intentionally, not algorithmically.'
      },
      principles: [
        {
          title: 'Ownership over reach',
          description: 'You own your content, your connections, and your identity. No platform can take that away.'
        },
        {
          title: 'Explicit trust over implicit discovery',
          description: 'Connections are made through shared keys, not suggested by algorithms. You choose who to trust.'
        },
        {
          title: 'Simplicity over features',
          description: 'We prioritize clarity and usability over endless features. Less is more.'
        },
        {
          title: 'Decentralization over convenience',
          description: 'True independence requires effort. We embrace decentralization even when centralization would be easier.'
        }
      ],
      features: {
        trustSystem: {
          name: 'Libertarian Trust Score',
          description: 'Build reputation through contribution, not approval. Transparent scoring based on activity, connections, and engagement.',
          badges: [
            'Newcomer 🌱 (0-20 points)',
            'Free Agent 🦅 (21-40 points)',
            'Independent 💪 (41-60 points)',
            'Sovereign 🗽 (61-80 points)',
            'Founder 🏛️ (81-100 points)'
          ]
        },
        connections: {
          name: 'Key-Based Connections',
          description: 'No friend requests, no follow buttons. Share a key, make a connection. Simple, intentional, secure.'
        },
        posts: {
          name: 'Visibility Control',
          description: 'Every post has a visibility setting: public, connections-only, or private. You decide who sees what.'
        },
        comments: {
          name: 'Connection-Based Comments',
          description: 'Only connected users can comment on your posts. Build meaningful conversations with people you trust.'
        }
      },
      roadmap: {
        completed: [
          'MVP Backend API',
          'Authentication with JWT',
          'User profiles and trust scoring',
          'Posts with visibility controls',
          'Key-based connection system',
          'Comments system',
          'Personalized and public feeds'
        ],
        upcoming: [
          'Frontend web interface',
          'Self-hosting capabilities',
          'Data export/import tools',
          'Federation protocol',
          'Mobile applications',
          'Media attachments (images, files)',
          'Encrypted direct messages',
          'Custom domains for profiles'
        ]
      },
      contribute: {
        description: 'Threadless is open-source and community-driven. We welcome contributions of all kinds.',
        ways: [
          {
            type: 'Code',
            description: 'Submit PRs, fix bugs, add features. Check our GitHub repository.',
            link: 'https://github.com/GoCodeJones/Threadless'
          },
          {
            type: 'Documentation',
            description: 'Help us improve our docs, write tutorials, create guides.'
          },
          {
            type: 'Testing',
            description: 'Use Threadless, report bugs, suggest improvements.'
          },
          {
            type: 'Ideas',
            description: 'Share your vision for a better decentralized social network.'
          },
          {
            type: 'Spread the word',
            description: 'Tell others about Threadless. Independence grows through community.'
          }
        ]
      },
      philosophy: {
        title: 'Why Threadless exists',
        content: 'Social media became a walled garden where platforms own everything and algorithms decide what you see. Threadless is different. It\'s built on the principle that the web already supports publishing—what we need is a way for independent sites to connect without giving up ownership. Threadless is not about growth, engagement, or monetization. It\'s about freedom, sovereignty, and building meaningful connections on your own terms.'
      },
      contact: {
        creator: 'Jones',
        github: 'https://github.com/GoCodeJones/Threadless',
        email: 'Contact via GitHub issues'
      }
    });
  }
}