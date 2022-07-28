export function createContainer(
  containerStyle?: Partial<CSSStyleDeclaration>,
  containerClassName?: string
) {
  const container = document.createElement("div");
  if (containerClassName) container.className = containerClassName;
  Object.assign(container.style, containerStyle);
  return container;
}
