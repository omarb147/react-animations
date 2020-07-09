export const isHTMLElement = (value: Element): value is HTMLElement => {
  return (value as HTMLElement).style !== undefined;
};
