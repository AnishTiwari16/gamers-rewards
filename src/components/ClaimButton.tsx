import { ComponentProps } from 'react';

const ClaimButton: React.FC<ComponentProps<'button'>> = ({ ...props }) => {
  return (
    <div className='flex items-center z-10 p-6 pt-0'>
      <button
        className='inline-flex items-center relative justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full'
        {...props}
      />
    </div>
  );
};

export default ClaimButton;
