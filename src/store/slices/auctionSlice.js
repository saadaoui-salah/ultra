import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock auction data
const mockAuctions = [
  {
    id: 'auction_001',
    nftId: 'nft_003',
    nftName: 'Neon City Lights',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-20T18:00:00Z',
    startPrice: '2.50000000',
    currentPrice: '3.75000000',
    highestBid: '3.75000000',
    numberOfBids: 12,
    promoter: 'ultra_promoter1',
    memo: 'Amazing cyberpunk artwork',
    status: 'active', // active, completed, cancelled
    createdBy: 'ultra_ghi789',
  },
  {
    id: 'auction_002',
    nftId: 'nft_005',
    nftName: 'Quantum Particles',
    startTime: '2024-01-10T14:00:00Z',
    endTime: '2024-01-25T20:00:00Z',
    startPrice: '1.25000000',
    currentPrice: '2.10000000',
    highestBid: '2.10000000',
    numberOfBids: 8,
    promoter: 'ultra_promoter2',
    memo: 'Scientific art piece',
    status: 'active',
    createdBy: 'ultra_mno345',
  },
  {
    id: 'auction_003',
    nftId: 'nft_007',
    nftName: 'Vintage Collection',
    startTime: '2024-01-01T09:00:00Z',
    endTime: '2024-01-10T17:00:00Z',
    startPrice: '5.00000000',
    currentPrice: '7.50000000',
    highestBid: '7.50000000',
    numberOfBids: 15,
    promoter: 'ultra_promoter3',
    memo: 'Rare vintage digital art',
    status: 'completed',
    createdBy: 'ultra_abc123',
  },
];

// Mock create auction function
const mockCreateAuction = async (auctionData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate token refresh
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate success/failure
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    const newAuction = {
      id: 'auction_' + Math.random().toString(36).substr(2, 9),
      ...auctionData,
      status: 'active',
      numberOfBids: 0,
      currentPrice: auctionData.startPrice,
      highestBid: auctionData.startPrice,
    };
    return newAuction;
  } else {
    throw new Error('Failed to create auction. Please try again.');
  }
};

// Mock fetch user auctions
const mockFetchUserAuctions = async (walletId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAuctions.filter(auction => auction.createdBy === walletId);
};

export const createAuction = createAsyncThunk(
  'auctions/createAuction',
  async (auctionData, { rejectWithValue }) => {
    try {
      const auction = await mockCreateAuction(auctionData);
      return auction;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserAuctions = createAsyncThunk(
  'auctions/fetchUserAuctions',
  async (walletId, { rejectWithValue }) => {
    try {
      const auctions = await mockFetchUserAuctions(walletId);
      return auctions;
    } catch (error) {
      return rejectWithValue('Failed to fetch auctions');
    }
  }
);

const initialState = {
  userAuctions: [],
  isLoading: false,
  error: null,
  lastCreated: null,
};

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastCreated: (state) => {
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAuction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastCreated = action.payload;
        state.userAuctions.push(action.payload);
        state.error = null;
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAuctions = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastCreated } = auctionSlice.actions;
export default auctionSlice.reducer; 