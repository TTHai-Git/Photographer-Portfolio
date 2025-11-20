export const scrollToElement = (id, offset = 80) => {
  const element = document.getElementById(id);
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;

  window.scrollTo({
    top: absoluteTop - offset,
    behavior: "smooth",
  });
};
