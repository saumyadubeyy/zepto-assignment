'use client'
import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image";
// types
import { OptionType } from "../../types/types";
// static data
import optionsData from "./data/options"
// utils
import { scrollIntoView } from "./utils/scrollIntoView";
// components
import UserChips from "./components/UserChips";
import DropdownList from "./components/DropdownList";

// enum
enum KEY {
  BACKSPACE = "Backspace",
  ARROW_DOWN = "ArrowDown",
  ARROW_UP = "ArrowUp",
  ENTER = "Enter",
  ESCAPE = "Escape"
}

export default function Home() {
  // states
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [highlightedOption, setHighlightedOption] = useState<OptionType | null>();
  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = dropdownRef.current;
      const inputElement = inputRef.current;

      if (
        dropdownElement &&
        !dropdownElement.contains(event.target as Node) &&
        inputElement &&
        !inputElement.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    // Attach the event listener
    document.addEventListener("click", handleClickOutside);

    // Detach the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef, inputRef]);

  // all except the already selected options
  const availableOptions: OptionType[] = useMemo(() => {
    // Filter options that are not selected
    return optionsData.options.filter(option => !selectedOptions.some(selected => selected.email === option.email));
  }, [selectedOptions]);

  // items that match the search query
  const filteredOptions: OptionType[] = useMemo(() => {
    return availableOptions.filter(option =>
      option.name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0 // matching the name to searchQuery
      || option.email.toLowerCase().indexOf(searchQuery.toLowerCase()) >=0 // matching the email to searchQuery
    );
  }, [availableOptions, searchQuery]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownVisible(true);
    setSearchQuery(event.target.value);
    removeHighlightFromOption();
  }

  // handles backspace, arrowUp, arrowDown, escape and enter key when input is focussed
  const handleKeyChange = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key
    if (key === KEY.BACKSPACE && searchQuery === "" && selectedOptions.length > 0) {
      handleBackspace();
    } 
    // display the menu if the input is focussed, and arrowDown, arrowUp or enter key is pressed.
    else if ((key === KEY.ARROW_DOWN || key === KEY.ENTER || key === KEY.ARROW_UP) && !isDropdownVisible) {
      setIsDropdownVisible(true);
    }
    else if ((key === KEY.ARROW_DOWN || key === KEY.ARROW_UP) && isDropdownVisible) {
      let index = filteredOptions.findIndex(item => item.email === (highlightedOption?.email || filteredOptions[0].email)) || 0;
      if (key === KEY.ARROW_DOWN) {
        handleKeyArrowDown(index);
      } else if (key === KEY.ARROW_UP) {
        handleKeyArrowUp(index);
      }
    } else if (key === KEY.ENTER && highlightedOption) {
      addToOptions(highlightedOption);
      removeHighlightFromOption();
    } else if (key === KEY.ESCAPE) {
      removeHighlightFromOption();
      setIsDropdownVisible(false);
    } else {
      removeHighlightFromOption();
    }
  }

  const handleBackspace = () => {
    if (highlightedOption) {
      deleteFromSelectedItemsList(highlightedOption.email);
      removeHighlightFromOption();
    } else {
      const option = selectedOptions[selectedOptions.length - 1];
      setHighlightedOption(option);
    }
    setIsDropdownVisible(false);
  }

  const handleKeyArrowDown = (index: number) => {
    // Handle Arrow Down key
    if (index < filteredOptions.length - 1) {
      setHighlightedOption(filteredOptions[index + 1]);

      const container = dropdownRef.current;
      const highlightedElement = document.getElementById(`option-${filteredOptions[index + 1].email}`);
      scrollIntoView(container, highlightedElement);
    } else {
      // If already at the last option, wrap to the first option
      setHighlightedOption(filteredOptions[0]);
    }
  }

  const handleKeyArrowUp = (index: number) => {
    // Handle Arrow Up key
    if (index > 0) {
      setHighlightedOption(filteredOptions[index - 1]);
      const container = dropdownRef.current;
      const highlightedElement = document.getElementById(`option-${filteredOptions[index - 1].email}`);
      scrollIntoView(container, highlightedElement);
    } else {
      // If already at the first option, wrap to the last option
      setHighlightedOption(filteredOptions[filteredOptions.length - 1]);
      const container = dropdownRef.current;
      const highlightedElement = document.getElementById(`option-${filteredOptions[filteredOptions.length - 1].email}`);
      scrollIntoView(container, highlightedElement);
    }
  }

  // toggle display of dropdown
  const handleShowDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  }

  // add an item to selected options array
  const addToOptions = (option: OptionType) => {
    setSelectedOptions((prevOptions) => [...prevOptions, option]);
    handleShowDropdown();
    setSearchQuery("");
    inputRef.current?.focus();
  }

  const dropdownStyle = useMemo(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return undefined;

    const inputRect = inputElement.getBoundingClientRect();
    const dropdownStyle: React.CSSProperties = {
      position: 'absolute',
      top: inputRect.bottom + 10 + window.scrollY,
      left: inputRect.left + window.scrollX,
    };
    return dropdownStyle;
  }, [inputRef.current, selectedOptions]);

  const removeHighlightFromOption = () => {
    setHighlightedOption(null);
  }

  const deleteFromSelectedItemsList = (email: string) => {
    setSelectedOptions((prevOptions) => prevOptions.filter(option => option.email !== email));
    inputRef.current?.focus();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-12 transition-all duration-500">
      <div className="bg-neutral-300 p-2">
        <div
          className="bg-white md:min-w-[400px] md:w-[1000px] rounded-lg flex hover:shadow-sm transition-all focus:shadow-md duration-500 flex-wrap items-center gap-2 p-2"
        >
          {
            selectedOptions.length > 0 && 
            <UserChips 
              options={selectedOptions} 
              highlightedOption={highlightedOption} 
              deleteHandler={deleteFromSelectedItemsList} 
            />
          }
            <input
              ref={inputRef}
              onClick={handleShowDropdown}
              placeholder={selectedOptions.length > 0 ? "" : "Add new User..."}
              className="min-w-[100px] flex-1 py-4 outline-none cursor-text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyChange}
            />
            {
              isDropdownVisible && 
              <DropdownList 
                dropdownStyle={dropdownStyle} 
                options={filteredOptions} 
                highlightedOption={highlightedOption} 
                removeHighlightFromOption={removeHighlightFromOption} 
                addToOptions={addToOptions} 
                containerRef={dropdownRef} 
              />
            }
        </div>
        {searchQuery && filteredOptions.length === 0 && <p className="p-2 ">no search results found</p>}
      </div>
    </main>
  )
}
