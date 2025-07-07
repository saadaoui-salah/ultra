import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { disconnectWallet } from '../store/slices/authSlice';
import { WalletIcon, HomeIcon, CubeIcon, ScaleIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { walletId, isConnected } = useSelector((state) => state.auth);

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <CubeIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">NFT Auction</span>
            </Link>
          </div>

          {/* Navigation Links */}
          {isConnected && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/nfts"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/nfts')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <HomeIcon className="h-5 w-5" />
                <span>NFTs</span>
              </Link>
              <Link
                to="/my-auctions"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/my-auctions')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ScaleIcon className="h-5 w-5" />
                <span>My Auctions</span>
              </Link>
            </div>
          )}

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 px-3 py-2 rounded-lg">
                  <WalletIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {walletId?.substring(0, 8)}...
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <WalletIcon className="h-4 w-4" />
                <span className="text-sm">Not Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 