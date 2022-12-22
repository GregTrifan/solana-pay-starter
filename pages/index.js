import React, {useState, useEffect} from "react";
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from "next/dynamic";
import HeadComponent from '../components/Head';
import Product from "../components/Product";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    const WalletMultiButtonDynamic = dynamic(
            async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
            { ssr: false }
            );

    // This will fetch the users' public key (wallet address) from any wallet we support
    const { publicKey } = useWallet();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (publicKey) {
            fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
            setProducts(data);
            console.log("Products", data);
        });
        }
    }, [publicKey]);

    const renderItemBuyContainer = () => (
            <div className="products-container">
                {products.map((product) => (
                        <Product key={product.id} product={product} />
                        ))}
            </div>
            );
    const renderNotConnectedContainer = () => (
            <div>
                <div className="button-container">
                    <WalletMultiButtonDynamic className="cta-button connect-wallet-button" />
                </div>
            </div>
            );
  
  return (
    <div className="App">
      <HeadComponent/>
      <div className="container">
        <header className="header-container">
            <p className="header"> 🤨 <span className="gradient-text">Store</span></p>
            <p className="sub-text">Accepting either 🤨 or SOL</p>
        </header>

          <main>
              {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
          </main>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
