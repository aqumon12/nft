import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { createConfig, WagmiProvider } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { http } from 'wagmi'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const { connectors } = getDefaultWallets({
  appName: 'NFT Swap App',
  projectId: 'YOUR_PROJECT_ID',
})

const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http()
  },
  connectors
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={polygonAmoy} children={<Component {...pageProps} />}>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default MyApp 