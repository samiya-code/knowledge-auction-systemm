export const mockLeaderboard = [
  {
    rank: 1,
    userId: "user1",
    name: "Alice Johnson",
    avatar: "/images/avatars/alice.jpg",
    score: 95,
    timeTaken: 285, // seconds
    discount: 100,
    depositPaid: 10,
    refundAmount: 10,
    finalPrice: 0,
    joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    rank: 2,
    userId: "user2",
    name: "Bob Smith",
    avatar: "/images/avatars/bob.jpg",
    score: 92,
    timeTaken: 312,
    discount: 80,
    depositPaid: 15,
    refundAmount: 12,
    finalPrice: 30,
    joinedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
  },
  {
    rank: 3,
    userId: "user3",
    name: "Carol Williams",
    avatar: "/images/avatars/carol.jpg",
    score: 88,
    timeTaken: 298,
    discount: 80,
    depositPaid: 9,
    refundAmount: 7.2,
    finalPrice: 18,
    joinedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    rank: 4,
    userId: "user4",
    name: "David Brown",
    avatar: "/images/avatars/david.jpg",
    score: 85,
    timeTaken: 340,
    discount: 80,
    depositPaid: 12,
    refundAmount: 9.6,
    finalPrice: 24,
    joinedAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    rank: 5,
    userId: "user5",
    name: "Emma Davis",
    avatar: "/images/avatars/emma.jpg",
    score: 82,
    timeTaken: 325,
    discount: 80,
    depositPaid: 7,
    refundAmount: 5.6,
    finalPrice: 14,
    joinedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    rank: 6,
    userId: "user6",
    name: "Frank Miller",
    avatar: "/images/avatars/frank.jpg",
    score: 78,
    timeTaken: 355,
    discount: 50,
    depositPaid: 10,
    refundAmount: 4,
    finalPrice: 50,
    joinedAt: new Date(Date.now() - 20 * 60 * 1000)
  },
  {
    rank: 7,
    userId: "user7",
    name: "Grace Wilson",
    avatar: "/images/avatars/grace.jpg",
    score: 75,
    timeTaken: 368,
    discount: 50,
    depositPaid: 8,
    refundAmount: 3.2,
    finalPrice: 40,
    joinedAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    rank: 8,
    userId: "user8",
    name: "Henry Moore",
    avatar: "/images/avatars/henry.jpg",
    score: 72,
    timeTaken: 382,
    discount: 50,
    depositPaid: 11,
    refundAmount: 4.4,
    finalPrice: 55,
    joinedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    rank: 9,
    userId: "user9",
    name: "Iris Taylor",
    avatar: "/images/avatars/iris.jpg",
    score: 68,
    timeTaken: 395,
    discount: 50,
    depositPaid: 9,
    refundAmount: 3.6,
    finalPrice: 45,
    joinedAt: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    rank: 10,
    userId: "user10",
    name: "Jack Anderson",
    avatar: "/images/avatars/jack.jpg",
    score: 65,
    timeTaken: 410,
    discount: 50,
    depositPaid: 6,
    refundAmount: 2.4,
    finalPrice: 30,
    joinedAt: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    rank: 11,
    userId: "user11",
    name: "Kate Thomas",
    avatar: "/images/avatars/kate.jpg",
    score: 62,
    timeTaken: 425,
    discount: 20,
    depositPaid: 14,
    refundAmount: 2.8,
    finalPrice: 112,
    joinedAt: new Date(Date.now() - 1 * 60 * 1000)
  },
  {
    rank: 12,
    userId: "user12",
    name: "Leo Jackson",
    avatar: "/images/avatars/leo.jpg",
    score: 58,
    timeTaken: 440,
    discount: 15,
    depositPaid: 8,
    refundAmount: 1.2,
    finalPrice: 68,
    joinedAt: new Date(Date.now() - 30 * 1000)
  },
  {
    rank: 13,
    userId: "user13",
    name: "Mia White",
    avatar: "/images/avatars/mia.jpg",
    score: 55,
    timeTaken: 455,
    discount: 10,
    depositPaid: 10,
    refundAmount: 0.8,
    finalPrice: 90,
    joinedAt: new Date(Date.now() + 2 * 60 * 1000)
  },
  {
    rank: 14,
    userId: "user14",
    name: "Noah Harris",
    avatar: "/images/avatars/noah.jpg",
    score: 52,
    timeTaken: 470,
    discount: 8,
    depositPaid: 12,
    refundAmount: 0.96,
    finalPrice: 110,
    joinedAt: new Date(Date.now() + 5 * 60 * 1000)
  },
  {
    rank: 15,
    userId: "user15",
    name: "Olivia Martin",
    avatar: "/images/avatars/olivia.jpg",
    score: 48,
    timeTaken: 485,
    discount: 5,
    depositPaid: 7,
    refundAmount: 0.28,
    finalPrice: 95,
    joinedAt: new Date(Date.now() + 8 * 60 * 1000)
  }
];

export const getDiscountByRank = (rank) => {
  if (rank === 1) return 100;
  if (rank <= 10) return 80;
  if (rank <= 50) return 50;
  if (rank <= 100) return 20;
  if (rank <= 200) return 10;
  return 5;
};

export const calculateRefund = (depositPaid, rank) => {
  // Refund 80% of deposit for most participants
  // Higher ranks get better refund rates
  let refundRate = 0.8; // 80% base refund rate
  
  if (rank === 1) refundRate = 1.0; // 100% refund for rank 1
  else if (rank <= 10) refundRate = 0.9; // 90% refund for top 10
  else if (rank <= 50) refundRate = 0.85; // 85% refund for top 50
  
  return Math.round(depositPaid * refundRate * 100) / 100;
};

export const calculateFinalPrice = (originalPrice, discount) => {
  return Math.round(originalPrice * (1 - discount / 100) * 100) / 100;
};
