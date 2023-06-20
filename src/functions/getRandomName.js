import { uniqueNamesGenerator, names } from "unique-names-generator";

const customConfig = {
  dictionaries: [names],
  separator: " ",
  length: 1,
};

export const getRandomName = () => {
  return uniqueNamesGenerator(customConfig);
};
