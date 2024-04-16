"use client";
import {
    AnimatePresence,
    motion
} from "framer-motion";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export const FloatingNav = ({
  navItems,
  active,
  setActive,
  className,
}: {
  navItems: {
    name: string;
  }[];
  active: string
  setActive: Dispatch<SetStateAction<string>>
  className?: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: 0 ,
          opacity:1 
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit absolute top-6 inset-x-0 mx-auto border rounded-full bg-card shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-3 py-2  items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx: number) => {
            const isActive = active === navItem.name
            return (
                 <div
            key={`link=${idx}`}
            onClick={() => {setActive(navItem.name)}}
            className={cn(
              "relative cursor-pointer items-center flex space-x-1 text-white hover:text-neutral-300 bg-background px-4 py-2 rounded-full font-medium"
            , isActive && 'border')}
          >
             <span className="hidden sm:block text-sm from-transparent via-blue-500 to-transparent">{navItem.name}</span>
             {isActive &&  <span className="absolute w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />}
            
          </div>
            )
        })}
      </motion.div>
    </AnimatePresence>
  );
};
