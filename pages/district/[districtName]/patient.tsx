import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";

import { ValuePill } from "../../../components/Pill";
import { getDistrict } from "../../../utils/parser";
import Loader from "../../../lib/assets/icons/LoaderIcon";
import PatientSummaryPage from "../../../components/Patient/PatientSummary";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { BedsSummery } from "../../../components/Patient/BedsSummery";

const Patient = () => {
  const router = useRouter();

  const districtName = router.query.districtName;

  const district = getDistrict(districtName?.toString());

  if (!district) return <Loader />;

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
        <ValuePill title="Facility Count" value={123} />
      </div>
      {district && <PatientSummaryPage district={district} />}

      <TableExportHeader
        label="Facilities"
        searchValue=""
        setSearchValue={() => {}}
      />
      <BedsSummery />
      <BedsSummery />
      <BedsSummery />
    </div>
  );
};

export default Patient;
