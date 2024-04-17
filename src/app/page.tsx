'use client';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import Big from 'big.js';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { formatUnits } from 'viem';
import { baseSepolia, bscTestnet } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';

import useClaimMutation from '@/hooks/useClaimMutation';
import useClaimRewards from '@/hooks/useClaimRewards';
import useGetRewardDetails from '@/hooks/useGetRewardDetails';
import useIsUserWhiteListed from '@/hooks/useIsUserWhitelisted';
import { cn } from '@/lib/utils';

import ClaimButton from '@/components/ClaimButton';
import RewardBalance from '@/components/RewardBalance';
import ChainSelector from '@/components/chain/ChainSelector';
import EventSelector from '@/components/event/EventSelector';
import ArrowLink from '@/components/links/ArrowLink';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Input } from '@/components/ui/input';
import { REWARD_MANAGER } from '@/constant/addresses';

  import {
  createSmartAccountClient,BiconomySmartAccountV2
} from "@biconomy/account";
import { ethers } from 'ethers';
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES , IProvider} from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { truncateAddress } from '@/lib/truncateAddress';
const getButtonCta = ({
  reward,
  isLoading,
  isUserWhitelisted,
  isWrongChain,
  isConnected,
}: {
  reward: string;
  isConnected: boolean;
  isWrongChain: boolean;
  isLoading: boolean;
  isUserWhitelisted: boolean;
}) => {
  if (!isConnected) {
    return 'Connect wallet';
  }
  if (isWrongChain) {
    return 'Switch chain';
  }
  if (isLoading) {
    return (
      <span
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        )}
      >
        <ImSpinner2 className='animate-spin' />
      </span>
    );
  }
  if (!isUserWhitelisted) {
    return 'You are not whitelisted';
  }
  if (reward === '' || reward === '0') {
    return 'You have already claimed reward';
  }
  return 'Claim rewards';
};
export type eventDataType = {
  eventName: string;
  gameName: string;
  ranking: number;
  teamName: string;
  bannerImage: string;
}[];
const Homepage = () => {
  const { isConnected, chain, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
    const [provider, setProvider] = useState<IProvider | null>(null);
     const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [smartAddress, setSmartAddress] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedChain, setSelectedChain] = useState<{
    id: number;
    name: string;
  }>({
    name: baseSepolia.name,
    id: baseSepolia.id,
  });
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventData, setEventData] = useState<eventDataType>([])
  const { data: claimedReward, refetch: refetchClaim } = useClaimRewards({
    chainId: selectedChain.id
  });


  const [active, setActive] = useState<string>('Home');

  const { data: rewardDetails, isLoading, refetch } = useGetRewardDetails({smartAddress : smartAddress});
  const { isPending, mutateAsync: claimRewards } = useClaimMutation({smartAccount:smartAccount, smartAddress: smartAddress});
  const reward = rewardDetails
    ? formatUnits(BigInt(Big(rewardDetails[0].result as string).toString()), 18)
    : '';

  const { data: isUserWhitelisted, isLoading: isUserWhitelistedLoading } =
    useIsUserWhiteListed();
 const navItems = [
    {
      name: "Home",
    },
    {
      name: "About",
    },
    {
      name: "FAQ",
    },
  ];
  const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x61",
      rpcTarget: "https://data-seed-prebsc-1-s1.binance.org:8545",
      displayName: "BSC Testnet",
      blockExplorer: "https://testnet.bscscan.com/",
      ticker: "Binance Coin",
      tickerName: "BSC Testnet",
    };
    const web3auth = new Web3Auth({
      clientId:
        "BNTKyCbmfznZNwOHbUiaCPR8Vn5-Qi2vFU-AHheAdEJXJGTU6cMXE01inAgTpfEQlUKvkYCWQ-AOBzkc0WGOBTE", // Get your Client ID from the Web3Auth Dashboard https://dashboard.web3auth.io/
      web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
      chainConfig,
      uiConfig: {
        appName: "Biconomy X Web3Auth",
        mode: "dark", // light, dark or auto
        loginMethodsOrder: ["apple", "google", "twitter"],
        logoLight: "https://web3auth.io/images/web3auth-logo.svg",
        logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
        loginGridCol: 3,
        primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
      },
      privateKeyProvider: new EthereumPrivateKeyProvider({
      config: { chainConfig: chainConfig }
})
    });
