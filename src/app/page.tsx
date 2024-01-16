'use client'
import { useEffect, useMemo, useRef, useState } from "react"
import optionsData from "./data/options"
import { OptionType } from "../../types/types";
import closeIcon from "./assets/closeIcon.svg"
import Image from "next/image";

enum KEY {
  BACKSPACE = "Backspace",
  ARROW_DOWN = "ArrowDown",
  ARROW_UP = "ArrowUp",
  ENTER = "Enter"
}

export default function Home() {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [highlightedOption, setHighlightedOption] = useState<OptionType | null>();

  const availableOptions = useMemo(() => {
    // Filter options that are not selected
    return optionsData.options.filter(option => !selectedOptions.some(selected => selected.email === option.email));
  }, [selectedOptions]);

  const filteredOptions = useMemo(() => {
    return availableOptions.filter(option =>
      option.name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
      || option.email.toLowerCase().indexOf(searchQuery.toLowerCase()) >=0
    );
  }, [availableOptions, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownVisible(true);
    setSearchQuery(event.target.value);
    
  }

  const handleKeyChange = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key
    if (key === KEY.BACKSPACE && searchQuery === "" && selectedOptions.length > 0) {
      console.log("backspace!!")
      if (highlightedOption) {
        console.log("yes if")
        removeFromOptions(highlightedOption.email);
        setHighlightedOption(null);
      } else {
        console.log("no if");
        const option = selectedOptions[selectedOptions.length - 1];
        console.log("last option =>", option)
        setHighlightedOption(option);
      }
    } else {
      setHighlightedOption(null);
    }
    
    
  }

  const handleShowDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  }

  const addToOptions = (option: OptionType) => {
    setSelectedOptions((prevOptions) => [...prevOptions, option]);
    handleShowDropdown();
    setSearchQuery("");
    inputRef.current?.focus();
  }

  const renderOptionsList = () => {
    const inputElement = inputRef.current;
    if (!inputElement) return null;

    const inputRect = inputElement.getBoundingClientRect();
    const dropdownStyle: React.CSSProperties = {
      position: 'absolute',
      top: inputRect.bottom + 10 + window.scrollY,
      left: inputRect.left + window.scrollX,
    };

    return (
      <div style={dropdownStyle} className="flex flex-col max-h-[350px] overflow-auto scrollbar bg-gray-100 min-w-[450px]">
        {filteredOptions.map((item) => {
          return (
            <div onClick={() => addToOptions(item)} key={item.email} className="hover:bg-gray-200 rounded-md cursor-pointer py-2 px-4 flex justify-between items-center gap-4">
              <div className="w-8 h-8 rounded-full flex justify-center items-center text-white" style={{ backgroundColor: item.color}}>{item.name.charAt(0)}</div>
              <p className="flex-1">{item.name}</p>
              <p className="flex-1 text-right text-gray-400 text-sm">{item.email}</p>
            </div>
          )
        })}
      </div>
    )
  }

  const displaySelectedValueChips = () => {
    const options = new Set(selectedOptions);
    return (
      <>
        {Array.from(options).map((item) => {
          const highlightedOptionClass = {
            border: `1.5px solid ${item.color}`,
            backgroundColor: item.chipColor,
          }
          return (
            <div className={`p-1 rounded-lg flex gap-2 items-center min-w-fit ${item.email === highlightedOption?.email ? "shadow-lg shadow-gray-500 mb-1" : ""}`} style={highlightedOptionClass} key={item.email}>
              <div className="w-6 h-6 rounded-full flex justify-center items-center text-white text-sm" style={{ backgroundColor: item.color}}>{item.name.charAt(0)}</div>
              <div className="text-sm">{item.name}</div>
              <div onClick={() => removeFromOptions(item.email)} className="hover:shadow-lg cursor-pointer transition-all duration-300 rounded-full">
                <Image src={closeIcon} width={25} height={25} alt='close-icon' />
              </div>
            </div>
          )
        })}
      </>
    )
  }

  const removeFromOptions = (email: string) => {
    setSelectedOptions((prevOptions) => prevOptions.filter(option => option.email !== email));
    inputRef.current?.focus();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-12 transition-all duration-500">
      <div className="bg-gray-50 p-2">
        <div
          className="bg-white md:min-w-[400px] md:w-[1000px] rounded-lg flex hover:shadow-sm transition-all focus:shadow-md duration-500 flex-wrap items-center gap-2 p-2"
        >
          {
            selectedOptions.length > 0 && displaySelectedValueChips()
          }
            <input
              ref={inputRef}
              onClick={handleShowDropdown}
              placeholder={selectedOptions.length > 0 ? "" : "Add new User..."}
              className="min-w-[100px] flex-1 p-4 outline-none cursor-text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyChange}
            />
            {
              isDropdownVisible && renderOptionsList()
            }
        </div>
      </div>
    </main>
  )
}
