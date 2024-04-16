'use client';

const RewardBalance = ({ reward }: { reward: string }) => {
  return (
    reward > '0' && ( <div className='p-6 pt-0 grid gap-4'>
      <div className='grid gap-2 mt-2'>
        <label
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          htmlFor='email'
        >
          Reward Balance
        </label>
        <input
          className='text-center flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
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
