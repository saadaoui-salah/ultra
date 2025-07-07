import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNFTs } from '../store/slices/nftSlice';
import { connectWallet } from '../store/slices/authSlice';
import { openAuctionModal } from '../store/slices/uiSlice';
import NFTCard from '../components/NFTCard';
import AuctionModal from '../components/AuctionModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { CubeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const NFTsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isConnected } = useSelector((state) => state.auth);
  const { items: nfts, isLoading, error } = useSelector((state) => state.nfts);
  const { auctionModal } = useSelector((state) => state.ui);

  useEffect(() => {
    // Check wallet connection on page load
    if (!isConnected) {
      dispatch(connectWallet({ onlyIfTrusted: true }));
    }
  }, [dispatch, isConnected]);

  useEffect(() => {
    // Redirect to login if not connected
    if (!isConnected && !isLoading) {
      navigate('/login');
    }
  }, [isConnected, isLoading, navigate]);

  useEffect(() => {
    // Fetch NFTs when connected
    if (isConnected) {
      dispatch(fetchNFTs());
    }
  }, [dispatch, isConnected]);

  const handleRefresh = () => {
    dispatch(fetchNFTs());
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NFT Collection</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Browse and auction your NFTs</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      )}

      {/* NFTs Grid */}
      {!isLoading && nfts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onSetupAuction={() => dispatch(openAuctionModal(nft.id))}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && nfts.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No NFTs found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating your first NFT.
          </p>
        </div>
      )}

      {/* Auction Modal */}
      {auctionModal.isOpen && (
        <AuctionModal nftId={auctionModal.nftId} />
      )}
    </div>
  );
};

export default NFTsPage; 