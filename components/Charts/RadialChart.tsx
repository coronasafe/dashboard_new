import React from "react";
import clsx from "classnames";
import { ArrowDown, ArrowUp } from "react-feather";
import { animated, config, useSpring } from "react-spring";

type usedTotal = {
  used: number;
  total: number;
};

interface RadialCardProps {
  label: string;
  count: number;
  current: usedTotal;
  previous: usedTotal;
  className?: string;
  reverseIndicator?: boolean;
}

export const RadialCard: React.FC<RadialCardProps> = ({
  label,
  count,
  current,
  previous,
  className,
  reverseIndicator,
}) => {
  const current_used = current.total
    ? Math.round((current.used / current.total) * 100)
    : 0;
  const previous_used = previous.total
    ? Math.round((previous.used / previous.total) * 100)
    : 0;
  const diff = current_used - previous_used;

  const _p = current.total
    ? Math.round((current.used / current.total) * 100)
    : 0;

  const isPositive = (value: number) =>
    !Number.isNaN(value) && value !== 0 && value > 0;

  const { used, total, progress, innerProgress } = useSpring({
    from: { used: 0, total: 0, progress: "0, 100", innerProgress: 0 },
    to: {
      used: current.used,
      total: current.total,
      progress: `${Number.isNaN(_p) ? 0 : _p}, 100`,
      innerProgress: Number.isNaN(_p) ? 0 : _p,
    },
    delay: 0,
    config: config.slow,
  });

  const circlePath = `M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`;

  return (
    <div
      className={`bg-white shadow-sm dark:shadow-none dark:bg-black rounded-xl ${className} flex flex-col justify-between`}
      style={{ padding: "clamp(0.75rem,5vw,1.5rem)" }}
    >
      <p className="dark:text-gray-100 text-gray-900 font-medium text-xl mb-2 md:mb-4 text-center">
        {label}
      </p>

      <div className="flex items-center justify-center">
        <div className="relative flex content-center justify-center m-2 w-4/5">
          <svg viewBox="0 0 36 36" className="w-full">
            <path
              className="text-gray-200 dark:text-gray-800 stroke-current stroke-2"
              fill="none"
              d={circlePath}
            />
            <animated.path
              className="text-primary-500 stroke-current stroke-2"
              fill="none"
              strokeDasharray={progress}
              d={circlePath}
            />
          </svg>
          <div className="absolute inline-flex flex-col items-center justify-center self-center w-3/5 text-center text-sm xl:text-lg">
            <div className="space-x-1">
              <animated.span className="text-center text-4xl dark:text-gray-200 text-gray-700 font-semibold">
                {innerProgress.to((x: number) => `${Math.round(x) || 0}%`)}
              </animated.span>
            </div>
            {
              <div className="mt-2 text-center">
                <span
                  className={clsx("text-xl font-medium", {
                    "text-green-600 dark:text-green-400": reverseIndicator
                      ? !isPositive(diff)
                      : isPositive(diff),
                    "text-red-600 dark:text-red-500": reverseIndicator
                      ? isPositive(diff)
                      : !isPositive(diff),
                  })}
                >
                  {diff ? (
                    isPositive(diff) ? (
                      <ArrowUp className="inline h-full" />
                    ) : (
                      <ArrowDown className="inline h-full" />
                    )
                  ) : null}
                  {Math.abs(diff)}%
                </span>
              </div>
            }
          </div>
        </div>
      </div>
      <div className="flex text-center mt-4">
        <div className="w-1/2">
          <p className="dark:text-gray-400 text-gray-500 font-medium text-lg xl:text-xl">
            Used
            <animated.span className="ml-2 dark:text-gray-200 text-gray-700 font-semibold text-lg  xl:text-xl">
              {used.to((x: number) => Math.round(x))}
            </animated.span>
          </p>
        </div>
        <div className="w-1/2">
          <p className="dark:text-gray-400 text-gray-500 font-medium text-lg xl:text-xl">
            Total
            <animated.span className="ml-2 dark:text-gray-200 text-gray-700 text-lg font-semibold xl:text-xl">
              {total.to((x: number) => Math.round(x))}
            </animated.span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadialCard;
