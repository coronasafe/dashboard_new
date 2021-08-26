import React from "react";

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

interface FacilityInfoProps {
  name?: string;
  phoneNumber?: string;
  facilityType?: string;
  address?: string;
  localBodyName?: string;
  wardNumber?: number;
  wardName?: string;
  districtName?: string;
}
export const FacilityInfo: React.FC<FacilityInfoProps> = (props) => {
  const {
    name,
    phoneNumber,
    facilityType,
    address,
    localBodyName,
    wardNumber,
    wardName,
    districtName,
  } = props;
  return (
    <div className="mt-4">
      <h1 className="mt-6 mb-12 text-4xl font-medium">{name || "---"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
        <div className="text-lg text-gray-900 dark:text-white">
          <span className="text-gray-500 dark:text-gray-400 mr-2 w-40 inline-block">
            Phone:{" "}
          </span>
          {phoneNumber || "---"}
        </div>

        <div className="text-lg text-gray-900 dark:text-white">
          <span className="text-gray-500 dark:text-gray-400 mr-2 w-40 inline-block">
            Facility Type:{" "}
          </span>
          {facilityType || "---"}
        </div>

        <div className="text-lg text-gray-900 dark:text-white">
          <span className="text-gray-500 dark:text-gray-400 mr-2 w-40 inline-block">
            Address:{" "}
          </span>
          {address || "---"}
        </div>

        <div className="text-lg text-gray-900 dark:text-white">
          <span className="text-gray-500 dark:text-gray-400 mr-2 w-40 inline-block">
            Local Body:{" "}
          </span>
          {localBodyName || "---"}
        </div>

        <div className="text-lg text-gray-900 dark:text-white">
          <span className="text-gray-500 dark:text-gray-400 mr-2 w-40 inline-block">
            Ward:{" "}
          </span>
          {`${wardNumber ?? "---"}, ${wardName || "---"}`}

          <div className="text-lg text-gray-900 dark:text-white">
            <span className="text-gray-500 dark:text-gray-400 mr-2 w-40 inline-block">
              District:{" "}
            </span>
            {districtName || "---"}
          </div>
        </div>
      </div>
    </div>
  );
};
