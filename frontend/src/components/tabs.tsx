// CustomTabs.tsx
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
  } from 'react-aria-components';
  import { ReactElement } from 'react';
  
  interface CustomTabProps {
    label: string;
    children: React.ReactNode;
  }
  
  export function CustomTab({ children }: CustomTabProps) {
    return <TabPanel className="p-4 border rounded-lg">{children}</TabPanel>;
  }
  
  interface CustomTabsProps {
    children: ReactElement<CustomTabProps>[]; // o ReactNode si quieres permitir mezcla más libre
  }
  
  export default function CustomTabs({ children }: CustomTabsProps) {
    const labels = children.map((child) => child.props.label);
  
    return (
      <Tabs className="w-full">
        <TabList aria-label="Secciones de proyectos" className="flex gap-4 mb-6">
          {labels.map((label, index) => (
            <Tab
              key={index}
              className={({ isSelected }) =>
                `px-4 py-2 rounded-full ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`
              }
            >
              {label}
            </Tab>
          ))}
        </TabList>
  
        {children}
      </Tabs>
    );
  }
  