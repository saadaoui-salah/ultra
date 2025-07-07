import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Check if Ultra wallet is installed
const isUltraWalletInstalled = () => {
  return typeof window !== 'undefined' && window.ultra;
};

// Real Ultra wallet connection
const connectToUltraWallet = async ({ onlyIfTrusted = false }) => {
  if (!isUltraWalletInstalled()) {
    throw new Error('Ultra Wallet extension not found. Please install it from ultra.io/download');
  }

  try {
    const response = await window.ultra.connect({ onlyIfTrusted });
    return {
      success: true,
      walletId: response.data.blockchainid,
      publicKey: response.data.publicKey,
      isTrusted: onlyIfTrusted
    };
  } catch (error) {
    if (onlyIfTrusted) {
      throw new Error('User not trusted. Please login to your Ultra Wallet.');
    } else {
      throw new Error('Failed to connect to Ultra Wallet. Please try again.');
    }
  }
};

// Disconnect from Ultra wallet
const disconnectFromUltraWallet = async () => {
  if (!isUltraWalletInstalled()) {
    return { success: true };
  }

  try {
    await window.ultra.disconnect();
    return { success: true };
  } catch (error) {
    // User might have cancelled the disconnect
    return { success: true };
  }
};

export const checkWalletInstallation = createAsyncThunk(
  'auth/checkWalletInstallation',
  async (_, { rejectWithValue }) => {
    if (!isUltraWalletInstalled()) {
      return rejectWithValue('Ultra Wallet extension not found');
    }
    return { installed: true };
  }
);

export const connectWallet = createAsyncThunk(
  'auth/connectWallet',
  async ({ onlyIfTrusted = false }, { rejectWithValue }) => {
    try {
      const result = await connectToUltraWallet({ onlyIfTrusted });
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const disconnectWallet = createAsyncThunk(
  'auth/disconnectWallet',
  async (_, { rejectWithValue }) => {
    try {
      const result = await disconnectFromUltraWallet();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  walletId: null,
  publicKey: null,
  isConnected: false,
  isTrusted: false,
  isWalletInstalled: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setWalletInstalled: (state, action) => {
      state.isWalletInstalled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkWalletInstallation.fulfilled, (state) => {
        state.isWalletInstalled = true;
        state.error = null;
      })
      .addCase(checkWalletInstallation.rejected, (state, action) => {
        state.isWalletInstalled = false;
        state.error = action.payload;
      })
      .addCase(connectWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = true;
        state.walletId = action.payload.walletId;
        state.publicKey = action.payload.publicKey;
        state.isTrusted = action.payload.isTrusted;
        state.error = null;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(disconnectWallet.fulfilled, (state) => {
        state.walletId = null;
        state.publicKey = null;
        state.isConnected = false;
        state.isTrusted = false;
        state.error = null;
      })
      .addCase(disconnectWallet.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setWalletInstalled } = authSlice.actions;
export default authSlice.reducer; 