import { Card, CardBody } from "@windmill/react-ui";
import clsx from "classnames";
import React from "react";
import { ArrowDown, ArrowUp, ChevronsUp } from "react-feather";
import { animated, config, useSpring } from "react-spring";

export function InfoCard({ title = "", value = 0, delta = 0, small = false }) {
  const { _value, _delta } = useSpring({
    from: { _value: 0, _delta: 0 },
    to: {
      _value: value,
      _delta: delta,
    },
    delay: 0,
    config: config.slow,
  });

  return (
    <Card className="bg-white dark:bg-black rounded-xl md:p-3">
      <CardBody className="flex flex-col">
        <div>
          <p
            className={clsx(
              small ? "mb-1 text-xs md:text-base" : "mb-3 text-sm md:text-lg",
              "dark:text-gray-400 text-gray-600 font-medium"
            )}
          >
            {title}
          </p>
          <div className="flex">
            <animated.p
              className={clsx(
                small ? "text-base" : "text-4xl",
                "dark:text-gray-200 text-gray-700"
              )}
            >
              {_value.to((x) => Math.round(x))}
            </animated.p>
            {delta !== null && (
              <div
                className={clsx(
                  "flex items-start ml-2",
                  _delta.get() > 0
                    ? "text-green-400 dark:text-green-500"
                    : "text-red-500"
                )}
              >
                {_delta.get() > 0 ? (
                  <ArrowUp strokeWidth="1.5px" />
                ) : (
                  <ArrowDown strokeWidth="1.5px" />
                )}

                <animated.span
                  className={clsx(small ? "text-sm" : "text-base")}
                >
                  {_delta.to((y) => {
                    const x = Math.abs(Math.round(y));
                    return x;
                  })}
                </animated.span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
