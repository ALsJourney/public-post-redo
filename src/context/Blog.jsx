import * as anchor from "@project-serum/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getRandomName } from "./../functions/getRandomName";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import idl from "./../../idl.json";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";

const PROGRAM_KEY = new PublicKey(idl.metadata.address);

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("Parent must be wrapped inside PostsProvider");
  }

  return context;
};

export const BlogProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [initialized, setInitialized] = useState(false);
  const [posts, setPosts] = useState([]);
  const [transactionPending, setTransactionPending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastPostId, setLastPostId] = useState();

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(idl, PROGRAM_KEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const start = async () => {
      if (program && publicKey) {
        try {
          const [userPda] = findProgramAddressSync(
            [utf8.encode("user"), publicKey.toBuffer()],
            program.programId
          );
          const user = await program.account.userAccount.fetch(userPda);
          if (user) {
            setInitialized(true);
            setUser(user);
            setLastPostId(user.lastPostId);
            const postAccounts = await program.account.postAccount.all(
              publicKey.toString()
            );
            setPosts(postAccounts);
          }
        } catch (error) {
          if (error.message === "Account does not exist") {
            console.log(
              "User not initialized yet, proceeding with initialization"
            );
            await initUser();
          } else {
            console.log(error);
            setInitialized(false);
          }
        }
      }
    };

    start();
  }, [program, publicKey, transactionPending]);

  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const name = getRandomName();

        await program.methods
          .initUser(name)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        setInitialized(true);
      } catch (error) {
        console.log(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const fetchPosts = async () => {
    try {
      setPosts([]);
      const [userPda] = findProgramAddressSync(
        [utf8.encode("user"), publicKey.toBuffer()],
        program.programId
      );
      const user = await program.account.userAccount.fetch(userPda);
      if (user) {
        setInitialized(true);
        setUser(user);
        setLastPostId(user.lastPostId);
        const postAccounts = await program.account.postAccount.all(
          publicKey.toString()
        );
        setPosts(postAccounts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (title, content) => {
    if (program && publicKey) {
      setTransactionPending(true);
      try {
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const [postPda] = findProgramAddressSync(
          [
            utf8.encode("post"),
            publicKey.toBuffer(),
            Uint8Array.from([lastPostId]),
          ],
          program.programId
        );

        const tx = await program.methods
          .createPost(title, content)
          .accounts({
            userAccount: userPda,
            postAccount: postPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setShowModal(false);

        // Wait for the transaction to be confirmed
        await connection.confirmTransaction(tx);

        fetchPosts(); // fetch posts after creating a new one
      } catch (error) {
        console.error(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [program, publicKey, transactionPending]);

  return (
    <BlogContext.Provider
      value={{
        user,
        posts,
        initialized,
        initUser,
        createPost,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
