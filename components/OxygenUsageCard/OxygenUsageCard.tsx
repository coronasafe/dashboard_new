import { Card, CardBody } from "@windmill/react-ui";
import React from "react";

interface ValueCardProps {
  icon: JSX.Element;
  label: string;
  value: number;
  unit: string;
}

const ValueCard: React.FC<ValueCardProps> = ({
  icon: Icon,
  label,
  unit,
  value,
}) => (
  <div className="flex items-center lg:justify-center">
    {Icon}
    <div className="dark:text-white">
      <div>
        <p className="text-gray-400">{label}</p>
        <h1 className="text-4xl my-2">{value}</h1>
        <h2 className="text-gray-400">{unit}</h2>
      </div>
    </div>
  </div>
);

interface OxygenUsageCardProps {
  data: ValueCardProps[];
}

export const OxygenUsageCard: React.FC<OxygenUsageCardProps> = ({ data }) => {
  return (
    <Card className="my-2 p-2">
      <CardBody>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 justify-center">
          {data.map((props, index) => (
            <ValueCard {...props} key={index} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
