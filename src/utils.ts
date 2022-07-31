export function createContainer(
  containerStyle?: Partial<CSSStyleDeclaration>,
  containerClassName?: string
) {
  const container = document.createElement("div");
  if (containerClassName) container.className = containerClassName;
  Object.assign(container.style, containerStyle);
  return container;
}

export function rectsAreEqual(rectA: DOMRect, rectB: DOMRect) {
  return (
    rectA === rectB ||
    (rectA?.bottom === rectB?.bottom &&
      rectA?.height === rectB?.height &&
      rectA?.left === rectB?.left &&
      rectA?.right === rectB?.right &&
      rectA?.top === rectB?.top &&
      rectA?.width === rectB?.width)
  );
}