const connectWallet = async () => {
  try {
    //Creating web3auth instance
    await web3auth.initModal();
    const web3authProvider = await web3auth.connect();
    const ethersProvider = new ethers.providers.Web3Provider(
      web3authProvider as any
    );
    const web3AuthSigner = ethersProvider.getSigner();

    const config = {
      biconomyPaymasterApiKey: "CVR6PwxcA.6e2333d3-7cbd-4b9d-acdb-0d490b86bbdf", // <-- Get your paymaster API key from https://dashboard.biconomy.io/paymaster
      bundlerUrl:`"https://bundler.biconomy.io/api/v2/${chainConfig.chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
      
    };

    const smartWallet = await createSmartAccountClient({
      signer: web3AuthSigner,
      biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
      bundlerUrl: config.bundlerUrl,
      chainId: parseInt(chainConfig.chainId),
      rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545" // <-- read about this at https://docs.biconomy.io/Account/methods#createsmartaccountclient
    });
    const address = await smartWallet.getAccountAddress();
    console.log(address)
    setSmartAddress(address)
    setSmartAccount(smartWallet);
  } catch (error) {
    console.error(error);
  }
};
const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };
  const fetchData = async () => {
    const data = await fetch(`https://30cb-2405-201-4024-504b-bc08-1594-e982-9bc1.ngrok-free.app/api/events?walletAddress=${address}`, {method: "POST"})
    const res = await data.json()
    setEventData(res)
  }
  React.useEffect(() => {
    if(isConnected){
      fetchData()
    }
  },[])
  React.useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  console.log(smartAddress, loggedIn)
  return (
    <div className='w-full min-h-screen h-full bg-cover_bg bg-cover relative'>
      <Image
        src='/images/dottednew.webp'
        className='aspect-[1792/1024]'
        fill
        alt=''
      />
      <div className='flex items-center justify-end h-[100px] px-4'>
        {/* <div className='flex absolute -translate-x-1/2 left-1/2   z-30 items-center justify-center w-fit'>
          <Tabs
            tabs={tabs}
            getSelectedTab={(act) => {
              setActive(act);
            }}
          />
        </div> */}
      
        <FloatingNav navItems={navItems} active = {active} setActive = {setActive}/>
        {/* <ConnectButton /> */}
        <div className='absolute'>
         {!loggedIn ? <button
            className="w-[10rem] h-[3rem] bg-white text-black font-bold rounded-lg "
            onClick={connectWallet}
          >
              Connect wallet
          </button> : truncateAddress(smartAddress)}
        {/* {loggedIn && <button   className="w-[10rem] h-[3rem] bg-white text-black font-bold rounded-lg "
            onClick={logout}>Disconnect wallet</button>} */}
     </div>
      </div>
      <AnimatePresence initial={false} mode='popLayout'>
        {active === "Home" && <motion.div
       
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 40
          }}
          transition={{
            ease: 'easeInOut',
            delay: 0.1,
            duration: 1
          }}
          className='w-full relative overflow-hidden '
        >
          <div className='h-full '>
           
            <div className='max-w-[500px] z-20 h-full relative mt-5 mx-auto w-full'>
              <div className='rounded-xl border bg-card text-card-foreground h-full pb-2 px-2 shadow-sm'>
                <div className='flex flex-col p-6 space-y-1'>
                  <h3 className='font-semibold tracking-tight text-center text-2xl'>
                    Gamers Reward Portal&nbsp;🎮&nbsp;🏆
                  </h3>
                  <p className='text-sm text-muted-foreground text-center'>
                    Unlock your gaming rewards 🎉. Connect your wallet 🎮, view
                    your achievements 🏅, and claim your USDC rewards 💵 on your
                    preferred chain—no gas fees, just your skills rewarded. 👾
                  </p>
                </div>
                <EventSelector eventData = {eventData} selectedEvent = {selectedEvent} setSelectedEvent = {setSelectedEvent}/>
                <ChainSelector
                  chain={selectedChain}
                  setSelectedChain={setSelectedChain}
                />
                <RewardBalance reward={reward} />
                <div className='w-full'>
                  {!isConnected && !selectedEvent ? (<ClaimButton
                    
                    onClick={async () => {
                      if (!isConnected && openConnectModal) {
                        openConnectModal()
                        return;
                      }
                      if (!chain) {
                        switchChain({
                          chainId: bscTestnet.id,
                        });
                        return;
                      }
                      await claimRewards({ chainId: selectedChain.id });
                      await refetch();
                      await refetchClaim();
                    }}
                  >
                    {getButtonCta({
                      reward,
                      isLoading:
                        isLoading || isUserWhitelistedLoading || isPending,
                      isUserWhitelisted: isUserWhitelisted as boolean,
                      isWrongChain: !chain,
                      isConnected: isConnected,
                    })}
                  </ClaimButton>) : <ClaimButton
                    disabled={
                      isConnected && !!chain
                        ? reward === '' ||
                        reward === '0' ||
                        !isUserWhitelisted ||
                        isUserWhitelistedLoading ||
                        isPending ||
                        isLoading
                        : false
                    }
                    onClick={async () => {
                      if (!isConnected && openConnectModal) {
                        openConnectModal()
                        return;
                      }
                      if (!chain) {
                        switchChain({
                          chainId: bscTestnet.id,
                        });
                        return;
                      }
                      await claimRewards({ chainId: selectedChain.id });
                      await refetch();
                      await refetchClaim();
                    }}
                  >
                    {getButtonCta({
                      reward,
                      isLoading:
                        isLoading || isUserWhitelistedLoading || isPending,
                      isUserWhitelisted: isUserWhitelisted as boolean,
                      isWrongChain: !chain,
                      isConnected: isConnected,
                    })}
                  </ClaimButton>}
                 
                </div>
                {selectedEvent && claimedReward &&
                  claimedReward &&
                  (reward === '0' || reward === '') &&
                  isUserWhitelisted ? (
                  <div className='p-6 pt-0 grid gap-4'>
                    <div className='grid gap-2'>
                      <label
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        htmlFor='email'
                      >
                        You have claimed on <strong>{selectedChain.name}</strong>
                      </label>
                  
                        <Input placeholder='-'
                        value={
                          formatUnits(BigInt(claimedReward), 18).toString() +
                          ' USDC'
                        }
                        disabled />
         
                      {selectedChain.id === bscTestnet.id &&
                        <div className='flex items-center pt-4  justify-center'>
                          <ArrowLink
                            href={`https://testnet.bscscan.com/token/0xcae3696c061551529a771fed4448d461ea8778ce?a=${address}`}
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Transaction on {selectedChain.name}
                          </ArrowLink>
                        </div>
                      }
                      {selectedChain.id === baseSepolia.id &&
                        <div className='flex items-center pt-4 justify-between'>
                          <ArrowLink
                            href={`https://ccip.chain.link/address/${REWARD_MANAGER}`}
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Transaction on Chainlink
                          </ArrowLink>
                          <ArrowLink
                            href="https://sepolia.basescan.org/token/0x54d562b3a8b680f8a21d721d22f0bb58a3787555"
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Transaction on {selectedChain.name}
                          </ArrowLink>
                        </div>
                      }
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>}
      </AnimatePresence>
      <AnimatePresence initial={false} mode='popLayout'>
        {active === "About" && <motion.div
      
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 40
          }}
          transition={{
            ease: 'easeInOut',
            delay: 0.1,
            duration: 1
          }}
          className='w-full'
        >
          <div className='h-full'>
            <div className='max-w-[800px] z-20 h-full relative mt-5 mx-auto w-full'>
              <div className='rounded-xl border bg-card text-card-foreground h-full pb-2 px-2 shadow-sm'>
                <div className='flex flex-col p-6 space-y-1'>
                  <h3 className='font-semibold tracking-tight text-2xl'>
                    About Gamers Reward Portal 
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    The Gamers Reward Portal is a platform designed to enrich the gaming experience by seamlessly connecting digital achievements with real-world rewards. By integrating blockchain tech, we enable gamers to claim their earnings in USDC directly through their preferred blockchain networks without the hassle of transaction fees. Our user-friendly interface provides a straightforward process where you can connect your wallet, view your achievements, and claim your rewards, empowering gamers to capitalize on their skills and dedication.
                   <h3 className='font-semibold tracking-tight text-xl text-white pt-5 pb-2'>Why Gamers Reward Portal ?</h3>
                    <span className='font-bold'>Rewarding Gaming Excellence:</span> We believe that your gaming skills should offer more than just in-game achievements.
                    <br />
                    <span className='font-bold'>Accessibility:</span> No complicated processes here! Our straightforward interface makes it easy for anyone to start claiming their rewards immediately after connecting their wallet.
                    <br />
                    <span className='font-bold'>Gasless Txn:</span> With Biconomy-powered meta-transactions, you can claim rewards without worrying about blockchain network fees, making the process cost-effective and smooth.
                    <br />
                   <span className='font-bold'>Cross-Chain Compatibility:</span> Choose from multiple supported blockchains to receive your rewards, giving you the flexibility to use your rewards in various crypto ecosystems.
                    <br />
                    <br />
                     <h3 className='font-semibold tracking-tight text-xl text-white'>Features at a Glance:</h3>
                    <br />
                    <div className='pl-3'>
                    <ul className='list-disc'><li><span className='text-white text-lg font-semibold tracking-tight'>Wallet Integration:</span> <br />Quick and secure connection with popular wallets like MetaMask, Trust Wallet, and Coinbase Wallet.</li></ul>
                    <ul className='list-disc pt-2'><li><span className='text-white text-lg font-semibold tracking-tight'>Dynamic Rewards Dashboard:</span> <br />View detailed lists of your gaming achievements and rankings across multiple events and platforms.</li></ul>
                    <ul className='list-disc pt-2'><li><span className='text-white text-lg font-semibold tracking-tight'>Instant Reward Claims:</span> <br />Claim your rewards in USDC instantly on your chosen blockchain network at the click of a button.</li></ul>
                    <ul className='list-disc pt-2'><li><span className='text-white text-lg font-semibold tracking-tight'>Zero Transaction Fees:</span> <br />Enjoy the benefits of blockchain technology without any of the costs, thanks to our integration with Biconomy.</li></ul>
                    <ul className='list-disc pt-2'><li><span className='text-white text-lg font-semibold tracking-tight'>Multi-Chain Compatibility through Chainlink CCIP:</span> <br />Select from a variety of blockchain networks for receiving your rewards. Thanks to the integration with Chainlink's CCIP, we offer secure, reliable cross-chain functionality that broadens your options and enhances the flexibility of your reward claims.</li></ul>
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>}
      </AnimatePresence>
      <AnimatePresence initial={false} mode='popLayout'>
        {active === "FAQ" && <motion.div
  
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 40
          }}
          transition={{
            ease: 'easeInOut',
            duration: 0.5
          }}
          className='w-full'
        >
          <div className='h-full'>
            <div className='max-w-[500px] z-20 h-full relative mt-5 mx-auto w-full'>
              <div className='rounded-xl border bg-card text-card-foreground h-full pb-2 px-2 shadow-sm'>
                <div className='flex flex-col p-6 space-y-1'>
                  <h3 className='font-semibold tracking-tight text-center text-2xl'>
                    FAQ&nbsp;🎮&nbsp;🏆
                  </h3>
                  <p className='text-sm text-muted-foreground text-center'>
                    Unlock your gaming rewards 🎉. Connect your wallet 🎮, view
                    your achievements 🏅, and claim your USDC rewards 💵 on your
                    preferred chain—no gas fees, just your skills rewarded. 👾
                  </p>
                  <div className='h-[30px]'></div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I start using the Gamers Reward Portal?</AccordionTrigger>
                      <AccordionContent>
                        Begin by connecting your blockchain wallet to the portal. Once linked, the portal will automatically fetch and display your gaming achievements and available rewards.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger> Which wallets are supported?</AccordionTrigger>
                      <AccordionContent>
                        We support major wallets like MetaMask, Trust Wallet, and Coinbase Wallet. Ensure your wallet is compatible with Web3 for a smooth experience.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>What rewards can I claim?</AccordionTrigger>
                      <AccordionContent>
                        You can claim rewards in USDC based on your achievements and rankings in various games and events that you’ve participated in.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>How do I choose the blockchain to receive my rewards?</AccordionTrigger>
                      <AccordionContent>
                        After viewing your rewards, you can select your preferred blockchain from the menu before confirming your claim. We currently support Base, Binance Smart Chain, and Polygon.                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>Are there any fees involved?</AccordionTrigger>
                      <AccordionContent>
                        No, there are no transaction fees for claiming rewards. All gas fees are covered by our integration with Biconomy, ensuring a cost-free claiming process for you.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                      <AccordionTrigger>How often can I claim my rewards?</AccordionTrigger>
                      <AccordionContent>
                        Rewards are typically calculated and made available for claim at the end of each event or gaming competition. You can claim your rewards as soon as they appear in your dashboard.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                      <AccordionTrigger>What if my rewards don’t show up?</AccordionTrigger>
                      <AccordionContent>
                        Ensure your wallet is correctly connected and that you are looking at the right account. If issues persist, please contact our support team through the help section of the portal.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                      <AccordionTrigger>Is my data secure?</AccordionTrigger>
                      <AccordionContent>
                        Yes, data security is a top priority for us. We use the latest encryption and security practices to ensure that all your data remains private and secure.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;