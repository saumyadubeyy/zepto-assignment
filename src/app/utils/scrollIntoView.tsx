export const scrollIntoView = (container: HTMLDivElement | null, highlightedElement: HTMLElement | null) => {
    if (container && highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
    }
}