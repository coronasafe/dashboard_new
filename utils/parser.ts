import { ACTIVATED_DISTRICTS } from "../lib/common";
import { FacilityData, Inventory } from "../lib/types";

export const Parameterize = (word: string | undefined) => {
  if (!word) return "";
  return word.toLowerCase().replace(/ /g, "_");
};

export const Humanize = (word: string) => {
  return Capitalize(word.toLowerCase().replace(/_/g, " "));
};

export const Capitalize = (text: string) => {
  return text.replace(/\w\S*/g, (word) => {
    return word.replace(/^\w/, (c) => c.toUpperCase());
  });
};

export const GetDistrictName = (district: string | string[] | undefined) => {
  const theDistrict =
    district == undefined ? ACTIVATED_DISTRICTS[0].name : district;

  return Parameterize(theDistrict as string);
};

export const ToDateString = (date: Date) => {
  return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
    -2
  )}-${`0${date.getDate()}`.slice(-2)}`;
};

export const InventoryTimeToEmpty = (inventoryItem: Inventory) =>
  inventoryItem &&
  inventoryItem.stock &&
  inventoryItem.burn_rate &&
  inventoryItem.burn_rate !== undefined &&
  Math.round(inventoryItem.burn_rate ?? 0) !== 0
    ? (inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2)
    : -1;

interface CapacityBedData {
  used: number;
  total: number;
  vacant: number;
}

export const GetCapacityBedData = (
  ids: Array<number>,
  facility: FacilityData
): CapacityBedData[] => {
  return ids.map((i) => {
    if (facility.capacity) {
      const total =
        Number.parseInt(facility.capacity[i]?.total_capacity as string) || 0;
      const used =
        Number.parseInt(facility.capacity[i]?.current_capacity as string) || 0;
      const vacant = total - used;

      return {
        used,
        total,
        vacant,
      };
    }

    return {
      used: 0,
      total: 0,
      vacant: 0,
    };
  });
};

export const GetFinalTotalData = (
  covid: CapacityBedData[],
  nonCovid: CapacityBedData[]
) => {
  return covid.map((val, idx) => {
    const used = val.used + nonCovid[idx].used;
    const total = val.total + nonCovid[idx].total;
    const vacant = val.vacant + nonCovid[idx].vacant;

    return { used, total, vacant };
  });
};
