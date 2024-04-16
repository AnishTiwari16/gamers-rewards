'use client';
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { baseSepolia, bscTestnet } from 'wagmi/chains';

import { Toaster } from '@/components/ui/toaster';

const config = getDefaultConfig({
  appName: 'Eth dubai',
  projectId: 'c202788ea62428a99b1338ea6644daae',
  wallets: [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  chains: [bscTestnet, baseSepolia],
  ssr: false,
});

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize='compact'
          theme={darkTheme({
            ...darkTheme,
            accentColor: "#fff",
            accentColorForeground: "#020817"
          })}
        >
          <Toaster />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
