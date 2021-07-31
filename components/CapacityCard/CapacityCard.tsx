import { Card } from "@windmill/react-ui";
import React from "react";
import { ShowBedInfo } from "./ShowBedInfo";

export function CapacityCard({ data }: any) {
  return (
    <Card className="flex flex-col mb-4 mt-4 p-4 rounded-xl">
      <div className="flex flex-col">
        <div>
          <a href={`/facility/${data.facility_id}`}>
            <p className="dark:text-gray-200 text-xl font-medium">
              {data.facility_name}
            </p>
          </a>
        </div>
        <div className="flex flex-row justify-between w-full md:w-3/12">
          <div>
            <p className="dark:text-gray-400 text-gray-600 text-sm font-semibold">
              {data.facility_type}
            </p>
          </div>
          <div>
            <p className="dark:text-gray-400 text-gray-600 text-sm font-semibold">
              {data.phone_number}
            </p>
          </div>
        </div>
      </div>

      <div className="h-4/5 flex flex-col mt-1 md:flex-row">
        <div className="flex flex-row mt-1 pb-1 pt-1 border-b border-t md:flex-col md:mt-8 md:pb-0 md:pr-5 md:pt-0 md:border-0">
          <div className="w-1/2 md:w-full">
            <p className="dark:text-gray-400 text-gray-600 font-medium">
              Last Updated
            </p>
            <p className="dark:text-gray-200 text-xl font-medium">
              {data.last_updated}
            </p>
          </div>
          <div className="w-1/2 md:mt-5 md:w-full">
            <p className="text-center dark:text-gray-400 text-gray-600 font-medium md:text-left">
              Patient/Discharged
            </p>
            <p className="text-center dark:text-gray-200 text-xl font-medium md:text-left">
              {data.patient_discharged}
            </p>
          </div>
        </div>

        <div className="grid-rows-7 grid mt-2 w-full overflow-x-scroll overflow-y-hidden md:mt-0 md:pl-5 md:border-l md:overflow-hidden">
          <div className="grid row-span-1 grid-cols-9 w-800 md:w-full">
            <div className="col-span-1" />
            <div className="col-span-2">
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold">
                ORDINARY BEDS
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold">
                OXYGEN BEDS
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold">
                ICU
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold">
                VENTILATORS
              </p>
            </div>
          </div>
          <ShowBedInfo
            bedData={data.covid}
            category="Covid"
            total={data.final_total}
          />
          <ShowBedInfo
            bedData={data.non_covid}
            category="Non Covid"
            total={data.final_total}
          />
          <ShowBedInfo
            bedData={data.final_total}
            category="Total"
            total={data.final_total}
          />
        </div>
      </div>
    </Card>
  );
}
