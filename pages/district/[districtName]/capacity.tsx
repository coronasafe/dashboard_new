import { useRouter } from "next/router";
import { RadialCard } from "../../../components/Charts";
import ContentNav from "../../../components/ContentNav";
import { GetDistrictName } from "../../../utils/parser";

const Capacity = () => {
  const router = useRouter();

  const districtName = GetDistrictName(router.query.districtName);

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
      <div className="w-1/2 sm:w-1/2 md:w-1/4 lg:w-1/5">
        <RadialCard
          count={20}
          current={{ total: 100, used: 50 }}
          label="Non-Covid Oxygen Beds"
          previous={{ total: 100, used: 49 }}
          className="my-4"
        />
      </div>
    </div>
  );
};

export default Capacity;
