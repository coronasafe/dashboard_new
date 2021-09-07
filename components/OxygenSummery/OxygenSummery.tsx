import _ from "lodash";
import React from "react";
import { getOxygenSummeryConfig } from "../../lib/common/processor/oxygenDataProcessor";
import { Inventory } from "../../lib/types";
import { OxygenUsageCard } from "../OxygenUsageCard";

interface OxygenSummeryProps {
  data: Inventory[];
}

export const OxygenSummery: React.FC<OxygenSummeryProps> = ({ data }) => {
  const configs = getOxygenSummeryConfig(data);
  return (
    <>
      {configs.map((config, index) => (
        <OxygenUsageCard key={index} data={config} />
      ))}
    </>
  );
};
