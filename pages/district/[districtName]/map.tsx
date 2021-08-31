import _ from "lodash";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";
import GMap from "../../../components/GMap/GMap";
import { ACTIVATED_DISTRICTS } from "../../../lib/common";
import {
  ProcessFacilityDataReturnType,
  processFacilityDataUpdate,
} from "../../../lib/common/processor";
import { careSummary, CareSummaryResponse } from "../../../lib/types";
import { parameterize, toDateString } from "../../../utils/parser";

interface MapProps {
  data: CareSummaryResponse;
  filterDistrict: typeof ACTIVATED_DISTRICTS[number];
  filtered: ProcessFacilityDataReturnType;
  todayFiltered: ProcessFacilityDataReturnType;
}

const Map = ({ filterDistrict, todayFiltered }: MapProps) => {
  const router = useRouter();

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
  const district = _.find(
    ACTIVATED_DISTRICTS,
    (obj) =>
      parameterize(obj.name) === parameterize(params?.districtName as string)
  );

  if (!district) {
    return {
      notFound: true,
    };
  }

  const date = new Date();
  const data = await careSummary("facility", district.id);
  const filtered = processFacilityDataUpdate(data.results);
  const todayFiltered = _.filter(
    filtered,
    (f) => f.date === toDateString(date)
  );

  return {
    props: {
      data,
      filterDistrict: district,
      filtered,
      todayFiltered,
    },
  };
};
