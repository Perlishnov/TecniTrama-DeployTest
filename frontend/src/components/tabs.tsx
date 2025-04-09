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
      <TabList
        aria-label="Secciones de proyectos"
        className="flex justify-center gap-6 border-b border-gray-300"
      >
        {labels.map((label, index) => (
          <Tab
            key={index}
            className={({ isSelected }) =>
              `px-1 pb-2 text-sm font-medium border-b-2 transition-colors duration-200 ${isSelected
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
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