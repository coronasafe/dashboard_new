import { Button } from "@windmill/react-ui";
import React from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { Calendar, ChevronDown } from "react-feather";

export const Filters = () => {
  return (
    <div className="flex flex-col items-center justify-between mb-2 px-4 py-2 bg-white dark:bg-black rounded-lg md:flex-row">
      <p className="dark:text-white font-semibold">Filters</p>
      <div className="flex">
        <div className="mx-2">
          <Button
            layout="link"
            iconRight={ChevronDown}
            className="bg-gray-100 dark:bg-gray-900 w-full shadow-xs"
          >
            Facility Type
          </Button>
        </div>
        <div className="flex mx-2">
          <Button className="bg-primary-400 w-full shadow-xs">Single</Button>
          <Button layout="link" className="w-full shadow-xs">
            Range
          </Button>
          <DatePicker calendarIcon={<Calendar />} />
        </div>
      </div>
    </div>
  );
};
