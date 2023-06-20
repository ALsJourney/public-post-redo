import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBlog } from "src/context/Blog.jsx";
import { PostForm } from "src/components/PostForm.jsx";
import { SolflareWalletName } from "@solana/wallet-adapter-wallets";

function PostList(props) {
  const [connecting, setConnecting] = useState(false);
  const { connected, select } = useWallet();
  const { user, posts, createPost, showModal, setShowModal } = useBlog();
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

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
    <main className={"pb-4 container flex relative max-h-fit rounded-xl top-2"}>
      <div className="row">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {posts.map((item) => {
            return (
              <article key={item.account.id}>
                <div className="">
                  <div className="max-w-xs mx-4 mb-2 rounded-lg shadow-lg bg-white">
                    <div className="px-6 py-4 mt-6">
                      <h4 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">
                        {item.account.title}
                      </h4>
                      <p className="leading-normal text-gray-700">
                        {item.account.content}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className={`modal ${showModal && "show-modal"}`}>
        <div className="modal-content">
          <span className="close-button" onClick={() => setShowModal(false)}>
            ×
          </span>
          <PostForm
            postTitle={postTitle}
            postContent={postContent}
            setPostTitle={setPostTitle}
            setPostContent={setPostContent}
            onSubmit={() => createPost(postTitle, postContent)}
          />
        </div>
      </div>
    </main>
  );
}

export default PostList;
