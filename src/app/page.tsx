'use client'
import { useEffect, useMemo, useRef, useState } from "react"
import optionsData from "./data/options"
import { OptionType } from "../../types/types";
import closeIcon from "./assets/closeIcon.svg"
import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handleShowDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  }

  const addToOptions = (option: OptionType) => {
    setSelectedOptions((prevOptions) => [...prevOptions, option]);
    handleShowDropdown();
  }

  const renderOptionsList = () => {
    return (
      <div className="flex flex-col px-3 max-h-[350px] overflow-auto scrollbar">
        {filteredOptions.map((item) => {
          return (
            <div onClick={() => addToOptions(item)} key={item.email} className="hover:bg-gray-200 rounded-md cursor-pointer py-2 px-4 flex justify-between items-center gap-4">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.color}}></div>
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
      <div className="flex gap-2 text-gray-600 justify-start">
        {Array.from(options).map((item) => {
          return (
            <div className="p-1 rounded-lg flex gap-2 items-center min-w-fit" style={{ border: `1.5px solid ${item.color}`, backgroundColor: item.chipColor }} key={item.email}>
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color}}></div>
              <div className="text-sm">{item.name}</div>
              <div onClick={() => removeFromOptions(item.email)} className="hover:shadow-lg cursor-pointer transition-all duration-300 rounded-full">
                <Image src={closeIcon} width={25} height={25} alt='close-icon' />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const removeFromOptions = (email: string) => {
    setSelectedOptions((prevOptions) => prevOptions.filter(option => option.email !== email));
  }

//   useEffect(() => {
//     const closeDropdown = e => {
//         if (inputRef.current && !inputRef.current.contains(e.target)) {
//             setIsDropdownVisible(false);
//         }
//     }

//     document.body.addEventListener('click', closeDropdown);

//     return () => document.body.removeEventListener('click', closeDropdown);
// }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-12 transition-all duration-500">
      <div className="flex flex-col gap-2">
        <div
          className="bg-gray-50 relative md:min-w-[400px] md:w-[700px] rounded-lg flex flex-wrap gap-2 items-center p-2"
        >
          <div className="max-w-[60%] overflow-x-auto scrollbar">
            {
              selectedOptions.length > 0 && displaySelectedValueChips()
            }
          </div>
          <input
            ref={inputRef}
            onClick={handleShowDropdown}
            placeholder={selectedOptions.length > 0 ? "" : "Add new User..."}
            className=" flex-auto min-w-[100px] rounded-lg p-4 outline-none hover:shadow-sm transition-all duration-500 focus:shadow-md cursor-text"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {
          isDropdownVisible ? 
          <div>
            {renderOptionsList()}
          </div>
          : null
        }
      </div>
    </main>
  )
}
