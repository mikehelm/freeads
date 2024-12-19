export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    // Add a small delay to let any routing complete first
    setTimeout(() => {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 100);
  }
}