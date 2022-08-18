import { createComponent, Portal, memo, className, insert, effect, style, template } from 'solid-js/web';
import { onMount, onCleanup, createEffect, Show, children } from 'solid-js';
import { createStore } from 'solid-js/store';

function createContainer(containerStyle, containerClassName) {
  const container = document.createElement("div");
  if (containerClassName) container.className = containerClassName;
  Object.assign(container.style, containerStyle);
  return container;
}
function rectsAreEqual(rectA, rectB) {
  return rectA === rectB || rectA?.bottom === rectB?.bottom && rectA?.height === rectB?.height && rectA?.left === rectB?.left && rectA?.right === rectB?.right && rectA?.top === rectB?.top && rectA?.width === rectB?.width;
}
function popoverRectForPosition(position, childRect, popoverRect, spacing, align) {
  const targetMidX = childRect.left + childRect.width / 2;
  const targetMidY = childRect.top + childRect.height / 2;
  const {
    width,
    height
  } = popoverRect;
  let top;
  let left;

  switch (position) {
    case "left":
      top = targetMidY - height / 2;
      left = childRect.left - spacing - width;

      if (align === "start") {
        top = childRect.top;
      }

      if (align === "end") {
        top = childRect.bottom - height;
      }

      break;

    case "bottom":
      top = childRect.bottom + spacing;
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
      left = childRect.right + spacing;

      if (align === "start") {
        top = childRect.top;
      }

      if (align === "end") {
        top = childRect.bottom - height;
      }

      break;

    default:
      top = childRect.top - height - spacing;
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
    bottom: top + height
  };
}
function getNewPopoverRect({
  position,
  align,
  childRect,
  popoverRect,
  boundaryRect,
  spacing,
  reposition
}, boundaryInset) {
  const rect = popoverRectForPosition(position, childRect, popoverRect, spacing, align);
  const boundaryViolation = reposition && (position === "top" && rect.top < boundaryRect.top + boundaryInset || position === "left" && rect.left < boundaryRect.left + boundaryInset || position === "right" && rect.right > boundaryRect.right - boundaryInset || position === "bottom" && rect.bottom > boundaryRect.bottom - boundaryInset);
  return {
    rect,
    boundaryViolation
  };
}
const getNudgedPopoverRect = (popoverRect, boundaryRect, boundaryInset) => {
  const topBoundary = boundaryRect.top + boundaryInset;
  const leftBoundary = boundaryRect.left + boundaryInset;
  const rightBoundary = boundaryRect.right - boundaryInset;
  const bottomBoundary = boundaryRect.bottom - boundaryInset;
  let top = popoverRect.top < topBoundary ? topBoundary : popoverRect.top;
  top = top + popoverRect.height > bottomBoundary ? bottomBoundary - popoverRect.height : top;
  let left = popoverRect.left < leftBoundary ? leftBoundary : popoverRect.left;
  left = left + popoverRect.width > rightBoundary ? rightBoundary - popoverRect.width : left;
  return {
    top,
    left,
    width: popoverRect.width,
    height: popoverRect.height,
    right: left + popoverRect.width,
    bottom: top + popoverRect.height
  };
};

function PopoverPortal(props) {
  onMount(() => {
    props.container.appendChild(props.element);
    props.container.appendChild(props.scoutElement);
  });
  onCleanup(() => {
    props.container.removeChild(props.element);
    props.container.removeChild(props.scoutElement);
  });
  return createComponent(Portal, {
    get mount() {
      return props.element;
    },

    get children() {
      return props.children;
    }

  });
}

const Constants = {
  DEFAULT_ALIGN: "center",
  DEFAULT_POSITIONS: ["top", "left", "right", "bottom"],
  EMPTY_CLIENT_RECT: {
    top: 0,
    left: 0,
    bottom: 0,
    height: 0,
    right: 0,
    width: 0
  }
};

