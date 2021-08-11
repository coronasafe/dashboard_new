import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";
import PatientSummary from "../../../components/Patient";
import { ValuePill } from "../../../components/Pill";
import { getDistrict, getDistrictName } from "../../../utils/parser";
import useSWR from "swr";

const Patient = () => {
  const router = useRouter();

  const districtName = router.query.districtName;

  const district = getDistrict(districtName?.toString());

  if (!district) return <></>;

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill title="Facility Count" value={123} />
      </div>
      {district && <PatientSummary district={district} />}
    </div>
  );
};

export default Patient;
