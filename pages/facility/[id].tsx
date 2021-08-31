import React from "react";
import { Database, Activity, Clock, AlertTriangle } from "react-feather";
import { RadialCard } from "../../components/Charts";
import { FacilityInfo } from "../../components/Facility";
import GMap from "../../components/GMap/GMap";
import { InfoCard } from "../../components/InfoCard";
import { OxygenUsageCard } from "../../components/OxygenUsageCard";
import {
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES,
} from "../../lib/common";
import { capacityMockData } from "../../utils/mock/capacity";

const mock = {
  name: "Akshaya Hospital",
  phoneNumber: "+919495317311",
  facilityType: "Private Hospital",
  address: "54/3193,Kaloor Kadavanthra Road,Kadavanthra,Cochin 682020",
  localBodyName: "Cochin  Corporation, Ernakulam District",
  wardNumber: 54,
  wardName: "ELAMKULAM",
  districtName: "Ernakulam",
};

const tempData = [
  {
    icon: <Database className="text-blue-500 mr-4" size="40px" />,
    label: "Liquid Oxygen",
    value: 51418.36,
    unit: "Cubic Meter",
  },
  {
    icon: <Activity className="text-yellow-400 mr-4" size="40px" />,
    label: "Burn Rate",
    value: 1061.34,
    unit: "Cubic Meter / hour",
  },
  {
    icon: <Clock className="text-green-500 mr-4" size="40px" />,
    label: "Time to Empty",
    value: 48.45,
    unit: "Hours",
  },
  {
    icon: <AlertTriangle className="text-red-500 mr-4" size="40px" />,
    label: "High Alerts",
    value: 1,
    unit: "Facilities",
  },
];

const FacilityDetails = () => {
  const { facilitiesTrivia, filterDistrict, todayFiltered } = capacityMockData;
  return (
    <div className="2xl:container mx-auto px-4 dark:text-white">
      <FacilityInfo {...mock} />
      <section id="capacity" className="py-4 my-4">
        <h1 className="dark:text-gray-100 text-3xl mb-4 mt-12"> Capacity </h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 my-5">
          {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => {
            return (
              <RadialCard
                label={k.name}
                count={facilitiesTrivia.current.count}
                // @ts-ignore
                current={facilitiesTrivia.current[k.id]}
                // @ts-ignore
                previous={facilitiesTrivia.previous[k.id]}
                key={k.id}
              />
            );
          })}
          {AVAILABILITY_TYPES_ORDERED.map((k) => {
            const key = k as unknown as keyof typeof AVAILABILITY_TYPES;
            return (
              <RadialCard
                label={AVAILABILITY_TYPES[key]}
                count={facilitiesTrivia.current.count}
                current={facilitiesTrivia.current[key]}
                previous={facilitiesTrivia.previous[key]}
                reverseIndicator
                key={k}
              />
            );
          })}
        </div>
      </section>
      <section id="oxygen" className="py-4 my-4">
        <h1 className="dark:text-gray-100 text-3xl mb-4"> Oxygen </h1>
        <OxygenUsageCard data={tempData} />
        <OxygenUsageCard data={tempData} />
        <OxygenUsageCard data={tempData} />
      </section>
      <section id="expected-burn-rate" className="py-4 my-4">
        <h1 className="dark:text-gray-100 text-3xl mb-4">Expected Burn Rate</h1>
        <div className="grid grid-cols-3 gap-2">
          <InfoCard title="Oxygen Bed" value={901.4} />
          <InfoCard title="ICU" value={526.68} />
          <InfoCard title="Ventilator" value={87.78} />
        </div>
      </section>
      <section id="capacity-map" className="py-4 my-4">
        <h1 className="dark:text-gray-100 text-3xl mb-4"> Map </h1>

        {/* <GMap district={filterDistrict} facilities={todayFiltered} /> */}
      </section>
    </div>
  );
};

export default FacilityDetails;
