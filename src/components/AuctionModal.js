import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { createAuction } from '../store/slices/auctionSlice';
import { closeAuctionModal, showToast } from '../store/slices/uiSlice';
import { updateNFTAuctionStatus } from '../store/slices/nftSlice';

const AuctionModal = ({ nftId }) => {
  const dispatch = useDispatch();
  const { walletId } = useSelector((state) => state.auth);
  const { items: nfts } = useSelector((state) => state.nfts);
  const { isLoading } = useSelector((state) => state.auctions);
  const { auctionModal } = useSelector((state) => state.ui);

  const nft = nfts.find(n => n.id === nftId);

  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    startPrice: '',
    promoter: '',
    memo: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Set default start time to now + 1 hour
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    setFormData(prev => ({
      ...prev,
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.startPrice) {
      newErrors.startPrice = 'Start price is required';
    } else if (parseFloat(formData.startPrice) <= 0) {
      newErrors.startPrice = 'Start price must be greater than 0';
    }

    if (!formData.promoter) {
      newErrors.promoter = 'Promoter is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const auctionData = {
      nftId,
      nftName: nft?.name || 'Unknown NFT',
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      startPrice: parseFloat(formData.startPrice).toFixed(8),
      promoter: formData.promoter,
      memo: formData.memo,
      createdBy: walletId,
    };

    try {
      const result = await dispatch(createAuction(auctionData)).unwrap();
      
      // Update NFT auction status
      dispatch(updateNFTAuctionStatus({ nftId, inAuction: true }));
      
      // Show success message
      dispatch(showToast({
        message: `Auction created successfully! Auction ID: ${result.id}, NFT ID: ${nftId}`,
        type: 'success'
      }));
      
      // Close modal
      dispatch(closeAuctionModal());
      
      // Reset form
      setFormData({
        startTime: '',
        endTime: '',
        startPrice: '',
        promoter: '',
        memo: '',
      });
      setErrors({});
      
    } catch (error) {
      dispatch(showToast({
        message: error || 'Failed to create auction. Please try again.',
        type: 'error'
      }));
    }
  };

  const handleClose = () => {
    dispatch(closeAuctionModal());
    setErrors({});
  };

  if (!nft) return null;

  return (
    <Dialog
      open={auctionModal.isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-md w-full p-6 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Setup Auction
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* NFT Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-900">{nft.name}</h4>
                <p className="text-sm text-gray-600">ID: {nft.id}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className={`input-field pl-10 ${errors.startTime ? 'border-red-300' : ''}`}
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className={`input-field pl-10 ${errors.endTime ? 'border-red-300' : ''}`}
                />
              </div>
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>

            {/* Start Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Price (ULTRA)
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={formData.startPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, startPrice: e.target.value }))}
                  placeholder="2.50000000"
                  className={`input-field pl-10 ${errors.startPrice ? 'border-red-300' : ''}`}
                />
              </div>
              {errors.startPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.startPrice}</p>
              )}
            </div>

            {/* Promoter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promoter
              </label>
              <input
                type="text"
                value={formData.promoter}
                onChange={(e) => setFormData(prev => ({ ...prev, promoter: e.target.value }))}
                placeholder="Enter promoter wallet ID"
                className={`input-field ${errors.promoter ? 'border-red-300' : ''}`}
              />
              {errors.promoter && (
                <p className="mt-1 text-sm text-red-600">{errors.promoter}</p>
              )}
            </div>

            {/* Memo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Memo (Optional)
              </label>
              <textarea
                value={formData.memo}
                onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                placeholder="Add a description for your auction"
                rows="3"
                className="input-field resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Auction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AuctionModal; 