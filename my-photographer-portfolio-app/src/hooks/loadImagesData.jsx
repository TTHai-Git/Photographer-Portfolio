export const loadImagesByDir = (context) => {
    let images = {};
    context.keys().forEach((key) => {
      const imageKey = key.replace("./", "");
      images[imageKey] = context(key);
    });
    return images;
}