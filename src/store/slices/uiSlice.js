import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auctionModal: {
    isOpen: false,
    nftId: null,
  },
  toast: {
    show: false,
    message: '',
    type: 'success', // success, error, info
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuctionModal: (state, action) => {
      state.auctionModal.isOpen = true;
      state.auctionModal.nftId = action.payload;
    },
    closeAuctionModal: (state) => {
      state.auctionModal.isOpen = false;
      state.auctionModal.nftId = null;
    },
    showToast: (state, action) => {
      state.toast.show = true;
      state.toast.message = action.payload.message;
      state.toast.type = action.payload.type || 'success';
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
  },
});

export const { openAuctionModal, closeAuctionModal, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer; 