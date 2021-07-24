export const parameterize = (word: string) => {
  console.log({ word: word.toLowerCase() });
  return word.toLowerCase().replace(/ /g, "_");
};
