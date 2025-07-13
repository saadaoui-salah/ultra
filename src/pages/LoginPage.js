import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { connectWallet, checkWalletInstallation } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { WalletIcon, ArrowRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    walletId, 
    isConnected, 
    isWalletInstalled, 
    isLoading, 
    error 
  } = useSelector((state) => state.auth);
  // double check all code here bcz when ultra is installed, it kept loading forever
  // add needed logs to debug the issue  
  console.log('isWalletInstalled', isWalletInstalled);
  console.log('isConnected', isConnected);
  console.log('isLoading', isLoading);
  console.log('error', error);
  console.log('walletId', walletId);



  useEffect(() => {
    dispatch(checkWalletInstallation());
  }, [dispatch]); 
    

useEffect(() => {
  if (isWalletInstalled && !isConnected && !isLoading && !error) {
    dispatch(connectWallet({ onlyIfTrusted: true }));
  }
}, [dispatch, isWalletInstalled, isConnected, isLoading]);


  useEffect(() => {
    // Redirect to NFTs page if connected
    if (isConnected) {
      navigate('/nfts');
    }
  }, [isConnected, navigate]);

  const handleConnectWallet = () => {
    dispatch(connectWallet({ onlyIfTrusted: false }));
  };

  const handleProceedToAuction = () => {
    navigate('/nfts');
  };

  const handleInstallWallet = () => {
    window.open('https://ultra.io/download', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Connecting to Ultra Wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
            <WalletIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to NFT Auction
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Connect your Ultra wallet to start trading NFTs
          </p>
        </div>

        <div className="card">
          {!isWalletInstalled ? (
            <div className="text-center space-y-4">
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <span className="text-red-200 font-medium">Ultra Wallet Not Found</span>
                </div>
                <p className="text-red-200 text-sm">
                  Please install the Ultra Wallet extension to continue.
                </p>
              </div>
              <button
                onClick={handleInstallWallet}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <WalletIcon className="h-5 w-5" />
                <span>Install Ultra Wallet</span>
              </button>
              <p className="text-xs text-gray-400">
                After installation, refresh this page to continue.
              </p>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
              <button
                onClick={handleConnectWallet}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <WalletIcon className="h-5 w-5" />
                <span>Connect Wallet</span>
              </button>
            </div>
          ) : isConnected ? (
            <div className="text-center space-y-4">
              <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
                <p className="text-green-200 font-medium">
                  Your wallet ID is: <span className="font-mono">{walletId}</span>
                </p>
              </div>
              <button
                onClick={handleProceedToAuction}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Proceed to Auction</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleConnectWallet}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <WalletIcon className="h-5 w-5" />
                <span>Connect Wallet</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            By connecting your wallet, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 