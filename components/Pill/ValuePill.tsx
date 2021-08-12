import React from "react";
import { animated, config, useSpring } from "react-spring";

interface ValuePillProps {
  value: number;
  title?: string;
}

export const ValuePill: React.FC<ValuePillProps> = ({ title, value = 0 }) => {
  const { v } = useSpring({
    from: {
      v: 0,
    },
    to: {
      v: value,
    },
    delay: 0,
    config: config.slow,
  });

  return (
    <div className="flex items-center justify-between bg-white dark:text-gray-200 dark:bg-black rounded-lg shadow-xs">
      <span className="block mx-3 text-xs font-medium xl:text-base py-1">
        {title}
      </span>
      <div className="flex items-center text-xs font-medium bg-green-500 rounded-md xl:text-base m-1">
        <animated.span className="inline-flex items-center justify-center align-bottom px-3 py-1 text-white leading-5 rounded-md shadow-xs">
          {v.to((x) => Math.round(x))}
        </animated.span>
      </div>
    </div>
  );
};
