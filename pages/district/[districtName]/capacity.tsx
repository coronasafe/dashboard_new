import axios from "axios";
import { useRouter } from "next/router";
import { RadialCard } from "../../../components/Charts";
import ContentNav from "../../../components/ContentNav";
import {
  ACTIVATED_DISTRICTS,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
} from "../../../lib/common";
import { CareSummary } from "../../../lib/types";
import { Parameterize } from "../../../utils/parser";

interface CapacityProps {
  districtName: string;
  data: CareSummary;
}

const Capacity: React.FC<CapacityProps> = ({ data }) => {
  const router = useRouter();
  const districtName = router.query.districtName;
  console.log(districtName);
  console.log(data);

  return (
    <div className="2xl:container mx-auto px-4">
      <ContentNav />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 my-5">
        {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => (
          <RadialCard
            count={20}
            current={{ total: 100, used: 50 }}
            previous={{ total: 100, used: 49 }}
            label={k.name}
            key={k.id}
          />
        ))}
        {AVAILABILITY_TYPES_ORDERED.map((k) => (
          <RadialCard
            label={AVAILABILITY_TYPES[k]}
            count={20}
            current={{ total: 100, used: 50 }}
            previous={{ total: 100, used: 49 }}
            key={k}
          />
        ))}
      </div>
    </div>
  );
};

type Params = {
  params: {
    districtName: string;
  };
};

export const getStaticProps = async ({ params }: Params) => {
  const districtId = ACTIVATED_DISTRICTS.find(
    (e) => Parameterize(e.name) === Parameterize(params?.districtName)
  )?.id;

  let faciltyData = {};

  if (districtId) {
    const res = await axios.get<CareSummary>(
      "https://careapi.coronasafe.in/api/v1/facility_summary?district=" +
        districtId
    );
    faciltyData = res.data;
  }

  return {
    props: {
      data: faciltyData,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  // Get the paths we want to pre-render based on posts
  const paths = ACTIVATED_DISTRICTS.map((district) => ({
    params: { districtName: Parameterize(district.name) },
  }));

  return { paths, fallback: "blocking" };
}
export default Capacity;
