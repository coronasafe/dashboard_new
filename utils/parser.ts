import dayjs from "dayjs";
import { ACTIVATED_DISTRICTS } from "../lib/common";
import { FacilityData, Inventory } from "../lib/types";

export const parameterize = (word: string | undefined) => {
  if (!word) return "";
  return word.toLowerCase().replace(/ /g, "_");
};

export const humanize = (word: string) => {
  return capitalize(word.toLowerCase().replace(/_/g, " "));
};

export const capitalize = (text: string) => {
  return text.replace(/\w\S*/g, (word) => {
    return word.replace(/^\w/, (c) => c.toUpperCase());
  });
};

export const getDistrictName = (district: string | undefined) => {
  return parameterize(district || ACTIVATED_DISTRICTS[0].name);
};

export const getDistrict = (name: string | undefined) => {
  const districtName = parameterize(name);
  return ACTIVATED_DISTRICTS.find(
    ({ name }) => parameterize(name) === districtName
  );
};

export const toDateString = (date: Date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const getDaysBefore = (n: number) => {
  return dayjs().subtract(n, "days").toDate();
};

export const getDaysAfter = (n: number) => {
  return dayjs().add(n, "days").toDate();
};

export const InventoryTimeToEmpty = (inventoryItem?: Inventory) =>
  inventoryItem &&
  inventoryItem.stock &&
  inventoryItem.burn_rate &&
  inventoryItem.burn_rate !== undefined &&
  Math.round(inventoryItem.burn_rate ?? 0) !== 0
    ? Number((inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2))
    : -1;

export interface CapacityBedData {
  used: number;
  total: number;
  vacant: number;
}

export const getCapacityBedData = (
  ids: (string | number)[],
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

export const getFinalTotalData = (
  covid: CapacityBedData[],
  nonCovid: CapacityBedData[]
): CapacityBedData[] => {
  return covid.map((val, idx) => {
    const used = val.used + nonCovid[idx].used;
    const total = val.total + nonCovid[idx].total;
    const vacant = val.vacant + nonCovid[idx].vacant;

    return { used, total, vacant };
  });
};
