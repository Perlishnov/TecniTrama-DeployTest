import React from "react";
import SearchIcon from "../assets/icons/search.svg";
export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div
      data-state="Default"
      className={`w-72 h-14 p-4 bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-neutral-400 inline-flex justify-start items-center gap-4 ${className}`}
    >
      <div className="w-5 h-5 relative overflow-hidden">
        <img src={SearchIcon} alt="Search Icon" className="object-contain w-full h-full" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-grow text-neutral-500 text-lg font-medium font-barlow leading-7 bg-transparent outline-none"
      />
    </div>
  );
};

export default SearchBar;
