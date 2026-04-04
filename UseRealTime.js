import { useState, useEffect, useCallback } from 'react';
 
// Real-time auction hook for live updates
export const useRealTimeAuction = (courseId, initialStatus = 'upcoming') => {
  const [auctionData, setAuctionData] = useState({
    status: initialStatus,
    currentBid: 0,
    bidCount: 0,
    participants: [],
    timeLeft: 0,
    endTime: null,
    startTime: null,
    isLive: false
  });
 
  const [bids, setBids] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
 
  // Simulate real-time auction updates
  useEffect(() => {
    if (!courseId) return;
 
    const interval = setInterval(() => {
      setAuctionData(prev => {
        const now = new Date();
        let newData = { ...prev };
 
        // Update time left
        if (prev.endTime) {
          const timeLeft = prev.endTime - now;
          newData.timeLeft = Math.max(0, timeLeft);
 
          // Auto-start auction when time comes
          if (prev.status === 'upcoming' && timeLeft <= 0) {
            newData.status = 'active';
            newData.isLive = true;
            newData.startTime = now;
            newData.endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours auction
          }
 
          // End auction when time expires
          if (prev.status === 'active' && timeLeft <= 0) {
            newData.status = 'ended';
            newData.isLive = false;
          }
        }
 
        return newData;
      });
    }, 1000); // Update every second
 
    return () => clearInterval(interval);
  }, [courseId]);
 
  // Simulate other users bidding
  useEffect(() => {
    if (!auctionData.isLive) return;
 
    const interval = setInterval(() => {
      // Random bid from other users (30% chance every 5 seconds)
      if (Math.random() < 0.3) {
        const otherUsers = ['Alice M.', 'Bob K.', 'Carol L.', 'David R.', 'Emma S.'];
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const minBid = auctionData.currentBid + 1;
        const newBid = minBid + Math.floor(Math.random() * 10); // Random amount $1-10 above minimum
 
        const newBidData = {
          id: Date.now(),
          user: randomUser,
          amount: newBid,
          time: 'Just now',
          isCurrentUser: false
        };
 
        setBids(prev => [newBidData, ...prev.slice(0, 9)]); // Keep last 10 bids
        setAuctionData(prev => ({
          ...prev,
          currentBid: newBid,
          bidCount: prev.bidCount + 1
        }));
      }
    }, 5000); // Check every 5 seconds
 
    return () => clearInterval(interval);
  }, [auctionData.isLive, auctionData.currentBid]);
 
  // Place bid function
  const placeBid = useCallback(async (amount, user) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
 
    if (amount <= auctionData.currentBid) {
      throw new Error('Bid must be higher than current bid');
    }
 
    setIsUpdating(true);
 
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
 
      const newBidData = {
        id: Date.now(),
        user: user.name || 'You',
        amount: amount,
        time: 'Just now',
        isCurrentUser: true
      };
 
      setBids(prev => [newBidData, ...prev]);
      setAuctionData(prev => ({
        ...prev,
        currentBid: amount,
        bidCount: prev.bidCount + 1
      }));
 
      return { success: true, bid: newBidData };
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [auctionData.currentBid]);
 
  // Start auction function
  const startAuction = useCallback(async () => {
    if (auctionData.status !== 'upcoming') {
      throw new Error('Auction cannot be started');
    }
 
    setIsUpdating(true);
 
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
 
      const now = new Date();
      setAuctionData({
        status: 'active',
        currentBid: 10, // Starting bid
        bidCount: 0,
        participants: [],
        timeLeft: 2 * 60 * 60 * 1000, // 2 hours
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        startTime: now,
        isLive: true
      });
 
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [auctionData.status]);
 
  return {
    auctionData,
    bids,
    isUpdating,
    placeBid,
    startAuction,
    timeLeft: auctionData.timeLeft,
    currentBid: auctionData.currentBid,
    bidCount: auctionData.bidCount,
    isLive: auctionData.isLive,
    status: auctionData.status
  };
};