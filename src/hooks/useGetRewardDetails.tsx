import { useAccount, useReadContracts } from 'wagmi';

import { REWARD_MANAGER_ABI } from '@/constant/abi';
import { REWARD_MANAGER } from '@/constant/addresses';

// const useGetRewardDetails = ({ chainId }: { chainId: number }) => {
const useGetRewardDetails = () => {
  const { address } = useAccount();
  // let contractAddress = '';

  // if (chainId === base.id) {
  //   contractAddress = USDC_SEPOLIA_BASE;
  // }
  // if (chainId === bscTestnet.id) {
  //   contractAddress = USDC_BINANCE;
  //   console.log("contractAddress", contractAddress);
  // }

  return useReadContracts({
    query: {
      enabled: !!address,
    },
    contracts: [
      // {
      //   abi: erc20Abi,
      //   address: contractAddress as Address,
      //   functionName: 'balanceOf',
      //   args: [address as Address],
      // },
      {
        abi: REWARD_MANAGER_ABI,
        address: REWARD_MANAGER,
        functionName: 'rewardBalances',
        args: [address],
      },
      // {
      //   abi: REWARD_MANAGER_ABI,
      //   address: REWARD_MANAGER,
      //   functionName: 'isWhitelisted',
      //   args: [address],
      // },
    ],
  });
};

export default useGetRewardDetails;
