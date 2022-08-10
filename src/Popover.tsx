import {
  onCleanup,
  onMount,
  ParentProps,
  Show,
  children,
  createRenderEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  ContentLocation,
  ContentLocationGetter,
  PopoverPosition,
  PopoverState,
} from "./types";
import { rectsAreEqual } from "./utils";
import PopoverPortal from "./PopoverPortal";
import { PopoverProps } from "./types/";
import { Constants } from "./constants";
import { createPopover } from "./createPopover";

export function Popover(props: ParentProps<PopoverProps>) {
  console.log("positions", props.positions);
  const { containerClassName = "solid-tiny-popover" } = props;
  let childRef: HTMLElement;
  const [popoverState, setPopoverState] = createStore<PopoverState>({
    align: props.align,
    nudgedLeft: 0,
    nudgedTop: 0,
    position:
      props.positions.length > 0
        ? props.positions[0]
        : Constants.DEFAULT_POSITIONS[0],
    padding: props.padding,
    childRect: Constants.EMPTY_CLIENT_RECT,
    popoverRect: Constants.EMPTY_CLIENT_RECT,
    parentRect: Constants.EMPTY_CLIENT_RECT,
    boundaryRect: Constants.EMPTY_CLIENT_RECT,
    boundaryInset: props.boundaryInset,
    violations: Constants.EMPTY_CLIENT_RECT,
    hasViolations: false,
  });

  // previous popover state...
  let prevIsOpen = false;
  let prevPositions: PopoverPosition[] | undefined;
  let prevContentLocation: ContentLocation | ContentLocationGetter | undefined;
  let prevReposition = props.reposition;

  function onPositionPopover(popoverState: PopoverState) {
    return setPopoverState(popoverState);
  }

  const { popoverRef, scoutRef, positionPopover } = createPopover({
    parentElement: props.parentElement,
    childRef,
    containerClassName,
    boundaryElement: props.boundaryElement
      ? props.boundaryElement
      : props.parentElement,
    contentLocation: props.contentLocation,
    positions: props.positions ? props.positions : Constants.DEFAULT_POSITIONS,
    align: props.align,
    padding: props.padding,
    boundaryInset: props.boundaryInset,
    reposition: props.reposition,
    onPositionPopover,
  });

  function handleOnClickOutside(e: MouseEvent) {
    if (props.isOpen && (e.target as Node).contains(popoverRef)) {
      props.onClickOutside?.(e);
    }
  }

  function handleWindowResize() {
    if (childRef) {
      const boundaryElement = props.boundaryElement
        ? props.boundaryElement
        : props.parentElement;
      window.requestAnimationFrame(() =>
        positionPopover({
          contentLocation: props.contentLocation,
          childRect: childRef?.getBoundingClientRect(),
          parentRect: props.parentElement.getBoundingClientRect() as DOMRect,
          isOpen: props.isOpen,
          boundaryRect:
            props.boundaryElement === props.parentElement
              ? (props.parentElement.getBoundingClientRect() as DOMRect)
              : (boundaryElement.getBoundingClientRect() as DOMRect),
        })
      );
    }
  }

  let shouldUpdate = true;

  function updatePopover() {
    const childRect = childRef?.getBoundingClientRect();
    const popoverRect = popoverRef?.getBoundingClientRect();
    if (
      childRect != null &&
      popoverRect != null &&
      (!rectsAreEqual(childRect, {
        top: popoverState.childRect.top,
        left: popoverState.childRect.left,
        width: popoverState.childRect.width,
        height: popoverState.childRect.height,
        bottom: popoverState.childRect.top + popoverState.childRect.height,
        right: popoverState.childRect.left + popoverState.childRect.width,
      } as DOMRect) ||
        popoverRect.width !== popoverState.popoverRect.width ||
        popoverRect.height !== popoverState.popoverRect.height ||
        popoverState.padding !== props.padding ||
        popoverState.align !== props.align ||
        props.positions !== prevPositions ||
        props.contentLocation !== prevContentLocation ||
        props.reposition !== prevReposition)
    ) {
      const boundaryElement = props.boundaryElement
        ? props.boundaryElement
        : props.parentElement;
      positionPopover({
        contentLocation: props.contentLocation,
        childRect,
        parentRect: props.parentElement.getBoundingClientRect() as DOMRect,
        isOpen: props.isOpen,
        boundaryRect:
          props.boundaryElement === props.parentElement
            ? (props.parentElement.getBoundingClientRect() as DOMRect)
            : (boundaryElement.getBoundingClientRect() as DOMRect),
      });
    }

    // TODO: factor prev checks out into the custom prev....s hook
    if (props.positions !== prevPositions) {
      prevPositions = props.positions;
    }
    if (props.contentLocation !== prevContentLocation) {
      prevContentLocation = props.contentLocation;
    }
    if (props.reposition !== prevReposition) {
      prevReposition = props.reposition;
    }

    // I don't know what the fuck is going on here
    //if (shouldUpdate) {
    //window.requestAnimationFrame(updatePopover);
    //prevIsOpen = props.isOpen;
    //}
  }

  function renderChildren() {
    let c = children(() => props.children);
    childRef = c() as HTMLElement;
    return c();
  }

  createRenderEffect(() => {
    console.log("call updatePopover");
    if (props.isOpen && shouldUpdate) {
      window.requestAnimationFrame(updatePopover);
      prevIsOpen = props.isOpen;
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

  return (
    <>
      {renderChildren()}
      <Show when={props.isOpen}>
        <PopoverPortal
          element={popoverRef}
          container={props.parentElement}
          scoutElement={scoutRef}
        >
          {typeof props.content !== "function" && props.content}
        </PopoverPortal>
      </Show>
    </>
  );
}
