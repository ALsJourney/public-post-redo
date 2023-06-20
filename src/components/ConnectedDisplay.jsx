import React, { useEffect, useState } from "react";
import Button from "src/components/Button.jsx";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useBlog } from "src/context/Blog.jsx";
import messageIcon from "./../../public/static/message.svg";
import Image from "next/image";

function ConnectedDisplay(props) {
  const [connecting, setConnecting] = useState(false);
  const { connected, select } = useWallet();
  const { user, initialized, initUser, setShowModal } = useBlog();

  const onConnect = () => {
    setConnecting(true);
    select(PhantomWalletName);
  };

  useEffect(() => {
    if (user) {
      setConnecting(false);
    }
  }, [user]);

  return (
    <div className={"flex flex-col items-center align-center"}>
      {initialized ? (
        <>
          <h1 className={"text-2xl md:text-4xl font-bold"}>
            Successfully initialized ✅
          </h1>
          <p className=" font-bold text-sm ml-2 capitalize md:text-2xl m-2">
            {user?.name}
          </p>

          <Button
            className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 relative top-2"
            onClick={() => {
              setShowModal(true);
            }}
            leftIcon={
              <Image
                src={messageIcon}
                alt="message"
                className="w-4 h-4 mr-4 logoicon"
              />
            }
          >
            Create Post
          </Button>
        </>
      ) : (
        <>
          <h1 className={"text-2xl md:text-4xl font-bold"}>
            We need to create a new user account first.
          </h1>

          <Button
            className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => {
              initUser();
            }}
          >
            Initialize User
          </Button>
        </>
      )}
    </div>
  );
}

export default ConnectedDisplay;
