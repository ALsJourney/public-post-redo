import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolflareWalletName } from "@solana/wallet-adapter-wallets";
import { useBlog } from "src/context/Blog.jsx";
import FirstDisplay from "src/components/FirstDisplay.jsx";
import ConnectedDisplay from "src/components/ConnectedDisplay.jsx";
import PostList from "src/components/PostList.jsx";

export default function VideoPlayback(props) {
  const [connecting, setConnecting] = useState(false);
  const { connected, select } = useWallet();
  const { user } = useBlog();

  const onConnect = () => {
    setConnecting(true);
    select(SolflareWalletName);
  };

  useEffect(() => {
    if (user) {
      setConnecting(false);
    }
  }, [user]);

  return (
    <main>
      <div className="overlay"></div>
      <video autoPlay={true} loop={true} muted>
        <source src="/static/he_sold.mp4" type="video/mp4" />
      </video>
      {connected ? (
        <div className={"content mt-8"}>
          <ConnectedDisplay />
          <PostList />
        </div>
      ) : (
        <FirstDisplay />
      )}
    </main>
  );
}
