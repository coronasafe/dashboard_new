import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";
import { InfoCard } from "../../../components/InfoCard";
import { ValuePill } from "../../../components/Pill";
import { PATIENT_TYPES } from "../../../lib/common";
import { GetDistrictName } from "../../../utils/parser";

const Patient = () => {
  const router = useRouter();

  const districtName = GetDistrictName(router.query.districtName);

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
        <ValuePill title="Facility Count" value={123} />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries(PATIENT_TYPES).map(([key, value], i) => {
          if (key !== "total_patients") {
            return (
              <InfoCard
                key={i}
                title={value}
                value={Math.random() * 500 + 200}
                delta={
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

export default Patient;
