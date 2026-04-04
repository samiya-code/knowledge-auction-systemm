import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { useApp } from '../context/AppContext';

const BiddingPanel = ({ course, auctionStatus, onJoinAuction, onStartAuction }) => {
  const { isAuthenticated, user, addNotification } = useApp();
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [currentBids, setCurrentBids] = useState([
    { id: 1, user: 'John D.', amount: 15.99, time: '2 min ago' },
    { id: 2, user: 'Sarah M.', amount: 12.50, time: '5 min ago' },
    { id: 3, user: 'Mike R.', amount: 10.00, time: '8 min ago' }
  ]);

  const deposit = course ? Math.round(course.price * 0.10 * 100) / 100 : 0;
  const minBid = course?.currentBid ? course.currentBid + 1 : deposit;

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to place a bid'
      });
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (!bidValue || bidValue < minBid) {
      addNotification({
        type: 'error',
        title: 'Invalid Bid',
        message: `Minimum bid is ${formatCurrency(minBid)}`
      });
      return;
    }

    setIsPlacingBid(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new bid to the list
      const newBid = {
        id: Date.now(),
        user: user?.name || 'You',
        amount: bidValue,
        time: 'Just now'
      };
      
      setCurrentBids(prev => [newBid, ...prev.slice(0, 4)]);
      
      // Update course current bid
      if (course) {
        course.currentBid = bidValue;
        course.bidCount = (course.bidCount || 0) + 1;
      }
      
      setBidAmount('');
      
      addNotification({
        type: 'success',
        title: 'Bid Placed!',
        message: `Your bid of ${formatCurrency(bidValue)} has been placed successfully`
      });
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Bid Failed',
        message: 'Failed to place bid. Please try again.'
      });
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleQuickBid = (amount) => {
    setBidAmount(amount.toString());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {auctionStatus?.status === 'active' ? '🔴 Live Auction' : '⏰ Upcoming Auction'}
      </h3>

      {/* Current Status */}
      <div className="mb-6">
        {auctionStatus?.status === 'active' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-800 font-medium">Current Bid</span>
              <span className="text-2xl font-bold text-red-900">
                {formatCurrency(course?.currentBid || deposit)}
              </span>
            </div>
            <div className="text-sm text-red-700">
              {course?.bidCount || 0} bids placed
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-800 font-medium mb-1">Auction Starting Soon</div>
            <div className="text-sm text-yellow-700">
              Be the first to bid when the auction starts!
            </div>
          </div>
        )}
      </div>

      {/* Bidding Interface */}
      {auctionStatus?.status === 'active' && (
        <div className="space-y-4">
          {/* Bid Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min: ${formatCurrency(minBid)}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={minBid}
                step="0.01"
              />
              <button
                onClick={handlePlaceBid}
                disabled={isPlacingBid || !bidAmount || parseFloat(bidAmount) < minBid}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isPlacingBid ? 'Placing...' : 'Place Bid'}
              </button>
            </div>
          </div>

          {/* Quick Bid Buttons */}
          <div>
            <div className="text-sm text-gray-600 mb-2">Quick Bid:</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickBid(minBid)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                {formatCurrency(minBid)}
              </button>
              <button
                onClick={() => handleQuickBid(minBid + 5)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                {formatCurrency(minBid + 5)}
              </button>
              <button
                onClick={() => handleQuickBid(minBid + 10)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                {formatCurrency(minBid + 10)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bids */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Recent Bids</h4>
        <div className="space-y-2">
          {currentBids.map((bid) => (
            <div key={bid.id} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {bid.user.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{bid.user}</div>
                  <div className="text-xs text-gray-500">{bid.time}</div>
                </div>
              </div>
              <div className="font-bold text-blue-600">
                {formatCurrency(bid.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {auctionStatus?.status === 'active' ? (
          <button
            onClick={onJoinAuction}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Join Auction - {formatCurrency(deposit)}
          </button>
        ) : (
          <button
            onClick={onStartAuction}
            className="w-full py-3 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
          >
            Start Auction Now
          </button>
        )}
        
        {!isAuthenticated && (
          <p className="text-xs text-gray-500 text-center">
            Login required to participate in auctions
          </p>
        )}
      </div>
    </div>
  );
};

export default BiddingPanel;
