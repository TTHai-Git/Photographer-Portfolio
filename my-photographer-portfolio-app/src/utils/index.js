export const importAllImagesByDir = (requireContext) => {
  let images = {};
  requireContext.keys().forEach((item) => {
    images[item.replace("./", "")] = requireContext(item);
  });
  return images;
};
