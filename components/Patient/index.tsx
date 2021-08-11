import useSWR from "swr";
import { PATIENT_TYPES } from "../../lib/common";
import { PatientSummary } from "../../lib/types";
import { District } from "../../lib/types/common";
import { InfoCard } from "../InfoCard";

export interface PatientSummaryProps {
  district: District;
}

const PatientSummaryPage: React.FC<PatientSummaryProps> = ({ district }) => {
  const { data } = useSWR<PatientSummary>(
    "/api/patient/summary?districtID=" + district.id
  );

  console.log(data);

  return (
    <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
      {Object.entries(PATIENT_TYPES).map(([key, value], i) => {
        return (
          <InfoCard
            key={i}
            title={value}
            value={(data && data[key]?.total) || 10}
            delta={(Math.random() * 100 + 50) * (Math.random() > 0.5 ? -1 : 1)}
          />
        );
      })}
    </div>
  );
};

export default PatientSummaryPage;
