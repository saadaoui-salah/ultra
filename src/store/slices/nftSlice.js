import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showToast } from './uiSlice';
import { apolloClient } from '../../apollo';
import { gql } from '@apollo/client';

const UNIQS_OF_WALLET = gql`
  query UniqsOfWallet($pagination: PaginationInput, $resale: Boolean, $walletId: WalletId!) {
    uniqsOfWallet(pagination: $pagination, resale: $resale, walletId: $walletId) {
      data {
        id
        metadata {
          content {
            medias {
              product {
                uri
              }
            }
            name
            properties
            resources {
              key
              value {
                contentType
                integrity {
                  hash
                  type
                }
                uri
              }
            }
            subName
          }
        }
        owner
      }
      pagination {
        limit
        skip
      }
      totalCount
    }
  }
`;

export const fetchNFTs = createAsyncThunk(
  'nfts/fetchNFTs',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const walletId = getState().auth.walletId;
      if (!walletId) throw new Error('Wallet not connected');
      const { data } = await apolloClient.query({
        query: UNIQS_OF_WALLET,
        variables: {
          pagination: { limit: 25, skip: 0 },
          walletId,
        },
        fetchPolicy: 'network-only',
      });
      const nfts = data.uniqsOfWallet.data;
      return nfts.map(nft => ({
        id: nft.id,
        name: nft.metadata?.content?.name || 'Unnamed NFT',
        image: nft.metadata?.content?.medias?.[0]?.product?.uri || '',
        walletId: nft.owner,
        description: nft.metadata?.content?.subName || '',
        bids: 0,
        inAuction: false,
      }));
    } catch (error) {
      dispatch(showToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
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