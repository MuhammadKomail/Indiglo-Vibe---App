import imagePath from '../styles/imgPath';

export const sections = [
  {
    title: 'Emotional wellness',
    tags: [
      'Anxiety',
      'Depression',
      'Self-love',
      'Self-esteem',
      'Emotional Balance',
      'Loneliness',
    ],
  },
  {
    title: 'Trauma & Healing',
    tags: [
      'Trauma Recovery',
      'Grief Support',
      'Inner Child Work',
      'Abuse Headling',
      'Emotional Healing',
    ],
  },
  {
    title: 'Stress & Life Balance',
    tags: [
      'Stress Relief',
      'Burnout Recovery',
      'Mindfulness',
      'Work Life Balance',
      'Life Transitions',
    ],
  },
  {
    title: 'Relationships & Communication',
    tags: [
      'Relationships',
      'Conflict Resolution',
      'Boundaries',
      'Family Dynamics',
      'Workplace Dynamics',
    ],
  },
  {
    title: 'Identity & Purpose',
    tags: [
      'Self Discovery',
      'Spiritual Guidance',
      'Chakra Balancing',
      'LGBTQIA Support',
      'Purpose Finding',
    ],
  },
];

export const exploreData = [
  {
    id: '1',
    name: 'John Hall',
    category: 'Self-Care | Career',
    price: 15,
    time: '30 min',
    image: imagePath.ProfileImage2,
  },
  {
    id: '2',
    name: 'Alice Sham',
    category: 'Stress Management',
    price: 15,
    time: '30 min',
    image: imagePath.ProfileImage2,
  },
  {
    id: '3',
    name: 'David Patel',
    category: 'Anxiety | Self-Care',
    price: 15,
    time: '30 min',
    image: imagePath.ProfileImage2,
  },
];

export const bestMatchData = [
  {
    id: '1',
    name: 'Alice Grace',
    desc: 'I’m passionate about helping individuals find clarity and positivity in their lives.',
    callTime: '20 min',
    callPrice: '$20',
    messageTime: '20 min',
    messagePrice: '$20',
    image: imagePath.profileUser,
  },
  {
    id: '2',
    name: 'Alice Doe',
    desc: 'I’m passionate about helping individuals find clarity and positivity in their lives.',
    callTime: '20 min',
    callPrice: '$20',
    messageTime: '20 min',
    messagePrice: '$20',
    image: imagePath.profileUser,
  },
];

export const appointments = [
  {
    id: '1',
    name: 'Iris James',
    date: 'Sunday, 12 June',
    time: '11:00 – 11:30 AM',
    image: imagePath.profileUser, // replace with your image
  },
];

export const requests = [
  {
    id: '1',
    name: 'Jack Paul',
    date: 'Sunday, 12 June',
    time: '11:00 – 12:30 AM',
    image: imagePath.profileUser,
  },
  {
    id: '2',
    name: 'Ona Mendas',
    date: 'Sunday, 12 June',
    time: '11:00 – 12:30 AM',
    image: imagePath.profileUser,
  },
  {
    id: '3',
    name: 'Capri Jones',
    date: 'Sunday, 12 June',
    time: '11:00 – 12:30 AM',
    image: imagePath.profileUser,
  },
];

export const mentorsData = [
  {
    id: '1',
    name: 'Ben Harvery',
    avatar: imagePath.ProfileImage2,
    description:
      "I'm passionate about helping individuals find clarity and positivity in their lives.",
  },
  {
    id: '2',
    name: 'Alicia John',
    avatar: imagePath.ProfileImage2,
    description:
      "I'm passionate about helping individuals find clarity and positivity in their lives.",
  },
  {
    id: '3',
    name: 'Jeff James',
    avatar: imagePath.ProfileImage2,
    description:
      "I'm passionate about helping individuals find clarity and positivity in their lives.",
  },
  {
    id: '4',
    name: 'Kevin Lee',
    avatar: imagePath.ProfileImage2,
    description:
      "I'm passionate about helping individuals find clarity and positivity in their lives.",
  },
];

export const mentorData = {
  name: 'Ben Harvery',
  about:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  specialties: [
    'Career Path Guidance',
    'Goal Setting Expert',
    'Resume & Interview Prep',
    'Work-Life Balance Coaching',
  ],
  chatPrice: 10,
  callPrice: 20,
  profileImg: imagePath.profileUser, // replace with your profile image path
  bgImg: imagePath.headerBackground,
};

export const specialties = [
  'Anxiety',
  'Depression',
  'Self-love',
  'Self-esteem',
  'Emotional Balance',
  'Loneliness',
  'Trauma Recovery',
  'Grief Support',
  'Inner Child Work',
  'Abuse Headling',
  'Emotional Healing',
  'Stress Relief',
  'Burnout Recovery',
  'Mindfulness',
  'Work Life Balance',
  'Life Transitions',
  'Relationships',
  'Conflict Resolution',
  'Boundaries',
  'Family Dynamics',
  'Workplace Dynamics',
  'Self Discovery',
  'Spiritual Guidance',
  'Chakra Balancing',
  'LGBTQIA Support',
  'Purpose Finding',
];

