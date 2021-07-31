import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";
import GMap from "../../../components/GMap/GMap";
import { ACTIVATED_DISTRICTS } from "../../../lib/common";
import { careSummary, CareSummaryResponse } from "../../../lib/types";
import { capacityMockData } from "../../../utils/mock/capacity";
import { GetDistrictName, Parameterize } from "../../../utils/parser";
import Capacity from "./capacity";

const Map = () => {
  const router = useRouter();

  const { todayFiltered, filterDistrict } = capacityMockData;
  return (
    <div className="container mx-auto px-4 my-4">
      <ContentNav />
      <section id="capacity-map" className="py-4 my-4">
        <h1 className="dark:text-gray-100 text-3xl mb-4"> Map </h1>

        <GMap district={filterDistrict} facilities={todayFiltered} />
      </section>
    </div>
  );
};

export default Map;

export const getServerSideProps: GetServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const district = ACTIVATED_DISTRICTS.find(
    (obj) =>
      Parameterize(obj.name) === Parameterize(params?.districtName as string)
  );

  if (district) {
    const data = await careSummary("facility", district.id);

    return {
      props: {
        data,
        districtName: Parameterize(district.name),
      },
    };
  }

  return {
    notFound: true,
  };
};
