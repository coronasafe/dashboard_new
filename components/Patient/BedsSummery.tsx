import React from "react";
import { PatientCardDataForCapacity } from "../../lib/common/processor";
import { InfoCard } from "../InfoCard";

interface BedsSummeryProps {
  data: PatientCardDataForCapacity;
}

export const BedsSummery: React.FC<BedsSummeryProps> = ({ data }) => {
  return (
    <div className="py-8 border-b dark:border-gray-700">
      <div className="flex">
        <div className="flex-grow dark:text-gray-100">
          <h1 className="text-xl">{data.facility_name}</h1>
          <h2 className="opacity-70 mt-2">{data.facility_type}</h2>
          <h2 className="opacity-70">{data.phone_number}</h2>
        </div>
        <div className="dark:text-gray-100">
          <h1 className="text-xl">Last Updated</h1>
          <h2 className="opacity-70">{data.last_updated}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4 pt-4">
        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">ISOLATION</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard
              title="Home Isolation"
              value={data.home_isolation?.total || 0}
              delta={data.home_isolation?.today || 0}
              small
            />
            <InfoCard
              title="Isolation Room"
              value={data.isolation_room?.total || 0}
              delta={data.isolation_room?.today || 0}
              small
            />
          </div>
        </div>

        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">OXYGEN BEDS</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard
              title="Oxygen Bed"
              value={data.oxygen_bed?.total || 0}
              delta={data.oxygen_bed?.today || 0}
              small
            />
          </div>
        </div>
        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">ICU</h1>
          <div className="grid grid-cols-2 gap-2">
            <InfoCard
              title="ICU"
              value={data.icu?.total || 0}
              delta={data.icu?.today || 0}
              small
            />
            <InfoCard title="Oxygen Supports" value={12} delta={1} small />
            <InfoCard
              title="Non Invasive Ventilator"
              value={data.icu_with_non_invasive_ventilator?.total || 0}
              delta={data.icu_with_non_invasive_ventilator?.today || 0}
              small
            />
            <InfoCard
              title="Invasive Ventilator"
              value={data.icu_with_invasive_ventilator?.total || 0}
              delta={data.icu_with_invasive_ventilator?.today || 0}
              small
            />
          </div>
        </div>
        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">WARDS</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard
              title="Gynecology Ward"
              value={data.gynaecology_ward?.total || 0}
              delta={data.gynaecology_ward?.today || 0}
              small
            />
            <InfoCard
              title="Paediatric Ward"
              value={data.paediatric_ward?.total || 0}
              delta={data.paediatric_ward?.today || 0}
              small
            />
          </div>
        </div>
      </div>
    </div>
  );
};
