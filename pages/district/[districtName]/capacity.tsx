import { useRouter } from "next/router";
import PageTitle from "../../../components/Typography/PageTitle";
import { Humanize } from "../../../utils/parser";

const Capacity = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <PageTitle
        text={"Capacity - " + Humanize(router.query.districtName as string)}
      ></PageTitle>
    </div>
  );
};

export default Capacity;
