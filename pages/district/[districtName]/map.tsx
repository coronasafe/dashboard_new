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
import {
  getNDateAfter,
  getNDateBefore,
  parameterize,
  toDateString,
} from "../../../utils/parser";

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
  const today = new Date();
  const start_date = toDateString(getNDateBefore(today, 1));
  const end_date = toDateString(getNDateAfter(today, 1));
  const limit = 2000;

  const data = await careSummary(
    "facility",
    district.id,
    limit,
    start_date,
    end_date
  );
  const filtered = processFacilityDataUpdate(data.results);
  const todayFiltered = _.filter(
    filtered,
    (f) => f.date === toDateString(today)
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
