export const demoElections = [
  {
    id: 1,
    title: "2024 Presidential Election",
    description: "National Presidential Election for the United States",
    startDate: "2024-01-15",
    endDate: "2024-11-05",
    status: "active",
    totalVoters: 240000000,
    registeredVoters: 158000000,
    candidates: [
      {
        id: 1,
        name: "John Smith",
        party: "Democratic Party",
        voteCount: 82000000
      },
      {
        id: 2,
        name: "Sarah Johnson",
        party: "Republican Party",
        voteCount: 76000000
      }
    ]
  },
  {
    id: 2,
    title: "State Senate Election",
    description: "State Senate Election for District 5",
    startDate: "2024-03-01",
    endDate: "2024-05-15",
    status: "upcoming",
    totalVoters: 500000,
    registeredVoters: 0,
    candidates: [
      {
        id: 1,
        name: "Michael Brown",
        party: "Independent",
        voteCount: 0
      },
      {
        id: 2,
        name: "Emily Davis",
        party: "Green Party",
        voteCount: 0
      }
    ]
  },
  {
    id: 3,
    title: "Student Union Board 2024",
    description: "Election for the student union board members who will represent student interests.",
    startDate: "2024-03-05",
    endDate: "2024-03-20",
    status: "upcoming",
    totalVotes: 0,
    registeredVoters: 600,
    candidates: [
      {
        id: 1,
        name: "Lisa Anderson",
        party: "Student Voice",
        description: "Advocating for student rights and better campus life.",
        voteCount: 0,
        image: "https://randomuser.me/api/portraits/women/3.jpg"
      },
      {
        id: 2,
        name: "Robert Taylor",
        party: "Future Leaders",
        description: "Focused on leadership development and student empowerment.",
        voteCount: 0,
        image: "https://randomuser.me/api/portraits/men/4.jpg"
      },
      {
        id: 3,
        name: "Maria Garcia",
        party: "Diversity First",
        description: "Promoting diversity and inclusion in student activities.",
        voteCount: 0,
        image: "https://randomuser.me/api/portraits/women/4.jpg"
      },
      {
        id: 4,
        name: "James Wilson",
        party: "Innovation Team",
        description: "Bringing new ideas and modern approaches to student union.",
        voteCount: 0,
        image: "https://randomuser.me/api/portraits/men/5.jpg"
      }
    ]
  }
];

export const demoVoters = [
  {
    id: 1,
    name: "Alice Cooper",
    email: "alice@example.com",
    registrationDate: "2024-02-15",
    status: "active",
    votedElections: [1, 2]
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@example.com",
    registrationDate: "2024-02-16",
    status: "active",
    votedElections: [1]
  },
  {
    id: 3,
    name: "Carol Smith",
    email: "carol@example.com",
    registrationDate: "2024-02-17",
    status: "active",
    votedElections: [2]
  }
];

export const demoResults = {
  title: "2024 Presidential Election",
  description: "National Presidential Election for the United States",
  totalVotes: 158000000,
  turnout: "65.8%",
  candidates: [
    {
      id: 1,
      name: "John Smith",
      party: "Democratic Party",
      voteCount: 82000000,
      percentage: "51.9%"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      party: "Republican Party",
      voteCount: 76000000,
      percentage: "48.1%"
    }
  ],
  timeline: [
    {
      date: "2024-01-15",
      description: "Election announced"
    },
    {
      date: "2024-02-01",
      description: "Candidate registration opened"
    },
    {
      date: "2024-03-15",
      description: "Voter registration deadline"
    },
    {
      date: "2024-11-05",
      description: "Election day"
    },
    {
      date: "2024-11-06",
      description: "Results announced"
    }
  ]
}; 