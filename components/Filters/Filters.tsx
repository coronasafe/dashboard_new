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
import React, { useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { Calendar, ChevronDown } from "react-feather";
import { FACILITY_TYPES, GOVT_FACILITY_TYPES } from "../../lib/common";

export const Filters = () => {
  const [isFacilityTypeOpen, setIsFacilityTypeOpen] = useState(false);
  const [facilityTypesFilterOptions, setFacilityTypesFilterOptions] =
    useState(FACILITY_TYPES);

  const [_filterFacilityTypes, _setFilterFacilityTypes] = useState<string[]>(
    []
  );
  const [facilityTypeFilterOpen, setFacilityTypeFilterOpen] = useState(false);
  const resetFacilityTypeFilter = () => {
    setFacilityTypeFilterOpen(false);
    setFacilityTypesFilterOptions(FACILITY_TYPES);
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
                  onChange={(e) => {
                    // TODO: Replace fuzzysort with fuse.js
                    // setFacilityTypesFilterOptions(
                    //     e.target.value
                    //         ? fuzzysort
                    //             .go(e.target.value, facilityTypesFilterOptions)
                    //             .map((v) => v.target)
                    //         : FACILITY_TYPES
                    // );
                  }}
                />
                <Button
                  layout="link"
                  onClick={() => _setFilterFacilityTypes([])}
                  className="dark:bg-gray-900 shadow-xs"
                >
                  Clear
                </Button>
                <Button
                  layout="link"
                  onClick={() => {
                    _setFilterFacilityTypes(GOVT_FACILITY_TYPES);
                  }}
                  className="whitespace-no-wrap dark:bg-gray-900 shadow-xs"
                >
                  All Govt.
                </Button>
                <Button
                  layout="link"
                  onClick={() => _setFilterFacilityTypes(FACILITY_TYPES)}
                  className="dark:bg-gray-900 shadow-xs"
                >
                  All
                </Button>
              </div>

              <HelperText className="ml-1">
                {`Selected ${_filterFacilityTypes.length} items`}
              </HelperText>

              <Card className="flex flex-col mb-2 p-2 h-64 overflow-y-auto">
                {facilityTypesFilterOptions.map((d, i) => (
                  <Label key={i} check>
                    <Input
                      css
                      onChange={() => {
                        const _t = _filterFacilityTypes.indexOf(d);
                        const _tmp = [..._filterFacilityTypes];
                        if (_t > -1) {
                          _tmp.splice(_t, 1);
                        } else {
                          _tmp.push(d);
                        }
                        _setFilterFacilityTypes(_tmp);
                      }}
                      type="checkbox"
                      checked={_filterFacilityTypes.includes(d)}
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
              <Button className="w-full sm:w-auto">Accept</Button>
            </ModalFooter>
          </Modal>
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
