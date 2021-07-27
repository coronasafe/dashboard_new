import { useRouter } from "next/router";
import Loader from "../../../lib/assets/icons/LoaderIcon";

export interface DistrictPageProps {}

const DistrictPage: React.FC<DistrictPageProps> = () => {
  const router = useRouter();

  const { districtName } = router.query;

  if (districtName) router.push(`/district/${districtName}/capacity`);

  return (
    <div className="h-60 flex flex-col justify-center items-center">
      <Loader />
    </div>
  );
};

export default DistrictPage;
