import React from "react";
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
}

export const RadialCard: React.FC<RadialCardProps> = ({
  label,
  count,
  current,
  previous,
}) => {
  const current_used = Math.round((current.used / current.total) * 100);
  const previous_used = Math.round((previous.used / previous.total) * 100);
  const diff = current_used - previous_used;

  const _p = Math.round((current.used / current.total) * 100);

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
      className="bg-white shadow-sm dark:shadow-none dark:bg-black rounded-xl"
      style={{ padding: "clamp(1rem,5vw,2rem)" }}
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
                {innerProgress.to((x) => `${Math.round(x)}%`)}
              </animated.span>
            </div>
            <div className="mt-2 text-center">
              {count > 0 &&
                !Number.isNaN(diff) &&
                diff !== 0 &&
                (diff > 0 ? (
                  <span className="text-red-600 dark:text-red-500 text-xl font-medium">
                    <ArrowUp className="inline h-full" />
                    {Math.abs(diff)}%
                  </span>
                ) : (
                  <span className="text-green-600 dark:text-green-400 text-xl font-medium">
                    <ArrowDown className="inline h-full" />
                    {Math.abs(diff)}%
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex text-center mt-4">
        <div className="w-1/2">
          <p className="dark:text-gray-400 text-gray-500 font-medium text-sm xl:text-xl">
            Used
            <animated.span className="ml-2 dark:text-gray-200 text-gray-700 font-semibold text-xs  xl:text-lg">
              {used.to((x) => Math.round(x))}
            </animated.span>
          </p>
        </div>
        <div className="w-1/2">
          <p className="dark:text-gray-400 text-gray-500 font-medium text-xs xl:text-lg">
            Total
            <animated.span className="ml-2 dark:text-gray-200 text-gray-700 text-xs font-semibold xl:text-lg">
              {total.to((x) => Math.round(x))}
            </animated.span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadialCard;
