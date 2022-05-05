import React, { useEffect, useState, useMemo } from "react";
import Flexbox from "flexbox-react";
import Container from "./styled";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Random from "../../assets/random.gif";
import Appbar from "../../components/Appbar";
import { Button } from "antd";
import contractInfo from '../../contracts/contract-address.json';
import NFTContract from '../../contracts/NFT.json';

// import WalletConnectProvider from "@walletconnect/web3-provider";

const Home = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [currentSupply, setCurrentSupply] = useState(0);



  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: false, // optional
    providerOptions: {}, // required
    disableInjectedProvider: false,
  });

  const handleDisconnectWallet = async () => {
      try {
        await web3Modal.clearCachedProvider();
        setIsConnected(false);
      } catch(error) {
          console.error(error)
      }
  
  }

  const fetchContractData = async () => {
    try {
      let currentSupply = await contract.tokenCount();
      let totalSupply = await contract.totalSupply();
   
      setCurrentSupply(currentSupply.toNumber())
      setTotalSupply(totalSupply.toNumber())
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    let provider = ethers.providers.getDefaultProvider('http://localhost:8545');
    let wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      contractInfo.address,
      NFTContract.abi,
      wallet
    )

    setContract(contract)

  }, [])

  useEffect(() => {
    if(contract) {
      fetchContractData()
    }
  }, [contract])

  const handleConnectWalletButton = async () => {
    try {
      await web3Modal.clearCachedProvider();
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();

      if (signer) {
        setIsConnected(true);
        const contract = new ethers.Contract(
          contractInfo.address,
          NFTContract.abi,
          signer
        )
  
        setContract(contract);
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

  const incrementSupply = (amount) => {
    if(currentSupply + amount > totalSupply) {
      setCurrentSupply(totalSupply)
    } 

    setCurrentSupply(currentSupply => currentSupply + amount)
  }


  const handleMintButton = async () => {
    try {
      let tx = await contract.mint(walletAddress, 1);
      await tx.wait()
      incrementSupply(1)
    } catch(error){ 
      console.error(error)
    }
  }

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

  const minterContent = () => {
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
            <span>{currentSupply}</span> / <span>{totalSupply}</span>
        </Flexbox>
        <Button size="large" shape="round" type="primary" onClick={handleMintButton}>
          Mint
        </Button>
      </Flexbox>
    );
  };

  return (
    <Container>
      {isConnected && <Appbar>
        <Button
          danger
          type="text"
          onClick={handleDisconnectWallet}
        >
          Disconnect
        </Button>
      </Appbar>}
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
