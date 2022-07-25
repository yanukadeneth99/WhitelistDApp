import { BigNumber, Contract, ethers, providers } from "ethers";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useRef, useState } from "react";
import Core from "web3modal";
import Web3Modal from "web3modal";
import { useSnackbar } from "notistack";
import { WHITELIST_ABI, WHITELIST_ADDRESS } from "../constants";

// Components
import Header from "../components/Header";
import Hero from "../components/Hero";

const Home: NextPage = () => {
  //* States
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
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
      return;
    }
    if (needSigner) {
      return await web3Provider.getSigner();
    }
    return web3Provider;
  };

  // Connect to the wallet
  const connect = async () => {
    try {
      if (!window.ethereum) {
        enqueueSnackbar("You have to install a provider like Metamask", {
          variant: "error",
          preventDuplicate: true,
        });
        return;
      }
      if (!walletConnected) {
        setLoading(true);
        web3ModalRef.current = new Web3Modal({
          network: "mumbai",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        const out = (await getProviderOrSigner(
          true
        )) as providers.JsonRpcSigner;
        if (out) {
          await getRegister();
          await getRemainingWhitelist();
          enqueueSnackbar("Connected Account", {
            variant: "success",
            preventDuplicate: true,
          });
          setWalletAddress((await out.getAddress()).toLocaleLowerCase());
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
      const whitelistContract = new Contract(
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

  // Get remaining whitelists available
  const getRemainingWhitelist = async () => {
    try {
      setLoading(true);
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
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

  // Get into Whitelist
  const becomeWhitelist = async () => {
    try {
      setLoading(true);
      if (remainingWL <= 0) {
        enqueueSnackbar("All whitelist spots are over", {
          variant: "error",
        });
        setLoading(false);
        return;
      } else if (register) {
        enqueueSnackbar("You are already a whitelister", {
          variant: "error",
        });
        setLoading(false);
        return;
      }

      // If alls good
      const signer = (await getProviderOrSigner(
        true
      )) as providers.JsonRpcSigner;
      const whitelistContract = await new Contract(
        WHITELIST_ADDRESS,
        WHITELIST_ABI,
        signer
      );
      const tx = await whitelistContract.joinWhitelist();
      await tx.wait();
      enqueueSnackbar("Registered for Whitelist!", { variant: "success" });
      await getRemainingWhitelist();
      await getRegister();
      setLoading(false);
    } catch (error: any) {
      enqueueSnackbar(`Error connecting wallet : ${error.message as string}`, {
        variant: "error",
      });
      setLoading(false);
    }
  };

  // Run Connect as page loads
  useEffect(() => {
    if (!walletConnected) connect();
  }, [walletConnected]);

  return (
    <>
      <NextSeo
        title="Whitelist | DApp"
        description="A whitelist DAPP to register yourself using a wallet on the Mumbai testnet which will give the user added benefits on the other projects created by Yanuka Deneth"
      />
      <div className="bg-transparent w-screen h-screen">
        <Header
          loading={loading}
          walletConnected={walletConnected}
          connect={connect}
        />
        <Hero
          walletConnected={walletConnected}
          remainingWL={remainingWL}
          register={register}
          becomeWhitelist={becomeWhitelist}
          loading={loading}
          walletAddress={walletAddress}
        />
      </div>
    </>
  );
};

export default Home;
