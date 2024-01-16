import React from 'react'
import { OptionType } from '../../../types/types'
import Image from 'next/image';
import closeIcon from "../assets/closeIcon.svg"

type UserChipsProps = {
    options: OptionType[],
    highlightedOption: OptionType | null | undefined,
    deleteHandler: (email: string) => void 
}

const UserChips = ({options, highlightedOption, deleteHandler} : UserChipsProps ) => {
    return (
        <>
        {
          Array.from(new Set(options)).map((item) => {
            const highlightedOptionClass = {
              border: `1.5px solid ${item.color}`,
              backgroundColor: item.chipColor,
            }
            return (
              <div 
                className={`p-1 rounded-lg flex gap-2 items-center min-w-fit ${item.email === highlightedOption?.email ? "shadow-lg shadow-gray-500 mb-1" : ""}`} 
                style={highlightedOptionClass} 
                key={item.email}
              >
                <div className="w-6 h-6 rounded-full flex justify-center items-center text-white text-sm" style={{ backgroundColor: item.color}}>{item.name.charAt(0)}</div>
                <div className="text-sm">{item.name}</div>
                <div onClick={() => deleteHandler(item.email)} className="hover:shadow-lg cursor-pointer transition-all duration-300 rounded-full">
                  <Image src={closeIcon} width={25} height={25} alt='close-icon' />
                </div>
              </div>
            )
          })
        }
      </>
      );
}

export default UserChips