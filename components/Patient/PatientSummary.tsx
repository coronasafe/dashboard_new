import axios from "axios";
import useSWR from "swr";
import { PATIENT_TYPES } from "../../lib/common";
import { PatientSummary } from "../../lib/types";
import { District } from "../../lib/types/common";
import PatientSummaryCard from "./PatientSummaryCard";

export interface PatientSummaryProps {
  district: District;
}

const PatientSummaryPage: React.FC<PatientSummaryProps> = ({ district }) => {
  const { data } = useSWR<PatientSummary>("/api/patient/summary", () =>
    axios
      .get("/api/patient/summary", { params: { districtId: district.id } })
      .then((res) => res.data?.data)
  );

  return (
    <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
      {Object.entries(PATIENT_TYPES).map(([key, value], i) => (
        <PatientSummaryCard
          key={i}
          title={value}
          value={(data && data[key]?.total) || 0}
          delta={(data && data[key]?.today) || 0}
        />
      ))}
    </div>
  );
};

export default PatientSummaryPage;
