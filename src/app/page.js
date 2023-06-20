"use client";
import { useMemo } from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { BlogProvider } from "./../context/Blog.jsx";
import dynamic from "next/dynamic";

const MainContent = dynamic(
  () => import("@/components/MainContent.jsx"),
  { ssr: false } // This line is important. It disables server-side rendering for the component.
);
function App() {
  const endpoint = "https://api.devnet.solana.com";

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <BlogProvider>
          <MainContent />
        </BlogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