export const notifications = [
  {
    day: 'Today',
    notifications: [
      {
        notification: 'Sofia, John and +19 others liked your post.',
        time: '10m ago',
        type: 'call',
      },
      {
        notification: 'Sofia, John and +19 others liked your post.',
        time: '10m ago',
        type: 'chat',
      },
    ],
  },
  {
    day: 'Yesterday',
    notificationList: [
      {
        notification: 'Rebecca, Daisy and +11 others liked your post.',
        time: '10m ago',
        type: 'call',
      },
      {
        notification: 'Sofia, John and +19 others liked your post.',
        time: '10m ago',
        type: 'chat',
      },
      {
        notification: 'Sofia, John and +19 others liked your post.',
        time: '10m ago',
        type: 'chat',
      },
    ],
  },
];

export const appointmentsData = {
  upcoming: [
    {
      id: '1',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      type: 'call',
      status: 'Call Now',
    },
    {
      id: '2',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      type: 'chat',
      status: 'Chat',
    },
    {
      id: '3',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      type: 'call',
      status: 'Call',
    },
  ],
  completed: [
    {
      id: '4',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      status: 'Reschedule',
      type: 'call',
    },
    {
      id: '5',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      status: 'Reschedule',
      type: 'chat',
    },
  ],
  requested: [
    {
      id: '6',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      status: 'Pending',
      type: 'call',
    },
    {
      id: '7',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      status: 'Pending',
      type: 'chat',
    },
  ],
};

export const mentorAppointmentsData = {
  upcoming: [
    {
      id: '1',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      type: 'call',
      status: 'Join Now',
    },
    {
      id: '2',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      type: 'chat',
      status: 'Chat',
    },
    {
      id: '3',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      type: 'call',
      status: 'Call',
    },
  ],
  completed: [],
  requested: [
    {
      id: '6',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      status: 'View Details',
      type: 'View Details',
    },
    {
      id: '7',
      name: 'Ben Harvery',
      date: 'Sunday, 12 June',
      time: '11:00 – 12:30 AM',
      status: 'View Details',
      type: 'View Details',
    },
  ],
};

export const earningsData = [
  {id: 1, type: 'Received', amount: 20, date: 'Jan 4 2025, 11:40 AM'},
  {id: 2, type: 'Received', amount: 20, date: 'Jan 4 2025, 11:40 AM'},
  {id: 3, type: 'Withdraw', amount: -100, date: 'Jan 4 2025, 11:40 AM'},
  {id: 4, type: 'Received', amount: 10, date: 'Jan 4 2025, 11:40 AM'},
  {id: 5, type: 'Received', amount: 10, date: 'Jan 4 2025, 11:40 AM'},
  {id: 6, type: 'Received', amount: 20, date: 'Jan 4 2025, 11:40 AM'},
  {id: 7, type: 'Withdraw', amount: -100, date: 'Jan 4 2025, 11:40 AM'},
  {id: 8, type: 'Received', amount: 20, date: 'Jan 4 2025, 11:40 AM'},
];

export const banks = [
  'Bank of America',
  'JPMorgan Chase',
  'Wells Fargo',
  'Citibank',
  'U.S. Bank',
  'PNC Bank',
  'Capital One',
  'Truist Bank',
  'TD Bank',
  'Goldman Sachs Bank USA',
  'Morgan Stanley Bank',
  'HSBC Bank USA',
  'Fifth Third Bank',
  'KeyBank',
  'Regions Bank',
  'Citizens Bank',
  'Santander Bank',
  'Ally Bank',
  'American Express Bank',
  'First Republic Bank',
];

export const articles = [
  {
    title: 'How to stop overthinking?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod',
    date: 'Jan 4, 2025',
    image: imagePath.Article1,
  },
  {
    title: 'How to stop overthinking?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod',
    date: 'Jan 4, 2025',
    image: imagePath.Article1,
  },
  {
    title: 'How to stop overthinking?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod',
    date: 'Jan 4, 2025',
    image: imagePath.Article1,
  },
];

export const discoverItems = [
  {
    title: 'Self-help Articles',
    button: 'Articles',
    image: imagePath.Discover1,
    route: 'ArticlesScreen',
    headerTitle: 'Articles',
  },
  {
    title: 'Mental Health Tips',
    button: 'Tips',
    image: imagePath.Discover2,
    route: 'ArticlesScreen',
    headerTitle: 'Tips',
  },
  {
    title: 'Mindfulness Exercises',
    button: 'Exercises',
    image: imagePath.Discover3,
    route: 'ArticlesScreen',
    headerTitle: 'Exercises',
  },
  {
    title: 'Find A Mentor',
    button: 'Mentors',
    image: imagePath.Discover4,
    route: 'Mentors',
  },
];

export const findMentorData = [
  {
    key: 'call',
    title: 'Call $20/30 mins',
    desc: 'Speak directly with your mentor for immediate support.',
  },
  {
    key: 'chat',
    title: 'Chat $10/mins',
    desc: 'Start a conversation via text for flexible communication.',
  },
  {
    key: 'schedule',
    title: 'Schedule An Appointment',
    desc: 'Pick a time that works for you to connect with your mentor.',
  },
];
