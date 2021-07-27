import React from "react";

interface PillProps {
  title: string;
}

export const Pill: React.FC<PillProps> = ({ title, children }) => {
  return (
    <div className="flex items-center justify-between bg-white dark:text-gray-200 dark:bg-black rounded-lg shadow-xs">
      <span className="mx-2 text-xxs font-medium leading-none xl:text-sm">
        {title}
      </span>
      <div className="flex m-1 text-sm bg-green-500 rounded-lg xl:text-base">
        {children}
      </div>
    </div>
  );
};
