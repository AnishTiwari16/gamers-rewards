// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { Biconomy } from '@biconomy/mexa';
import { useMutation } from '@tanstack/react-query';
import { Contract } from 'ethers';
import { useCallback } from 'react';
import { bscTestnet } from 'viem/chains';
import { useAccount } from 'wagmi';

import { useToast } from '@/components/ui/use-toast';

import { REWARD_MANAGER_ABI } from '@/constant/abi';
import {
  DESTINATION_CONTRACT_ADDRESS,
  REWARD_MANAGER,
} from '@/constant/addresses';
import { DESTINATION_CHAIN_SELECTOR } from '@/constant/constants';

const useClaimMutation = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  // const { data: biconomySmartContract } = useBiconomy()

  const claimRewards = useCallback(
    async ({ chainId }: { chainId: number }) => {
      try {
        if (!address) return;
        if (window.ethereum) {
          toast({
            title: 'Awaiting Transaction',
          });
          const biconomy = new Biconomy(window.ethereum, {
            apiKey: 'JQpVD1_Ov.d6fad103-3732-44cc-a2f1-e3a0b40995fe',
            debug: true,
            contractAddresses: [REWARD_MANAGER],
          });
          const provider = biconomy.provider;
          const contractInstance = new Contract(
            REWARD_MANAGER,
            REWARD_MANAGER_ABI,
            biconomy.ethersProvider
          );
          await biconomy.init();
          const txParams = {
            to: REWARD_MANAGER,
            from: address,
            signatureType: 'EIP712_SIGN',
          };
          if (chainId === bscTestnet.id) {
            const { data } =
              await contractInstance.claimRewardSource.populateTransaction();
            txParams.data = data;
          } else {
            const { data } =
              await contractInstance.claimRewards.populateTransaction(
                DESTINATION_CHAIN_SELECTOR,
                DESTINATION_CONTRACT_ADDRESS
              );
            txParams.data = data;
          }
          await provider.send('eth_sendTransaction', [txParams]);
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
        // console.log(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address]
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
