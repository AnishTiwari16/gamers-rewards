// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { Biconomy } from '@biconomy/mexa';
import { useMutation } from '@tanstack/react-query';
import { ethers, Contract } from 'ethers';
import { useCallback } from 'react';
import { bscTestnet } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
  import {BiconomySmartAccountV2, PaymasterMode
} from "@biconomy/account";
import { REWARD_MANAGER_ABI } from '@/constant/abi';
import {

  REWARD_MANAGER,
} from '@/constant/addresses';
// import { DESTINATION_CHAIN_SELECTOR } from '@/constant/constants';
const DESTINATION_CHAIN_SELECTOR = ethers.BigNumber.from(
  "10344971235874465080"
);

const DESTINATION_CONTRACT_ADDRESS =
  "0x338607A7d733D1B37c902028225d529dd5DC000C";

const ABI = [
  "function addReward(address user, uint256 amount)",
  "function claimRewards(uint64 destinationChainSelector, address destinationContractAddress)",
  "function getRewardBalance() view returns (uint256)",
  "function isWhitelisted() view returns (bool)",
  "function claimRewardSource()",
  "function whitelistUser(address user)",
  "function removeUserFromWhitelist(address user)",
];
const useClaimMutation = ({    smartAccount, smartAddress} : {    smartAccount : BiconomySmartAccountV2 | null, smartAddress: string}) => {
  // const { address } = useAccount();
  const { toast } = useToast();
  // const { data: biconomySmartContract } = useBiconomy()
  const claimRewards = useCallback(
    async ({ chainId }: { chainId: number }) => {
      try {
        if (!smartAddress) return;
        if (window.ethereum) {
          toast({
            title: 'Awaiting Transaction',
          });
          const provider = new ethers.providers.JsonRpcProvider(
            'https://data-seed-prebsc-1-s1.binance.org:8545'
          );
          const contractInstance = new ethers.Contract(
        REWARD_MANAGER,
        ABI,
        provider
      );
          if (chainId === bscTestnet.id) {
            const { data } =
              await contractInstance.claimRewardSource.populateTransaction();
     
          } else {
            const { data } =
              await contractInstance.populateTransaction.claimRewards(
                  DESTINATION_CHAIN_SELECTOR,
        DESTINATION_CONTRACT_ADDRESS
              );
              const tx1 = {
                to: REWARD_MANAGER,
                data: data,
              };
              console.log(data);
              //@ts-ignore
              const userOpResponse = await smartAccount?.sendTransaction(tx1);
              console.log(userOpResponse)
              const { transactionHash } = await userOpResponse.waitForTxHash();
              console.log("Transaction Hash", transactionHash);

          }
          // await provider.send('eth_sendTransaction', [txParams]);
          // biconomy.on('txHashGenerated', (data) => {
          //   console.log('txHashGenerated', data);
          // });
          // biconomy.on('txMined', (data) => {
          //   console.log('txMined', data);
          // });

          // biconomy.on('onError', (err) => {
          //   console.error('onError', err);
          // });

          // biconomy.on('txHashChanged', (data) => {
          //   console.log('txHashChanged', data);
          // });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [smartAddress]
  );

  return useMutation({
    mutationKey: ['claimmutation'],
    mutationFn: async ({ chainId }: { chainId: number }) =>
      claimRewards({ chainId: chainId }),
  });
};

export default useClaimMutation;

// const claimRewardSource = async (biconomySmartContract: BiconomySmartAccountV2) => {
//   try {
//     const data = encodeFunctionData({
//       abi: REWARD_MANAGER_ABI,
//       functionName: "claimRewardSource",
//     })
//     const tx = {
//       to: REWARD_MANAGER,
//       data: data,
//     };
//     const userOpResponse = await biconomySmartContract.sendTransaction(tx, {
//       paymasterServiceData: { mode: PaymasterMode.SPONSORED },
//     });
//     const { transactionHash } = await userOpResponse.waitForTxHash();
//     console.log("Transaction Hash", transactionHash);
//     const userOpReceipt = await userOpResponse.wait();
//     if (userOpReceipt.success == 'true') {
//       console.log("UserOp receipt", userOpReceipt)
//       console.log("Transaction receipt", userOpReceipt.receipt)
//     }
//     toast({
//       title: "Transaction Successful"
//     })
//   } catch (error) {
//     toast({
//       title: "Transaction Failed"
//     })
//   }
// }
