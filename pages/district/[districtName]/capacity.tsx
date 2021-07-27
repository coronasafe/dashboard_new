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
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetDistrictName, Parameterize } from "../../../utils/parser";

interface CapacityProps {
  data: CareSummary;
}

const Capacity: React.FC<CapacityProps> = ({ data }) => {
  const router = useRouter();
  const districtName = GetDistrictName(router.query.districtName);

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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const theDistrict = ACTIVATED_DISTRICTS.find(
    (district) =>
      Parameterize(district.name) ===
      Parameterize(context?.params?.districtName as string)
  );

  const res = await axios.get<CareSummary>(
    "https://careapi.coronasafe.in/api/v1/facility_summary",
    {
      params: {
        district: theDistrict?.id,
      },
    }
  );

  if (theDistrict == undefined || res.data.count <= 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: res.data,
    },
  };
};

export default Capacity;
