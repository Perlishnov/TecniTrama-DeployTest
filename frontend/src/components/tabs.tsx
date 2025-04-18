import React, { useState, Children, isValidElement, cloneElement } from 'react';

export interface CustomTabProps {
  label: string;
  children: React.ReactNode;
}

export const CustomTab: React.FC<CustomTabProps> = ({ children }) => {
  return <>{children}</>;
};

export interface CustomTabsProps {
  children: React.ReactElement<CustomTabProps>[];
}

const CustomTabs: React.FC<CustomTabsProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabLabels = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return child.props.label;
    }
    return null;
  });

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex border-b mb-4">
        {tabLabels?.map((label, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 font-medium focus:outline-none ${
              activeIndex === index ? "border-t-2 border-black" : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Active Tab Content */}
      <div>{children[activeIndex]}</div>
    </div>
  );
};

export default CustomTabs;
