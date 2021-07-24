import { ACTIVATED_DISTRICTS } from "../lib/common";

export const Parameterize = (word: string) => {
  return word.toLowerCase().replace(/ /g, "_");
};

export const Humanize = (word: string) => {
  return Capitalize(word.replace(/_/g, " "));
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
