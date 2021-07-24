import { useRouter } from "next/router";
import PageTitle from "../../../components/Typography/PageTitle";
import { Humanize } from "../../../utils/parser";

const LSG = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <PageTitle
        text={"LSG - " + Humanize(router.query.districtName as string)}
      ></PageTitle>
    </div>
  );
};

export default LSG;
