import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Activity, AlertTriangle, Clock, Database } from "react-feather";
import ContentNav from "../../../components/ContentNav";
import { OxygenFacilityCard } from "../../../components/OxygenFacilityCard";
import { OxygenUsageCard } from "../../../components/OxygenUsageCard";
import { TableExportHeader } from "../../../components/TableExportHeader";
import { getDistrictName } from "../../../utils/parser";

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

const Oxygen = () => {
  const router = useRouter();

  const districtName = getDistrictName(router.query.districtName?.toString());

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <h1 className="dark:text-gray-100 text-3xl my-4  round">
        District Summary
      </h1>
      <OxygenUsageCard data={tempData} />
      <OxygenUsageCard data={tempData} />
      <OxygenUsageCard data={tempData} />
      <OxygenUsageCard data={tempData} />
      <div className="mt-16 my-4">
        <TableExportHeader
          label="Facilities"
          searchValue={""}
          setSearchValue={() => { }}
          className="mb-2"
        />
      </div>
      <OxygenFacilityCard className="mb-16" />
      <OxygenFacilityCard className="mb-16" />
      <OxygenFacilityCard className="mb-16" />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {

    }
  }
}

export default Oxygen;
