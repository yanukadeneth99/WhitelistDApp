import { BigNumber, Contract, ethers, providers } from "ethers";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useRef, useState } from "react";
import Core from "web3modal";
import Web3Modal from "web3modal";
import { useSnackbar } from "notistack";
import { WHITELIST_ABI, WHITELIST_ADDRESS } from "../constants";

import BGImage from "../public/background.jpg";

// Components
import Header from "../components/Header";
import Hero from "../components/Hero";
import List from "../components/List";

const Home: NextPage = () => {
  //* States
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [remainingWL, setRemainingWL] = useState<number>(0);
  const [register, setRegister] = useState<boolean>(false);
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
          await getRegister();
          await getRemainingWhitelist();
          enqueueSnackbar("Connected Account", { variant: "success" });
          setWalletConnected(true);
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

  // Gets whether the user is registered
  const getRegister = async () => {
    try {
      setLoading(true);
      const signer = (await getProviderOrSigner(
        true
      )) as providers.JsonRpcSigner;
      const whitelistContract = await new Contract(
        WHITELIST_ADDRESS,
        WHITELIST_ABI,
        signer
      );
      const _address = await signer.getAddress();
      const _register = await whitelistContract.isWhitelisted(_address);
      setRegister(_register);
      setLoading(false);
    } catch (error: any) {
      enqueueSnackbar(`Error connecting wallet : ${error.message as string}`, {
        variant: "error",
      });
      setLoading(false);
    }
  };

  // Register for whitelist

  // Get remaining whitelists available
  const getRemainingWhitelist = async () => {
    try {
      setLoading(true);
      const provider = (await getProviderOrSigner()) as providers.Web3Provider;
      const whitelistContract = await new Contract(
        WHITELIST_ADDRESS,
        WHITELIST_ABI,
        provider
      );
      const _currentWL: BigNumber =
        await whitelistContract.getNumberOfWhitelist();
      const _maxWL: number = await whitelistContract.maxWhitelistedAddresses();
      setRemainingWL(_maxWL - _currentWL.toNumber());
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
      <NextSeo title="Whitelist | DApp" description="Whitelist " />
      <div
        style={{
          background: `url(${BGImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "50% 100%",
        }}
        className="bg-transparent w-screen h-screen flex flex-col"
      >
        <Header
          loading={loading}
          walletConnected={walletConnected}
          connect={connect}
        />
        <Hero
          walletConnected={walletConnected}
          remainingWL={remainingWL}
          register={register}
        />
        <List />
        <button className="btn btn-primary" onClick={getRemainingWhitelist}>
          {remainingWL.toString()}
        </button>
      </div>
    </>
  );
};

export default Home;
