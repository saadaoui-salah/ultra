import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import LoginPage from './pages/LoginPage';
import MyNFTsPage from './pages/NFTsPage';
import MyAuctionsPage from './pages/MyAuctionsPage';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import './App.css';
import { ApolloProvider, apolloClient } from './apollo';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/nfts" element={<MyNFTsPage />} />
                <Route path="/my-auctions" element={<MyAuctionsPage />} />
              </Routes>
            </main>
            <Toast />
          </div>
        </Router>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
