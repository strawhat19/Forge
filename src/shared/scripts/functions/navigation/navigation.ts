export const scrollToElement = (elementQuerySelector: string = `#top`) => {
  const element = document.querySelector(elementQuerySelector);
  if (element) {
    element.scrollIntoView({ behavior: `smooth` });
  }
};