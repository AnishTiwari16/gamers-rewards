'use client';

import { Input } from "./ui/input";

const RewardBalance = ({ reward }: { reward: string }) => {
  return (
 reward > '0'&& ( <div className='p-6 pt-0 grid gap-4'>
      <div className='grid gap-2 mt-2'>
        <label
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          htmlFor='email'
        >
          Reward Balance
        </label>
        <Input
        className="text-center"
          id='rewards'
          placeholder='-'
          value={reward + ' USDC'}
          disabled
          type='email'
        />
      </div>
    </div>)
   
  );
};

export default RewardBalance;
