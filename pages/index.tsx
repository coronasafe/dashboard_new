import Link from "next/link";
import { Button } from "@windmill/react-ui";
import { Card, CardBody } from "@windmill/react-ui";
import { parameterize } from "../utils/parser";
import { ACTIVATED_DISTRICTS } from "../config";

export default function Home() {
  return (
    <div className="conainer mx-auto px-4">
      <Card className="m-10">
        <CardBody>
          <h1 className="text-4xl">CoronaSafe</h1>
          {ACTIVATED_DISTRICTS.map((district) => (
            <div key={district.id}>
              <Link href={`/district/${parameterize(district.name)}/capacity`}>
                <Button tag="a" className="mt-4">
                  {district.name}
                </Button>
              </Link>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
