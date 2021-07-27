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
import { FacilitySummary } from "../../../lib/types";
import { GetDistrictName, Parameterize } from "../../../utils/parser";

interface CapacityProps {
  data: FacilitySummary;
}

const Capacity: React.FC<CapacityProps> = ({ data }) => {
  const router = useRouter();
  console.log({ data });
  const districtName = GetDistrictName(router.query.districtName);

  return (
    <div className="2xl:container mx-auto px-4">
      <ContentNav />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

export default Capacity;

export async function getStaticProps() {
  const res = await axios.get<FacilitySummary>(
    "https://careapi.coronasafe.in/api/v1/facility_summary?district=7"
  );

  return {
    props: {
      data: {},
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  // Get the paths we want to pre-render based on posts
  const paths = ACTIVATED_DISTRICTS.map((district) => ({
    params: { districtName: Parameterize(district.name) },
  }));

  return { paths, fallback: "blocking" };
}
