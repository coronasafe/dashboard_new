export const parameterize = (word: string) => {
  return word.toLowerCase().replace(/ /g, "_");
};

export const Humanize = (word: string) => {
  return Capitalize(word.replaceAll("_", " "));
};

export const Capitalize = (text: string) => {
  return text.replace(/\w\S*/g, (word) => {
    return word.replace(/^\w/, (c) => c.toUpperCase());
  });
};
