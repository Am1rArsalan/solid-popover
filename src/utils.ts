import { GetNewPopoverRectProps, PopoverAlign, PopoverPosition } from "./types";

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

export function popoverRectForPosition(
  position: PopoverPosition,
  childRect: DOMRect,
  popoverRect: DOMRect,
  padding: number,
  align: PopoverAlign
) {
  const targetMidX = childRect.left + childRect.width / 2;
  const targetMidY = childRect.top + childRect.height / 2;
  const { width, height } = popoverRect;
  let top: number;
  let left: number;

  switch (position) {
    case "left":
      top = targetMidY - height / 2;
      left = childRect.left - padding - width;
      if (align === "start") {
        top = childRect.top;
      }
      if (align === "end") {
        top = childRect.bottom - height;
      }
      break;
    case "bottom":
      top = childRect.bottom + padding;
      left = targetMidX - width / 2;
      if (align === "start") {
        left = childRect.left;
      }
      if (align === "end") {
        left = childRect.right - width;
      }
      break;
    case "right":
      top = targetMidY - height / 2;
      left = childRect.right + padding;
      if (align === "start") {
        top = childRect.top;
      }
      if (align === "end") {
        top = childRect.bottom - height;
      }
      break;
    default:
      top = childRect.top - height - padding;
      left = targetMidX - width / 2;
      if (align === "start") {
        left = childRect.left;
      }
      if (align === "end") {
        left = childRect.right - width;
      }
      break;
  }

  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
}

export function getNewPopoverRect(
  {
    position,
    align,
    childRect,
    popoverRect,
    boundaryRect,
    padding,
    reposition,
  }: GetNewPopoverRectProps,
  boundaryInset: number
) {
  const rect = popoverRectForPosition(
    position,
    childRect,
    popoverRect,
    padding,
    align
  );

  const boundaryViolation =
    reposition &&
    ((position === "top" && rect.top < boundaryRect.top + boundaryInset) ||
      (position === "left" && rect.left < boundaryRect.left + boundaryInset) ||
      (position === "right" &&
        rect.right > boundaryRect.right - boundaryInset) ||
      (position === "bottom" &&
        rect.bottom > boundaryRect.bottom - boundaryInset));

  return {
    rect,
    boundaryViolation,
  } as const;
}

export const getNudgedPopoverRect = (
  popoverRect: DOMRect,
  boundaryRect: DOMRect,
  boundaryInset: number
) => {
  const topBoundary = boundaryRect.top + boundaryInset;
  const leftBoundary = boundaryRect.left + boundaryInset;
  const rightBoundary = boundaryRect.right - boundaryInset;
  const bottomBoundary = boundaryRect.bottom - boundaryInset;

  let top = popoverRect.top < topBoundary ? topBoundary : popoverRect.top;
  top =
    top + popoverRect.height > bottomBoundary
      ? bottomBoundary - popoverRect.height
      : top;
  let left = popoverRect.left < leftBoundary ? leftBoundary : popoverRect.left;
  left =
    left + popoverRect.width > rightBoundary
      ? rightBoundary - popoverRect.width
      : left;

  return {
    top,
    left,
    width: popoverRect.width,
    height: popoverRect.height,
    right: left + popoverRect.width,
    bottom: top + popoverRect.height,
  };
};
