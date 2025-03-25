import React from "react";

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
        <div className="w-3.5 h-3.5 absolute left-[2.56px] top-[2.56px] outline outline-2 outline-offset-[-1px] outline-black" />
        <div className="w-1 h-1 absolute left-[14.22px] top-[14.22px] outline outline-2 outline-offset-[-1px] outline-black" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-grow text-neutral-500 text-lg font-medium font-['Barlow'] leading-7 bg-transparent outline-none"
      />
    </div>
  );
};

export default SearchBar;