function Popover(props) {
  let childRef; // previous popover state...
  let prevPositions;
  let prevContentLocation;
  let prevReposition = props.reposition;
  const [popoverState, setPopoverState] = createStore({
    align: props.align,
    nudgedLeft: 0,
    nudgedTop: 0,
    position: props.positions.length > 0 ? props.positions[0] : Constants.DEFAULT_POSITIONS[0],
    spacing: props.spacing,
    childRect: Constants.EMPTY_CLIENT_RECT,
    popoverRect: Constants.EMPTY_CLIENT_RECT,
    parentRect: Constants.EMPTY_CLIENT_RECT,
    boundaryRect: Constants.EMPTY_CLIENT_RECT,
    boundaryInset: props.boundaryInset,
    violations: Constants.EMPTY_CLIENT_RECT,
    hasViolations: false
  });
  const popoverRef = createContainer({
    position: "fixed",
    overflow: "visible",
    top: "0px",
    left: "0px"
  }, props.containerClassName ? props.containerClassName : "solid-popover");
  const scoutRef = createContainer({
    position: "fixed",
    top: "0px",
    left: "0px",
    width: "0px",
    height: "0px",
    visibility: "hidden"
  }, "solid-tiny-popover-scout");

  function positionPopover({
    contentLocation,
    positionIndex = 0,
    parentRect = props.parentElement.getBoundingClientRect(),
    childRect = childRef?.getBoundingClientRect(),
    boundaryRect = props.boundaryElement === props.parentElement ? parentRect : props.boundaryElement.getBoundingClientRect()
  }) {
    let scoutRect = scoutRef?.getBoundingClientRect();
    let popoverRect = popoverRef.getBoundingClientRect();

    if (!childRect || !parentRect || !props.isOpen) {
      return;
    }

    if (contentLocation) {
      const {
        top: inputTop,
        left: inputLeft
      } = typeof contentLocation === "function" ? contentLocation({
        childRect,
        popoverRect,
        parentRect,
        boundaryRect,
        spacing: props.spacing,
        nudgedTop: 0,
        nudgedLeft: 0,
        boundaryInset: props.boundaryInset,
        violations: Constants.EMPTY_CLIENT_RECT,
        hasViolations: false
      }) : contentLocation;
      const left = parentRect.left + inputLeft;
      const top = parentRect.top + inputTop;
      popoverRef.style.transform = `translate(${left - scoutRect.left}px, ${top - scoutRect.top}px)`;
      setPopoverState({
        childRect,
        popoverRect,
        parentRect,
        boundaryRect,
        spacing: props.spacing,
        nudgedTop: 0,
        nudgedLeft: 0,
        boundaryInset: props.boundaryInset,
        violations: Constants.EMPTY_CLIENT_RECT,
        hasViolations: false
      });
      return;
    }

    const isExhausted = positionIndex === props.positions.length;
    const position = isExhausted ? props.positions[0] : props.positions[positionIndex];
    const {
      rect,
      boundaryViolation
    } = getNewPopoverRect({
      childRect,
      popoverRect,
      boundaryRect,
      position,
      align: props.align,
      spacing: props.spacing,
      reposition: props.reposition
    }, props.boundaryInset);

    if (boundaryViolation && props.reposition && !isExhausted) {
      positionPopover({
        positionIndex: positionIndex + 1,
        childRect,
        popoverRect,
        parentRect,
        boundaryRect
      });
      return;
    }

    const {
      top,
      left,
      width,
      height
    } = rect;
    const shouldNudge = props.reposition && !isExhausted;
    const {
      left: nudgedLeft,
      top: nudgedTop
    } = getNudgedPopoverRect(rect, boundaryRect, props.boundaryInset);
    let finalTop = top;
    let finalLeft = left;

    if (shouldNudge) {
      finalTop = nudgedTop;
      finalLeft = nudgedLeft;
    }

    popoverRef.style.transform = `translate(${finalLeft - scoutRect.left}px, ${finalTop - scoutRect.top}px)`;
    const potentialViolations = {
      top: boundaryRect.top + props.boundaryInset - finalTop,
      left: boundaryRect.left + props.boundaryInset - finalLeft,
      right: finalLeft + width - boundaryRect.right + props.boundaryInset,
      bottom: finalTop + height - boundaryRect.bottom + props.boundaryInset
    };
    setPopoverState({
      childRect,
      popoverRect: {
        top: finalTop,
        left: finalLeft,
        width,
        height,
        right: finalLeft + width,
        bottom: finalTop + height
      },
      parentRect,
      boundaryRect,
      position,
      align: props.align,
      spacing: props.spacing,
      nudgedTop: nudgedTop - top,
      nudgedLeft: nudgedLeft - left,
      boundaryInset: props.boundaryInset,
      violations: {
        top: potentialViolations.top <= 0 ? 0 : potentialViolations.top,
        left: potentialViolations.left <= 0 ? 0 : potentialViolations.left,
        right: potentialViolations.right <= 0 ? 0 : potentialViolations.right,
        bottom: potentialViolations.bottom <= 0 ? 0 : potentialViolations.bottom
      },
      hasViolations: potentialViolations.top > 0 || potentialViolations.left > 0 || potentialViolations.right > 0 || potentialViolations.bottom > 0
    });
  }

  function handleOnClickOutside(e) {
    if (props.isOpen && e.target.contains(popoverRef)) {
      props.onClickOutside?.(e);
    }
  }

  function handleWindowResize() {
    if (childRef) {
      const boundaryElement = props.boundaryElement ? props.boundaryElement : props.parentElement;
      requestAnimationFrame(() => positionPopover({
        contentLocation: props.contentLocation,
        childRect: childRef?.getBoundingClientRect(),
        parentRect: props.parentElement.getBoundingClientRect(),
        boundaryRect: props.boundaryElement === props.parentElement ? props.parentElement.getBoundingClientRect() : boundaryElement.getBoundingClientRect()
      }));
    }
  }

  let shouldUpdate = true;

  function updatePopover() {
    const childRect = childRef?.getBoundingClientRect();
    const popoverRect = popoverRef?.getBoundingClientRect();

    if (childRect != null && popoverRect != null && (!rectsAreEqual(childRect, {
      top: popoverState.childRect.top,
      left: popoverState.childRect.left,
      width: popoverState.childRect.width,
      height: popoverState.childRect.height,
      bottom: popoverState.childRect.top + popoverState.childRect.height,
      right: popoverState.childRect.left + popoverState.childRect.width
    }) || popoverRect.width !== popoverState.popoverRect.width || popoverRect.height !== popoverState.popoverRect.height || popoverState.spacing !== props.spacing || popoverState.align !== props.align || props.positions !== prevPositions || props.contentLocation !== prevContentLocation || props.reposition !== prevReposition)) {
      const boundaryElement = props.boundaryElement ? props.boundaryElement : props.parentElement;
      positionPopover({
        contentLocation: props.contentLocation,
        childRect,
        parentRect: props.parentElement.getBoundingClientRect(),
        boundaryRect: props.boundaryElement === props.parentElement ? props.parentElement.getBoundingClientRect() : boundaryElement.getBoundingClientRect()
      });
    } // TODO: factor prev checks out into the custom prev....s hook


    if (props.positions !== prevPositions) {
      prevPositions = props.positions;
    }

    if (props.contentLocation !== prevContentLocation) {
      prevContentLocation = props.contentLocation;
    }

    if (props.reposition !== prevReposition) {
      prevReposition = props.reposition;
    }
  }

  function renderChildren() {
    let c = children(() => props.children);
    childRef = c();
    return c();
  } // createRenderEffect || createEffect


  createEffect(() => {
    if (props.isOpen && shouldUpdate) {
      window.requestAnimationFrame(updatePopover);
    }
  });
  onMount(() => {
    window.addEventListener("click", handleOnClickOutside, true);
    window.addEventListener("resize", handleWindowResize);
  });
  onCleanup(() => {
    window.removeEventListener("click", handleOnClickOutside, true);
    window.removeEventListener("resize", handleWindowResize);
    shouldUpdate = false;
  });
  return [memo(renderChildren), createComponent(Show, {
    get when() {
      return props.isOpen;
    },

    get children() {
      return createComponent(PopoverPortal, {
        element: popoverRef,

        get container() {
          return props.parentElement;
        },

        scoutElement: scoutRef,

        get children() {
          return memo(() => typeof props.content !== "function", true)() ? props.content : props.content(popoverState);
        }

      });
    }

  })];
}

