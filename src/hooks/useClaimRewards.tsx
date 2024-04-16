import { Address, erc20Abi } from 'viem';
import { base, baseSepolia, bscTestnet } from 'viem/chains';
import { useAccount, useReadContract } from 'wagmi';

import { USDC_BINANCE, USDC_SEPOLIA_BASE } from '@/constant/constants';

const useClaimRewards = ({ chainId }: { chainId: number }) => {
  const { address } = useAccount();
  let contractAddress = '';
  if (chainId === baseSepolia.id) {
    contractAddress = USDC_SEPOLIA_BASE;

  }
  if (chainId === bscTestnet.id) {
    contractAddress = USDC_BINANCE;
  }
  console.log(chainId);

  return useReadContract({
    account: address,
    abi: erc20Abi,
    chainId: chainId,
    address: contractAddress as Address,
    functionName: 'balanceOf',
    args: [address as Address],
  });
};

export default useClaimRewards;
