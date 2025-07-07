import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { ScaleIcon, ClockIcon, CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/outline';

const AuctionCard = ({ auction }) => {
  const dispatch = useDispatch();
  const { walletId } = useSelector((state) => state.auth);

  const isActive = auction.status === 'active';
  const isCompleted = auction.status === 'completed';
  const isOwner = auction.createdBy === walletId;

  const handleCancel = () => {
    // Mock cancel auction
    dispatch(showToast({
      message: `Auction ${auction.id} cancelled successfully!`,
      type: 'success'
    }));
  };

  const handleSettle = () => {
    // Mock settle auction
    dispatch(showToast({
      message: `Auction ${auction.id} settled successfully! Highest bid: ${auction.highestBid} ULTRA`,
      type: 'success'
    }));
  };

  const getStatusColor = () => {
    switch (auction.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {auction.nftName}
          </h3>
          <p className="text-sm text-gray-600">Auction #{auction.id}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {auction.status}
        </span>
      </div>

      {/* Auction Details */}
      <div className="space-y-3">
        {/* NFT ID */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ScaleIcon className="h-4 w-4" />
          <span className="font-mono truncate">
            NFT: {auction.nftId}
          </span>
        </div>

        {/* Time Range */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>Start: {formatDate(auction.startTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 ml-6">
            <span>End: {formatDate(auction.endTime)}</span>
          </div>
        </div>

        {/* Price Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm">
            <span className="text-gray-600">Start Price:</span>
            <div className="font-medium text-gray-900">
              {parseFloat(auction.startPrice).toFixed(8)} ULTRA
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Current Price:</span>
            <div className="font-medium text-gray-900">
              {parseFloat(auction.currentPrice).toFixed(8)} ULTRA
            </div>
          </div>
        </div>

        {/* Bids Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">{auction.numberOfBids}</span> bids
          </div>
          <div className="text-gray-600">
            Highest: <span className="font-medium">{parseFloat(auction.highestBid).toFixed(8)} ULTRA</span>
          </div>
        </div>

        {/* Promoter */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <UserIcon className="h-4 w-4" />
          <span className="font-mono truncate">
            Promoter: {auction.promoter}
          </span>
        </div>

        {/* Memo */}
        {auction.memo && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            "{auction.memo}"
          </div>
        )}

        {/* Action Buttons */}
        {isOwner && (
          <div className="flex space-x-2 pt-2">
            {isActive && (
              <button
                onClick={handleCancel}
                className="btn-secondary flex-1 text-sm"
              >
                Cancel Auction
              </button>
            )}
            {isCompleted && (
              <button
                onClick={handleSettle}
                className="btn-primary flex-1 text-sm flex items-center justify-center space-x-1"
              >
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>Settle</span>
              </button>
            )}
          </div>
        )}

        {!isOwner && (
          <div className="text-sm text-gray-500 text-center py-2">
            Not your auction
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionCard; 