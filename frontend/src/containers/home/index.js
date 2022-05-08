import React, { useEffect, useState, useMemo } from "react";
import Flexbox from "flexbox-react";
import Container from "./styled";
import { providers, ethers } from "ethers";
import Web3Modal from "web3modal";
import Random from "../../assets/random.gif";
import Appbar from "../../components/Appbar";
import { Button, message } from "antd";
import contractInfo from "../../contracts/contract-address.json";
import NFTContract from "../../contracts/NFT.json";

import WalletConnectProvider from "@walletconnect/web3-provider";
import CONFIG from "../../config";
const Home = () => {

  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [currentSupply, setCurrentSupply] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [price, setPrice] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);
  //  Create WalletConnect Provider
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
    },
  };
  const web3Modal = new Web3Modal({
    network: "rinkeby", // optional
    cacheProvider: false, // optional
    providerOptions: providerOptions, // required
    disableInjectedProvider: false,
  });

  const handleDisconnectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      setIsConnected(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContractData = async () => {
    try {
      setFetchLoading(true);
      let currentSupply = await contract.tokenCount();
      let totalSupply = await contract.totalSupply();
      let price = await contract.price();
      setCurrentSupply(currentSupply.toNumber());
      setTotalSupply(totalSupply.toNumber());
      setPrice(ethers.utils.formatEther(price));
    } catch (error) {
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    let provider = ethers.providers.getDefaultProvider("rinkeby");

    const contract = new ethers.Contract(
      contractInfo.address,
      NFTContract.abi,
      provider
    );

    setContract(contract);
  }, []);

  useEffect(() => {
    if (contract) {
      fetchContractData();
    }
  }, [contract]);

  const handleConnectWalletButton = async () => {
    try {
      await web3Modal.clearCachedProvider();
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();

      instance.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0])
      });

      if (signer) {
        setIsConnected(true);
        // const contract = new ethers.Contract(
        //   contractInfo.address,
        //   NFTContract.abi,
        //   signer
        // );

        // setContract(contract);
        let instance = contract.connect(signer);
        console.log("instance: ", instance);
        setContract(instance);
        try {
          const address = await signer.getAddress();
          setWalletAddress(address);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMintButton = async () => {
    let mintAmount = 1;
    try {
      setIsMinting(true);
      let tx = await contract.mint(walletAddress, mintAmount, {
        gasLimit: CONFIG.GAS_LIMIT * mintAmount,
        value: ethers.utils.parseEther(String(price * mintAmount)),
      });
      await tx.wait();
      let currentSupply = await contract.tokenCount();
      setCurrentSupply(currentSupply.toNumber());
    } catch (error) {
      console.error(error);
    } finally {
      setIsMinting(false);
    }
  };

  const connectWalletContent = () => {
    return (
      <Flexbox
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        style={{ gap: "2rem" }}
      >
        <img
          className="avatar"
          src={Random}
          alt="wallet-avatar"
          style={{ width: "100px", height: "100px" }}
        />
        <Button
          size="large"
          shape="round"
          type="primary"
          onClick={handleConnectWalletButton}
        >
          Connect Wallet
        </Button>
      </Flexbox>
    );
  };

  const soldoutContent = () => {
    return (
      <Flexbox
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        style={{ gap: "2rem" }}
      >
        <Flexbox>
          <h1>Sold out</h1>
          <br />
        </Flexbox>
        <Flexbox>
          <div style={{ display: "inline-block", textAlign: "center" }}>
            <span>All assets were minted.</span>
            <br />
            <span>
              Please visit <a href={CONFIG.COLLECTION_URL}>opensea</a> for
              secondary marketplace.
            </span>
          </div>
        </Flexbox>
      </Flexbox>
    );
  };

  const loadingContent = (isLoading, element) => {
    if (isLoading) {
      return "loading ...";
    } else {
      return element;
    }
  };

  const minterContent = () => {
    if (!!currentSupply & !!totalSupply && currentSupply === totalSupply) {
      return soldoutContent();
    }

    return (
      <Flexbox
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        style={{ gap: "2rem" }}
      >
        <img
          className="avatar"
          src={Random}
          alt="wallet-avatar"
          style={{ width: "100px", height: "100px" }}
        />
        <Flexbox>
          <span>Address: {walletAddress}</span>
        </Flexbox>
        <Flexbox>
          {loadingContent(fetchLoading, (<span>Price: {price} ETH</span>))}
        </Flexbox>
        <Flexbox>
          {loadingContent(
            fetchLoading,
            (< ><span>{currentSupply}</span>/<span>{totalSupply}</span></>)
          )}
        </Flexbox>
        <Button
          disabled={fetchLoading}
          loading={isMinting}
          size="large"
          shape="round"
          type="primary"
          onClick={handleMintButton}
        >
          Mint
        </Button>
      </Flexbox>
    );
  };

  return (
    <Container>
      {isConnected && (
        <Appbar>
          <Button type="link" onClick={() => window.open(CONFIG.COLLECTION_URL)}>
            Opensea
          </Button>
          <Button danger type="text" onClick={handleDisconnectWallet}>
            Disconnect
          </Button>
        </Appbar>
      )}
      <Flexbox
        id="body"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
      >
        <Flexbox id="box" flexDirection="column" justifyContent="center">
          {isConnected ? minterContent() : connectWalletContent()}
        </Flexbox>
      </Flexbox>
    </Container>
  );
};

export default Home;
