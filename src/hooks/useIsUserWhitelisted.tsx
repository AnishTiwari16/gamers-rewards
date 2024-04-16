import { useAccount, useReadContract } from 'wagmi';

import { REWARD_MANAGER_ABI } from '@/constant/abi';
import { REWARD_MANAGER } from '@/constant/addresses';

const useIsUserWhiteListed = () => {
  const { address } = useAccount();
  return useReadContract({
    abi: REWARD_MANAGER_ABI,
    account: address,
    address: REWARD_MANAGER,
    functionName: 'isWhitelisted',
  });
};

export default useIsUserWhiteListed;
