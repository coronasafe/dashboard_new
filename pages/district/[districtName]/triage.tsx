import { useRouter } from "next/router";
import { Humanize } from "../../../utils/parser";
import PageTitle from "../../../components/Typography/PageTitle";

const Triage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <PageTitle
        text={"Triage - " + Humanize(router.query.districtName as string)}
      ></PageTitle>
    </div>
  );
};

export default Triage;
