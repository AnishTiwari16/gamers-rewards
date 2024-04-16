'use client';
import { Dispatch, SetStateAction } from 'react';
import { baseSepolia, bscTestnet, optimism, polygon } from 'wagmi/chains';

import { cn } from '@/lib/utils';

import { useToast } from '@/components/ui/use-toast';

const ChainSelector = ({
  chain,
  setSelectedChain,
}: {
  chain: {
    id: number;
    name: string;
  };
  setSelectedChain: Dispatch<
    SetStateAction<{
      id: number;
      name: string;
    }>
  >;
}) => {
  const { toast } = useToast();

  return (
    <div className='p-6 pt-0 grid gap-4 mt-2'>
      <label
        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        htmlFor='email'
      >
        Select chain for reward
      </label>
      <div className='grid grid-cols-2 gap-6'>
        <button
          onClick={() => {
            setSelectedChain({ id: baseSepolia.id, name: baseSepolia.name });
          }}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input  hover:text-accent-foreground h-10 px-4 py-2',
            chain.id === baseSepolia.id && 'bg-[#0455FF]',
            'hover:bg-[#0455FF]'
          )}
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clip-path='url(#clip0_1_276)'>
              <path
                d='M11.9789 24C18.6182 24 24 18.6278 24 12C24 5.37216 18.6182 0 11.9789 0C5.68032 0 0.5136 4.83648 0 10.991H15.889V13.009H0C0.5136 19.1635 5.68032 24 11.9789 24Z'
                fill='white'
              />
            </g>
            <defs>
              <clipPath id='clip0_1_276'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
          &nbsp; Base
        </button>
        <button
          onClick={() => {
            setSelectedChain({ id: bscTestnet.id, name: bscTestnet.name });
          }}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input  hover:text-accent-foreground h-10 px-4 py-2',
            chain.id === bscTestnet.id && 'bg-[#F0B90B]',
            'hover:bg-[#F0B90B]'
          )}
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clip-path='url(#clip0_6_309)'>
              <path
                d='M5.424 12L2.736 14.688L0 12L2.736 9.264L5.424 12ZM12 5.424L16.656 10.08L19.392 7.344L12 0L4.656 7.344L7.392 10.08L12 5.424ZM21.264 9.264L18.576 12L21.312 14.736L24 12L21.264 9.264ZM12 18.576L7.344 13.92L4.608 16.656L12 24L19.344 16.656L16.656 13.92L12 18.576ZM12 14.688L14.736 11.952L12 9.264L9.264 12L12 14.688Z'
                fill='white'
              />
            </g>
            <defs>
              <clipPath id='clip0_6_309'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
          &nbsp; Binance
        </button>
        <button
          onClick={() => {
            toast({
              title: 'Polygon coming soon ',
            });
          }}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input  hover:text-accent-foreground h-10 px-4 py-2',
            chain.id === polygon.id && 'bg-[#6C00F6]',
            'hover:bg-[#6C00F6]'
          )}
        >
          <svg
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clip-path='url(#clip0_1_302)'>
              <path
                d='M24.3116 11.0646L18.7302 14.2702V24.2748L15.6507 26.0599L12.5522 24.2733V20.7014L15.6507 18.9322L17.6429 20.0875V17.1976L15.6332 16.0568L10.0533 19.2985V25.711L15.6521 28.9353L21.232 25.711V15.7079L24.3305 13.9212L27.4273 15.7079V19.2638L24.3305 21.0663L22.3208 19.9008V22.7762L24.3116 23.9243L29.9466 20.7189V14.2702L24.3116 11.0646Z'
                fill='white'
              />
            </g>
            <defs>
              <clipPath id='clip0_1_302'>
                <rect width='40' height='40' fill='white' />
              </clipPath>
            </defs>
          </svg>
          Polygon
        </button>
        <button
          onClick={() => {
            toast({
              title: 'Optimism coming soon ',
            });
          }}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input  hover:text-accent-foreground h-10 px-4 py-2',
            chain.id === optimism.id && 'bg-[#FF0420]',
            'hover:bg-[#FF0420]'
          )}
        >
          <svg
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M14.1706 25.3157C12.9798 25.3157 12.0041 25.0354 11.2435 24.475C10.493 23.9046 10.1177 23.0941 10.1177 22.0433C10.1177 21.8231 10.1427 21.5529 10.1927 21.2326C10.3229 20.5122 10.508 19.6465 10.7482 18.6358C11.4286 15.8838 13.185 14.5078 16.017 14.5078C16.7876 14.5078 17.4781 14.6378 18.0886 14.898C18.699 15.1482 19.1794 15.5285 19.5296 16.0389C19.8798 16.5392 20.055 17.1397 20.055 17.8402C20.055 18.0503 20.03 18.3155 19.9799 18.6358C19.8298 19.5264 19.6497 20.3921 19.4395 21.2326C19.0893 22.6037 18.4838 23.6294 17.6232 24.3099C16.7626 24.9804 15.6118 25.3157 14.1706 25.3157ZM14.3808 23.1541C14.9413 23.1541 15.4166 22.989 15.8069 22.6587C16.2072 22.3285 16.4924 21.8231 16.6625 21.1426C16.8926 20.2019 17.0678 19.3813 17.1879 18.6808C17.2279 18.4706 17.2479 18.2555 17.2479 18.0353C17.2479 17.1246 16.7726 16.6693 15.8219 16.6693C15.2614 16.6693 14.7811 16.8344 14.3808 17.1646C13.9906 17.495 13.7103 18.0003 13.5402 18.6808C13.3601 19.3513 13.1799 20.1719 12.9998 21.1426C12.9598 21.3427 12.9398 21.5529 12.9398 21.773C12.9398 22.6938 13.4202 23.1541 14.3808 23.1541Z'
              fill='white'
            />
            <path
              d='M20.7442 25.1656C20.6342 25.1656 20.549 25.1306 20.489 25.0605C20.439 24.9804 20.424 24.8904 20.444 24.7903L22.5155 15.0331C22.5355 14.923 22.5906 14.833 22.6806 14.7629C22.7707 14.6929 22.8658 14.6578 22.9658 14.6578H26.9588C28.0696 14.6578 28.9602 14.888 29.6307 15.3483C30.3113 15.8087 30.6515 16.4742 30.6515 17.3448C30.6515 17.595 30.6215 17.8552 30.5614 18.1254C30.3113 19.2762 29.8059 20.1269 29.0454 20.6773C28.2948 21.2277 27.264 21.5029 25.953 21.5029H23.9266L23.2361 24.7903C23.216 24.9004 23.161 24.9904 23.071 25.0605C22.9809 25.1306 22.8858 25.1656 22.7858 25.1656H20.7442ZM26.0582 19.4314C26.4784 19.4314 26.8437 19.3162 27.1539 19.0861C27.4742 18.8559 27.6843 18.5257 27.7844 18.0954C27.8144 17.9252 27.8294 17.7751 27.8294 17.645C27.8294 17.3548 27.7444 17.1346 27.5742 16.9846C27.4041 16.8244 27.1139 16.7444 26.7036 16.7444H24.9022L24.3318 19.4314H26.0582Z'
              fill='white'
            />
          </svg>
          Optimism
        </button>
      </div>
    </div>
  );
};

export default ChainSelector;
