import { Tab } from "@headlessui/react";
import { useState } from "react";

type TabType = {
 title: string;
  component: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
};

type DynamicTabProps = {
  tabs: TabType[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DynamicTabs({ tabs }: DynamicTabProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="w-full">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="mx-auto max-w-md">
          <Tab.List className="flex w-full gap-2 rounded-xl bg-white p-1 border border-gray-200 shadow-sm">
            {tabs.map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-center transition-colors duration-200",
                    selected
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-blue-100"
                  )
                }
              >
                {tab.title}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="mt-4 w-full">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className="w-full rounded-xl bg-white p-6 shadow-md"
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}