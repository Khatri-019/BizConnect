const conversationsData = [
    {
        id: 1,
        user: {
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            title: 'Business Strategy Consultant',
            status: 'Online',
        },
        language: 'English, Spanish',
        lastMessage: 'Perfect, I will have the documents...',
        timestamp: '2 min ago',
        unreadCount: 2,
        messages: [
            { id: 1, text: 'Hi! Thanks for booking a consultation. I\'ve reviewed your business requirements.', time: '10:30 AM', type: 'received' },
            { id: 2, text: 'Great! I\'m looking forward to discussing my startup strategy with you.', time: '10:32 AM', type: 'sent' },
            { id: 3, text: 'I\'ve prepared some initial thoughts. Would you like to start with a video call to discuss the market analysis?', time: '10:35 AM', type: 'received' },
            { id: 4, text: 'That sounds perfect. I have the documents ready to share.', time: '10:37 AM', type: 'sent' },
        ],
    },
    {
        id: 2,
        user: {
            name: 'Michael Chen',
            avatar: 'https://i.pravatar.cc/150?u=michael',
            title: 'Tech Startup Advisor',
            status: 'Offline',
        },
        language: 'English, Mandarin',
        lastMessage: 'The product roadmap looks solid...',
        timestamp: '1 hour ago',
        unreadCount: 0,
        messages: [
            { id: 1, text: 'The product roadmap looks solid. Let\'s touch base tomorrow to finalize the next steps.', time: '9:15 AM', type: 'received' },
            { id: 2, text: 'Sounds good, Michael. Talk to you then.', time: '9:17 AM', type: 'sent' },
        ],
    },
    {
        id: 3,
        user: {
            name: 'Emma Rodriguez',
            avatar: 'https://i.pravatar.cc/150?u=emma',
            title: 'Marketing & Sales Expert',
            status: 'Offline',
        },
        language: 'English, Spanish',
        lastMessage: 'I\'ve created a marketing strategy d...',
        timestamp: '3 hours ago',
        unreadCount: 1,
        messages: [
            { id: 1, text: 'I\'ve created a marketing strategy draft based on our discussion. Please take a look when you have a moment.', time: '7:45 AM', type: 'received' },
             { id: 2, text: 'Thanks Emma, I will review it today.', time: '8:05 AM', type: 'sent' },
        ],
    },
];

export default conversationsData ; 