import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock NFT data
const mockNFTs = [
  {
    id: 'nft_001',
    name: 'Cosmic Warrior #1',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop',
    walletId: 'ultra_abc123',
    description: 'A legendary warrior from the cosmic realm',
    bids: 5,
    inAuction: false,
  },
  {
    id: 'nft_002',
    name: 'Digital Dreamscape',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    walletId: 'ultra_def456',
    description: 'Abstract digital art piece',
    bids: 0,
    inAuction: false,
  },
  {
    id: 'nft_003',
    name: 'Neon City Lights',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    walletId: 'ultra_ghi789',
    description: 'Cyberpunk cityscape at night',
    bids: 12,
    inAuction: true,
  },
  {
    id: 'nft_004',
    name: 'Mystic Forest',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    walletId: 'ultra_jkl012',
    description: 'Enchanted forest scene',
    bids: 3,
    inAuction: false,
  },
  {
    id: 'nft_005',
    name: 'Quantum Particles',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    walletId: 'ultra_mno345',
    description: 'Scientific visualization of quantum mechanics',
    bids: 8,
    inAuction: true,
  },
];

// Mock GraphQL-like function
const mockFetchNFTs = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate token refresh
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockNFTs;
};

export const fetchNFTs = createAsyncThunk(
  'nfts/fetchNFTs',
  async (_, { rejectWithValue }) => {
    try {
      const nfts = await mockFetchNFTs();
      return nfts;
    } catch (error) {
      return rejectWithValue('Failed to fetch NFTs');
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const nftSlice = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    updateNFTAuctionStatus: (state, action) => {
      const { nftId, inAuction } = action.payload;
      const nft = state.items.find(item => item.id === nftId);
      if (nft) {
        nft.inAuction = inAuction;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNFTs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNFTs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchNFTs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateNFTAuctionStatus, clearError } = nftSlice.actions;
export default nftSlice.reducer; 