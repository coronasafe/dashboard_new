import React from "react";
import { InfoCard } from "../InfoCard";

export const BedsSummery = () => {
  return (
    <div className="py-8 border-b dark:border-gray-700">
      <div className="flex">
        <div className="flex-grow dark:text-gray-100">
          <h1 className="text-xl">
            E K NAYANAR HALL NETTOOR, DOMICILIARY CARE CENTRE
          </h1>
          <h2 className="opacity-70 mt-2">Second Line Treatment Center</h2>
          <h2 className="opacity-70">+919745781243</h2>
        </div>
        <div className="dark:text-gray-100">
          <h1 className="text-xl">Last Updated</h1>
          <h2 className="opacity-70">A day ago</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4 pt-4">
        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">ISOLATION</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard title="Home Isolation" value={0} small />
            <InfoCard title="Isolation Room" value={41} delta={9} small />
          </div>
        </div>

        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">OXYGEN BEDS</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard title="Oxygen Bed" value={0} small />
          </div>
        </div>
        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">ICU</h1>
          <div className="grid grid-cols-2 gap-2">
            <InfoCard title="ICU" value={0} small />
            <InfoCard title="Oxygen Supports" value={12} delta={1} small />
            <InfoCard
              title="Non Invasive Ventilator"
              value={34}
              delta={0}
              small
            />
            <InfoCard title="Invasive Ventilator" value={29} delta={-8} small />
          </div>
        </div>
        <div>
          <h1 className="text-lg dark:text-gray-200 mb-4">WARDS</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard title="Gynecology Ward" value={0} small />
            <InfoCard title="Paediatric Ward" value={41} delta={9} small />
          </div>
        </div>
      </div>
    </div>
  );
};
