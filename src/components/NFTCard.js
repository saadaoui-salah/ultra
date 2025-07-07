import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openAuctionModal } from '../store/slices/uiSlice';
import { showToast } from '../store/slices/uiSlice';
import { ScaleIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline';

const NFTCard = ({ nft, onSetupAuction }) => {
  const dispatch = useDispatch();
  const { walletId } = useSelector((state) => state.auth);

  const handleSetupAuction = () => {
    if (nft.inAuction) {
      dispatch(showToast({
        message: 'This NFT is already in an auction!',
        type: 'error'
      }));
      return;
    }

    if (nft.walletId !== walletId) {
      dispatch(showToast({
        message: 'You can only auction NFTs that you own!',
        type: 'error'
      }));
      return;
    }

    dispatch(openAuctionModal(nft.id));
    onSetupAuction();
  };

  const isOwner = nft.walletId === walletId;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* NFT Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=NFT+Image';
          }}
        />
        {nft.inAuction && (
          <div className="absolute top-2 right-2 tag-warning">
            In Auction
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {nft.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {nft.description}
          </p>
        </div>

        {/* Wallet ID */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <UserIcon className="h-4 w-4" />
          <span className="font-mono truncate">
            {nft.walletId}
          </span>
        </div>

        {/* NFT ID */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <TagIcon className="h-4 w-4" />
          <span className="font-mono truncate">
            {nft.id}
          </span>
        </div>

        {/* Bids Info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{nft.bids}</span> bids
          </div>
          {nft.inAuction && (
            <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              Active Auction
            </div>
          )}
        </div>

        {/* Action Button */}
        {isOwner && !nft.inAuction && (
          <button
            onClick={handleSetupAuction}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <ScaleIcon className="h-4 w-4" />
            <span>Setup Auction</span>
          </button>
        )}

        {!isOwner && (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            Not your NFT
          </div>
        )}

        {nft.inAuction && (
          <div className="text-sm text-yellow-600 dark:text-yellow-400 text-center py-2 font-medium">
            Already in auction
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard; 