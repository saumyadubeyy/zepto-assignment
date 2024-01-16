import React, { CSSProperties, MutableRefObject } from 'react'
import { OptionType } from '../../../types/types'

type DropdownListProps = {
    dropdownStyle: CSSProperties | undefined,
    options: OptionType[],
    highlightedOption: OptionType | null | undefined,
    removeHighlightFromOption: () => void,
    addToOptions: (option: OptionType) => void,
    containerRef: MutableRefObject<HTMLDivElement | null>
}

const DropdownList = ({ dropdownStyle, options, highlightedOption, removeHighlightFromOption, addToOptions, containerRef }: DropdownListProps) => {
    return (
        <div style={dropdownStyle} ref={containerRef} className="flex flex-col max-h-[350px] overflow-auto scrollbar bg-gray-100 min-w-[450px]">
          {options.map((item) => {
            return (
              <div 
                onClick={() => addToOptions(item)} 
                key={item.email} 
                className={`${highlightedOption?.email === item.email ? "bg-gray-200" : ""} hover:bg-gray-200 rounded-md cursor-pointer py-2 px-4 flex justify-between items-center gap-4`}
                onMouseEnter={removeHighlightFromOption}
                id={`option-${item.email}`}
              >
                <div className="w-8 h-8 rounded-full flex justify-center items-center text-white" style={{ backgroundColor: item.color}}>{item.name.charAt(0)}</div>
                <p className="flex-1">{item.name}</p>
                <p className="flex-1 text-right text-gray-400 text-sm">{item.email}</p>
              </div>
            )
          })}
        </div>
      )
}

export default DropdownList