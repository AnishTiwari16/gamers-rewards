import { eventDataType } from '@/app/page';
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useState } from 'react'

const EventSelector = ({eventData, selectedEvent, setSelectedEvent} : {eventData : eventDataType;selectedEvent: string; setSelectedEvent: Dispatch<SetStateAction<string>>}) => {
   

    const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEvent(event.target.value);
    };
const userSelectedEvent = eventData.find((event) => event.eventName === selectedEvent);
  return (
     <div className='p-6 pt-0 grid gap-4 mt-2'><label
        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        Select event for reward
      </label>
      
     <form className="w-full">
        <select className="flex h-10 w-full border-none bg-background shadow-input rounded-md px-3 py-2 text-sm 
             focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400
             group-hover/input:shadow-none transition duration-400" value={selectedEvent} onChange={handleEventChange}>
            <option value="">Choose an event</option>
            {eventData.map((option) => {
                return <option value={option.eventName}>{option.eventName}</option>
            })}
        </select>
    </form>
    {userSelectedEvent &&  (<div className='border p-1 rounded-md'>
      <Image src={userSelectedEvent.bannerImage} alt='banner' height={500} width={500}/>
    <div className='text-sm p-3'>
      <div className='flex items-center space-x-2 pb-1'>
        <div>#{userSelectedEvent.ranking}</div>
      <div>{userSelectedEvent.teamName}</div>
      </div>
      
      <div>Game - {userSelectedEvent.gameName}</div>
    </div>
    </div>)}
    </div>
  )
}

export default EventSelector