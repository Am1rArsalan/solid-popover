import { Constants } from "./constants";
import {
  BoundaryViolations,
  CreatePopover,
  PositionPopoverProps,
} from "./types";
import {
  createContainer,
  getNewPopoverRect,
  getNudgedPopoverRect,
} from "./utils";

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

    if (boundaryViolation && reposition && !isExhausted) {
      positionPopover({
        positionIndex: positionIndex + 1,
        childRect,
        popoverRect,
        parentRect,
        boundaryRect,
      });
      return;
    }

    const { top, left, width, height } = rect;
    const shouldNudge = reposition && !isExhausted;
    const { left: nudgedLeft, top: nudgedTop } = getNudgedPopoverRect(
      rect,
      boundaryRect,
      boundaryInset
    );

    let finalTop = top;
    let finalLeft = left;

    if (shouldNudge) {
      finalTop = nudgedTop;
      finalLeft = nudgedLeft;
    }

    popoverRef.style.transform = `translate(${finalLeft - scoutRect.left}px, ${
      finalTop - scoutRect.top
    }px)`;

    const potentialViolations: BoundaryViolations = {
      top: boundaryRect.top + boundaryInset - finalTop,
      left: boundaryRect.left + boundaryInset - finalLeft,
      right: finalLeft + width - boundaryRect.right + boundaryInset,
      bottom: finalTop + height - boundaryRect.bottom + boundaryInset,
    };

    onPositionPopover({
      childRect,
      popoverRect: {
        top: finalTop,
        left: finalLeft,
        width,
        height,
        right: finalLeft + width,
        bottom: finalTop + height,
      },
      parentRect,
      boundaryRect,
      position,
      align,
      padding,
      nudgedTop: nudgedTop - top,
      nudgedLeft: nudgedLeft - left,
      boundaryInset,
      violations: {
        top: potentialViolations.top <= 0 ? 0 : potentialViolations.top,
        left: potentialViolations.left <= 0 ? 0 : potentialViolations.left,
        right: potentialViolations.right <= 0 ? 0 : potentialViolations.right,
        bottom:
          potentialViolations.bottom <= 0 ? 0 : potentialViolations.bottom,
      },
      hasViolations:
        potentialViolations.top > 0 ||
        potentialViolations.left > 0 ||
        potentialViolations.right > 0 ||
        potentialViolations.bottom > 0,
    });
  }

  return {
    popoverRef,
    scoutRef,
    positionPopover,
  };
}
