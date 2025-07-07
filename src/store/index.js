import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import nftReducer from './slices/nftSlice';
import auctionReducer from './slices/auctionSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nfts: nftReducer,
    auctions: auctionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store; 