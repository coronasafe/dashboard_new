import {
  Button,
  Card,
  HelperText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@windmill/react-ui";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { Calendar, ChevronDown } from "react-feather";
import {
  FACILITY_TYPES,
  FACILITY_TYPES_INDEX,
  GOVT_FACILITY_TYPES,
} from "../../lib/common";
import { toDateString } from "../../utils/parser";

export interface FilterProps {
  initialFacilityType?: string[];
  initialDate?: string;
  query?: URLSearchParams;
}

const facilityFuse = new Fuse(FACILITY_TYPES, {
  shouldSort: true,
  threshold: 0.3,
});

export const Filters: React.FC<FilterProps> = ({
  initialFacilityType,
  initialDate,
  query,
}) => {
  const [isFacilityTypeOpen, setIsFacilityTypeOpen] = useState(false);
  const router = useRouter();
  const [facilityOptions, setFacilityOptions] = useState(FACILITY_TYPES);
  const [filterDate, setFilterDate] = useState<Date | null>(
    initialDate ? new Date(initialDate) : null
  );
  const pathname = process.browser ? window.location.pathname : "/";
  const [selectedFacility, setSelectedFacility] = useState(
    initialFacilityType || []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (q) {
      const result = facilityFuse.search(q).map((i) => i.item);
      setFacilityOptions(result);
    } else {
      setFacilityOptions(FACILITY_TYPES);
    }
  };

  const handleAcceptClick = () => {
    const q = selectedFacility?.map((i) => FACILITY_TYPES_INDEX[i]);
    // console.log({ selectedFacility, FACILITY_TYPES, FACILITY_TYPES_INDEX });
    if (q.length) {
      query?.set("facility_type", q.join(","));
    } else {
      query?.delete("facility_type");
    }
    router.push(`${pathname}?${query?.toString() || ""}`);
    setIsFacilityTypeOpen(false);
  };

  const handleDateChange = (e: Date) => {
    if (dayjs(e).isValid()) {
      query?.set("date", toDateString(e));
    } else {
      query?.delete("date");
    }
    setFilterDate(e);
    router.push(`${pathname}?${query?.toString() || ""}`);
  };

  return (
    <div className="flex flex-col items-center justify-between mb-2 px-4 bg-white dark:bg-black rounded-lg md:flex-row">
      <p className="dark:text-white font-semibold">Filters</p>
      <div className="flex flex-wrap items-center">
        <div className="m-2">
          <Button
            layout="link"
            iconRight={ChevronDown}
            className="bg-gray-100 dark:bg-gray-900 w-full shadow-xs"
            onClick={() => setIsFacilityTypeOpen(true)}
          >
            Facility Type
          </Button>
          <Modal
            isOpen={isFacilityTypeOpen}
            onClose={() => setIsFacilityTypeOpen(false)}
          >
            <ModalHeader>Facility Type</ModalHeader>
            <ModalBody>
              <div className="inline-grid gap-1 grid-rows-none w-full xl:grid-flow-col-dense xl:grid-rows-1 xl:place-content-end">
                <Input
                  css
                  className="dark:bg-gray-900"
                  placeholder="Search facility types"
                  onChange={handleSearch}
                />
                <Button
                  layout="link"
                  onClick={() => setSelectedFacility([])}
                  className="dark:bg-gray-900 shadow-xs"
                >
                  Clear
                </Button>
                <Button
                  layout="link"
                  onClick={() => {
                    setSelectedFacility(GOVT_FACILITY_TYPES);
                  }}
                  className="whitespace-no-wrap dark:bg-gray-900 shadow-xs"
                >
                  All Govt.
                </Button>
                <Button
                  layout="link"
                  onClick={() => setSelectedFacility(FACILITY_TYPES)}
                  className="dark:bg-gray-900 shadow-xs"
                >
                  All
                </Button>
              </div>

              <HelperText className="ml-1">
                {`Selected ${selectedFacility?.length || 0} items`}
              </HelperText>

              <Card className="flex flex-col mb-2 p-2 h-64 overflow-y-auto">
                {facilityOptions.map((d, i) => (
                  <Label key={i} check>
                    <Input
                      css
                      onChange={(e) => {
                        console.log(e);
                        const newVal = !e.target.checked
                          ? _.remove([...selectedFacility], (i) => i !== d)
                          : _.uniq([...selectedFacility, d]);

                        setSelectedFacility(newVal);
                      }}
                      type="checkbox"
                      checked={selectedFacility?.includes(d)}
                    />
                    <span className="ml-2">{d}</span>
                  </Label>
                ))}
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button
                className="w-full sm:w-auto"
                layout="outline"
                onClick={() => setIsFacilityTypeOpen(false)}
              >
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleAcceptClick}>
                Accept
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div className="flex mx-2">
          <Button className="bg-primary-400 w-full shadow-xs">Single</Button>
          <Button layout="link" className="w-full shadow-xs">
            Range
          </Button>
          <DatePicker
            calendarIcon={<Calendar />}
            value={filterDate}
            maxDate={new Date()}
            onChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};
