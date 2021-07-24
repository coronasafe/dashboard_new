import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";
import { GetDistrictName } from "../../../utils/parser";

const Tests = () => {
  const router = useRouter();

  const districtName = GetDistrictName(router.query.districtName);

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
    </div>
  );
};

export default Tests;
