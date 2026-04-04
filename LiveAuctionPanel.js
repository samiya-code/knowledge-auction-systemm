import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { useRealTimeAuction } from '../hooks/useRealTimeAuction';
import { useApp } from '../context/AppContext';

const LiveAuctionPanel = ({ course }) => {
  const { isAuthenticated, user, addNotification } = useApp();
  const [bidAmount, setBidAmount] = useState('');
  const [showBidHistory, setShowBidHistory] = useState(false);

  // Use real-time auction hook
  const {
    auctionData,
    bids,
    isUpdating,
    placeBid,
    startAuction,
    timeLeft,
    currentBid,
    bidCount,
    isLive,
    status
  } = useRealTimeAuction(course.id, course.auctionStatus?.status || 'upcoming');

  const deposit = course ? Math.round(course.price * 0.10 * 100) / 100 : 0;
  const minBid = currentBid + 1;

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to place bids'
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

    try {
      await placeBid(bidValue, user);
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
        message: error.message || 'Failed to place bid'
      });
    }
  };

  const handleStartAuction = async () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to start auction'
      });
      return;
    }

    try {
      await startAuction();
      
      addNotification({
        type: 'success',
        title: 'Auction Started!',
        message: 'The auction is now live! Start placing your bids!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Start Failed',
        message: error.message || 'Failed to start auction'
      });
    }
  };

  const formatTimeLeft = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return 'Ended';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}m ${seconds}s`;
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'upcoming':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'ended':
        return 'bg-gray-50 border-gray-200 text-gray-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return '🔴';
      case 'upcoming':
        return '⏰';
      case 'ended':
        return '🏁';
      default:
        return '❓';
    }
  };

  const progressWidth = status === 'active' 
    ? `${Math.max(0, (1 - timeLeft / (2 * 60 * 60 * 1000)) * 100)}%`
    : '0%';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {getStatusIcon()} {status === 'active' ? 'Live Auction' : status === 'upcoming' ? 'Upcoming Auction' : 'Auction Ended'}
        </h3>
        
        {/* Live Indicator */}
        {isLive && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-600">LIVE</span>
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className={`rounded-lg p-4 mb-6 border ${getStatusColor()}`}>
        {status === 'active' ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Current Bid</span>
              <span className="text-2xl font-bold">{formatCurrency(currentBid)}</span>
            </div>
            <div className="text-sm text-gray-600">
              {bidCount} bids placed • {bids.length} recent activity
            </div>
          </div>
        ) : status === 'upcoming' ? (
          <div className="text-center">
            <div className="text-lg font-medium mb-2">Auction Starting Soon</div>
            <div className="text-sm text-gray-600">
              Be the first to bid when the auction goes live!
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-lg font-medium mb-2">Auction Has Ended</div>
            <div className="text-sm text-gray-600">
              Final bid: {formatCurrency(currentBid)} • {bidCount} total bids
            </div>
          </div>
        )}
      </div>

      {/* Timer */}
      {(status === 'active' || status === 'upcoming') && (
        <div className="mb-6">
          <div className="text-center mb-2">
            <div className="text-sm font-medium text-gray-600">
              {status === 'active' ? '⏰ Auction ends in:' : '🚀 Auction starts in:'}
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {formatTimeLeft(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      )}

      {/* Bidding Interface */}
      {status === 'active' && (
        <div className="space-y-4">
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
                disabled={isUpdating || !bidAmount || parseFloat(bidAmount) < minBid}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Placing...' : 'Place Bid'}
              </button>
            </div>
          </div>

          {/* Quick Bid Buttons */}
          <div>
            <div className="text-sm text-gray-600 mb-2">Quick Bid:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setBidAmount(minBid.toString())}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                {formatCurrency(minBid)}
              </button>
              <button
                onClick={() => setBidAmount((minBid + 5).toString())}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                {formatCurrency(minBid + 5)}
              </button>
              <button
                onClick={() => setBidAmount((minBid + 10).toString())}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
              >
                {formatCurrency(minBid + 10)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Auction Button */}
      {status === 'upcoming' && (
        <button
          onClick={handleStartAuction}
          disabled={isUpdating}
          className="w-full py-3 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isUpdating ? 'Starting...' : '🚀 Start Auction Now'}
        </button>
      )}

      {/* Join Auction Button */}
      {status === 'active' && (
        <button
          onClick={() => {
            // Navigate to quiz page
            window.location.href = `/quiz/${course.id}`;
          }}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Join Auction - {formatCurrency(deposit)}
        </button>
      )}

      {!isAuthenticated && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Login required to participate in auctions
        </p>
      )}

      {/* Bid History Toggle */}
      {bids.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowBidHistory(!showBidHistory)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showBidHistory ? 'Hide' : 'Show'} Bid History ({bids.length})
          </button>
        </div>
      )}

      {/* Recent Bids */}
      {showBidHistory && bids.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Recent Bids</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bids.map((bid) => (
              <div 
                key={bid.id} 
                className={`flex items-center justify-between py-2 border-b border-gray-100 ${
                  bid.isCurrentUser ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {bid.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {bid.user}
                      {bid.isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                      )}
                    </div>
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
      )}
    </div>
  );
};

export default LiveAuctionPanel;