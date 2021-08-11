import { Card, CardBody } from "@windmill/react-ui";
import React from "react";
import { ArrowDown, ArrowUp } from "react-feather";
import { animated, config, useSpring } from "react-spring";

export interface PatientSummaryCardProps {
  title: string;
  value: number;
  delta: number;
}

const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  value,
  title,
  delta,
}) => {
  const { _value, _delta } = useSpring({
    from: { _value: 0, _delta: 0 },
    to: { _value: value, _delta: delta },
    config: config.slow,
  });

  const isDeltaPositive = _delta.get() > 0;

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl ring-2 ring-gray-200 dark:ring-gray-800 px-3 py-1">
      <CardBody className="flex flex-col">
        {/* Card Title */}
        <p className="mb-1 md:text-base text-sm dark:text-gray-400 text-gray-600 font-medium">
          {title}
        </p>
        <div className="flex items-center my-2">
          {/* Animated Base Value */}
          <animated.p className="text-2xl md:text-4xl font-bold dark:text-gray-200 text-gray-700">
            {_value.to((x) => Math.round(x))}
          </animated.p>
          <div className="flex items-start ml-2 text-green-600 dark:text-green-400">
            {/* Arrow Indicator */}
            {isDeltaPositive && <ArrowUp strokeWidth="1.5px" />}
            {!isDeltaPositive && <ArrowDown strokeWidth="1.5px" />}
            {/* Animated Delta Value */}
            <animated.span className="text-base">
              {_delta.to((y) => Math.abs(Math.round(y)))}
            </animated.span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PatientSummaryCard;
