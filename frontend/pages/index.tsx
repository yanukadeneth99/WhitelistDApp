import { ethers } from "ethers";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useRef, useState } from "react";
import Core from "web3modal";
import Web3Modal from "web3modal";
import { useSnackbar } from "notistack";

// Components
import Header from "../components/Header";

const Home: NextPage = () => {
  //* States
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const web3ModalRef = useRef<Core>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Gets a Provider if passed false(nothing), gets a Signer if passed true
  const getProviderOrSigner = async (needSigner = false) => {
    const instance = await web3ModalRef?.current?.connect();
    const web3Provider = new ethers.providers.Web3Provider(instance);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change network to mumbai");
    }
    if (needSigner) {
      return await web3Provider.getSigner();
    }
    return web3Provider;
  };

  // Connect to the wallet
  const connect = async () => {
    try {
      if (!walletConnected) {
        setLoading(true);
        web3ModalRef.current = new Web3Modal({
          network: "mumbai",
          cacheProvider: true,
          providerOptions: {},
          disableInjectedProvider: false,
        });
        const out = await getProviderOrSigner();
        if (out) {
          setWalletConnected(true);
          enqueueSnackbar("Connected Account", { variant: "success" });
        }

        setLoading(false);
      }
    } catch (error: any) {
      enqueueSnackbar(`Error connecting wallet : ${error.message as string}`, {
        variant: "error",
      });
      setLoading(false);
    }
  };

  // Run Connect as page loads
  // useEffect(() => {
  //   if (!walletConnected) connect();
  // }, [walletConnected]);

  return (
    <>
      <NextSeo
        title="Simple Usage Example"
        description="A short description goes here."
      />
      <div>
        <Header
          loading={loading}
          walletConnected={walletConnected}
          connect={connect}
        />
      </div>
    </>
  );
};

export default Home;
