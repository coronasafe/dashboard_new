import { useRouter } from "next/router";
import ContentNav from "../../../components/ContentNav";
import { getDistrictName } from "../../../utils/parser";

const Oxygen = () => {
  const router = useRouter();

  const districtName = getDistrictName(router.query.districtName?.toString());

  return (
    <div className="container mx-auto px-4">
      <ContentNav />
    </div>
  );
};

export default Oxygen;