const createArrowContainer = ({
  childRect,
  popoverRect,
  position,
  arrowSize,
  arrowColor
}) => {
  const arrowContainerStyle = {
    padding: arrowSize
  };
  const arrowStyle = {
    position: "absolute",
    // FIXME : use CSSProperties instead of any
    ...(() => {
      const arrowWidth = arrowSize * 2;
      let top = childRect.top - popoverRect.top + childRect.height / 2 - arrowWidth / 2;
      let left = childRect.left - popoverRect.left + childRect.width / 2 - arrowWidth / 2;
      const lowerBound = arrowSize;
      const leftUpperBound = popoverRect.width - arrowSize;
      const topUpperBound = popoverRect.height - arrowSize;
      left = left < lowerBound ? lowerBound : left;
      left = left + arrowWidth > leftUpperBound ? leftUpperBound - arrowWidth : left;
      top = top < lowerBound ? lowerBound : top;
      top = top + arrowWidth > topUpperBound ? topUpperBound - arrowWidth : top;
      top = Number.isNaN(top) ? 0 : top;
      left = Number.isNaN(left) ? 0 : left;

      switch (position) {
        case "right":
          return {
            borderTop: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid ${arrowColor}`,
            left: 0,
            top
          };

        case "left":
          return {
            borderTop: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid transparent`,
            borderLeft: `${arrowSize}px solid ${arrowColor}`,
            right: 0,
            top
          };

        case "bottom":
          return {
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid ${arrowColor}`,
            top: 0,
            left
          };

        case "top":
          return {
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderTop: `${arrowSize}px solid ${arrowColor}`,
            bottom: 0,
            left
          };

        default:
          return {
            display: "hidden"
          };
      }
    })()
  };
  return {
    arrowContainerStyle,
    arrowStyle
  };
};

const _tmpl$ = /*#__PURE__*/template(`<div><div></div></div>`, 4);
function ArrowContainer(props) {
  const {
    childRect,
    popoverRect,
    position,
    arrowColor,
    arrowSize,
    arrowClassName,
    arrowStyle: externalArrowStyle,
    className: className$1,
    style: externalArrowContainerStyle
  } = props;
  const {
    arrowContainerStyle,
    arrowStyle
  } = createArrowContainer({
    childRect,
    popoverRect,
    position,
    arrowColor,
    arrowSize
  });
  const mergedContainerStyle = { ...arrowContainerStyle,
    ...externalArrowContainerStyle
  };
  const mergedArrowStyle = { ...arrowStyle,
    ...externalArrowStyle
  };
  return (() => {
    const _el$ = _tmpl$.cloneNode(true),
          _el$2 = _el$.firstChild;

    className(_el$, className$1);

    className(_el$2, arrowClassName);

    insert(_el$, () => props.children, null);

    effect(_p$ => {
      const _v$ = mergedContainerStyle,
            _v$2 = mergedArrowStyle;
      _p$._v$ = style(_el$, _v$, _p$._v$);
      _p$._v$2 = style(_el$2, _v$2, _p$._v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$;
  })();
}

export { ArrowContainer, Popover };
//# sourceMappingURL=index.js.map
