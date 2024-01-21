/** @format */

import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import HomePage from './Pages/HomePage.tsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePageContents from './Pages/HomePageContents';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { polygonZkEvmTestnet, gnosisChiado, neonDevnet, goerli , optimismGoerli, scrollSepolia, arbitrumSepolia, celoAlfajores,lineaTestnet,mantleTestnet} from 'wagmi/chains';
import Create from './Pages/Preferences';
import SendAssets from './Pages/SendAssets';
import sendNFTs from './Pages/SendAssets';
import { WagmiConfig, createConfig } from 'wagmi';
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: '2MCR81xh4vPrqI0y4SQtv09NTnb', // or infuraId
    walletConnectProjectId: '12a12e8b3daeab1b03edb985fb2da046',

    // Required
    appName: 'WalletSync',
  })
);
// https://youtube.com/shorts/ESfDVsjJKtM?feature=share
function App() {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={<HomePage pageContents={HomePageContents} />}
            />
            <Route
              path="/preferences"
              element={<HomePage pageContents={Create} />}
            />
            <Route
              path="/assets"
              element={<HomePage pageContents={sendNFTs} />}
            />
          </Routes>
        </Router>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
