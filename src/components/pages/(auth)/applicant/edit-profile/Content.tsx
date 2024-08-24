"use client";
import React, { useState } from 'react';

import ProfileTab from "./profile/Tab";
import ContactsTab from "./contacts/Tab";
import ProfDetailTab from "./prof-details/Tab";
import DocumentsTab from "./documents/Tab";

const Content = () => {
  const [tabs, setTabs] = useState([
    { name: "Profile", current: true },
    { name: "Contacts", current: false },
    { name: "Professional Details", current: false },
    { name: "Documents", current: false },
  ]);

  const handleTabChange = (selectedTabName: string) => {
    const updatedTabs = tabs.map((tab) => {
      if (tab.name === selectedTabName) {
        return { ...tab, current: true };
      } else {
        return { ...tab, current: false };
      }
    });

    setTabs(updatedTabs);
  };

  const classNames = (...classes: any) => {
    return classes.filter(Boolean).join(" ");
  };

  const currentTab = tabs.find((tab) => tab.current);

  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `}
    >
      <div className="p-4">
        <h3 className="text-2xl text-indigo-dye font-semibold">Edit Profile</h3>
        <div className="md:mx-5">
          {/* Tab header section */}
          <div className="mt-5">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                className="block py-2 px-4 w-full rounded-md border border-gray-300"
                // @ts-expect-error
                defaultValue={tabs.find((tab) => tab.current).name}
                onChange={(event) => handleTabChange(event.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav
                className="-mb-px flex md:space-x-4 lg:space-x-14"
                aria-label="Tabs"
              >
                {tabs.map((tab) => (
                  <li
                    key={tab.name}
                    className={classNames(
                      tab.current
                        ? "border-savoy-blue text-savoy-blue"
                        : "text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "w-1/4 border-b-4 py-4 px-1 text-center text-sm font-semibold list-none cursor-pointer"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                    onClick={() => handleTabChange(tab.name)}
                  >
                    {tab.name}
                  </li>
                ))}
              </nav>
            </div>
          </div>
          <div>
            {
              // @ts-expect-error
              currentTab.name === "Contacts" ? (
                <ContactsTab />
              ) : currentTab?.name === "Professional Details" ? (
                <ProfDetailTab />
              ) : currentTab?.name === "Documents" ? (
                <DocumentsTab />
              ) : (
                <ProfileTab />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
