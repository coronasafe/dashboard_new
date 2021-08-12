import { useRouter } from "next/router";
import React from "react";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { PATIENT_TYPES, TESTS_TYPES } from "../../../lib/common";
import { getDistrictName } from "../../../utils/parser";

const LSG = () => {
  const router = useRouter();

  const districtName = getDistrictName(router.query.districtName?.toString());

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill title="Facility Count" value={1231} />
        <ValuePill title="Patient Count" value={432} />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(PATIENT_TYPES).map(([key, value], i) => {
          if (key !== "total_patients") {
            return (
              <InfoCard
                key={i}
                title={value}
                //@ts-ignore
                value={Math.random() * 500 + 200}
                delta={
                  //@ts-ignore
                  (Math.random() * 100 + 50) * (Math.random() > 0.5 ? -1 : 1)
                }
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default LSG;
