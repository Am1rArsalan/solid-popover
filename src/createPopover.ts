import { Constants } from "./constants";
import { CreatePopover, PositionPopover, PositionPopoverProps } from "./types";
import { createContainer, getNewPopoverRect } from "./utils";

export function createPopover({
  containerClassName,
  onPositionPopover,
  childRef,
  parentElement,
  boundaryElement,
  boundaryInset,
  padding,
  positions,
  align,
  reposition,
}: CreatePopover) {
  const popoverRef = createContainer(
    {
      position: "fixed",
      overflow: "visible",
      top: "0px",
      left: "0px",
    },
    containerClassName
  );
  const scoutRef = createContainer(
    {
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "0px",
      height: "0px",
      visibility: "hidden",
    },
    "solid-tiny-popover-scout"
  );

  function positionPopover({
    contentLocation,
    isOpen = false,
    positionIndex = 0,
    parentRect = parentElement.getBoundingClientRect() as DOMRect,
    childRect = childRef?.getBoundingClientRect(),
    boundaryRect = boundaryElement === parentElement
      ? parentRect
      : boundaryElement.getBoundingClientRect(),
  }: PositionPopoverProps) {
    let scoutRect = scoutRef?.getBoundingClientRect();
    let popoverRect = popoverRef.getBoundingClientRect();
    console.log("contentLocation", contentLocation);
    if (!childRect || !parentRect || !isOpen) {
      return;
    }

    if (contentLocation) {
      const { top: inputTop, left: inputLeft } =
        typeof contentLocation === "function"
          ? contentLocation({
              childRect,
              popoverRect,
              parentRect,
              boundaryRect,
              padding,
              nudgedTop: 0,
              nudgedLeft: 0,
              boundaryInset,
              violations: Constants.EMPTY_CLIENT_RECT,
              hasViolations: false,
            })
          : contentLocation;
      const left = parentRect.left + inputLeft;
      const top = parentRect.top + inputTop;

      popoverRef.style.transform = `translate(${left - scoutRect.left}px, ${
        top - scoutRect.top
      }px)`;

      onPositionPopover({
        childRect,
        popoverRect,
        parentRect,
        boundaryRect,
        padding,
        nudgedTop: 0,
        nudgedLeft: 0,
        boundaryInset,
        violations: Constants.EMPTY_CLIENT_RECT,
        hasViolations: false,
      });

      return;
    }

    const isExhausted = positionIndex === positions.length;
    const position = isExhausted ? positions[0] : positions[positionIndex];

    const { rect, boundaryViolation } = getNewPopoverRect(
      {
        childRect,
        popoverRect,
        boundaryRect,
        position,
        align,
        padding,
        reposition,
      },
      boundaryInset
    );
    // end of positionPopover
  }

  return {
    popoverRef,
    scoutRef,
    positionPopover,
  };
}
