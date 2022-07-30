import {
  Component,
  JSX,
  onCleanup,
  onMount,
  ParentProps,
  Show,
  children,
  createEffect,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  ContentLocation,
  ContentLocationGetter,
  ContentRenderer,
  PopoverPosition,
  PopoverState,
} from "./types";
import { rectsAreEqual } from "./utils";
import PopoverPortal from "./PopoverPortal";
import { PopoverProps } from "./types/";
import { Constants } from "./constants";
import { createPopover } from "./createPopover";
import { spread } from "solid-js/web";

export const Popover: Component<ParentProps<PopoverProps>> = (props) => {
  const {
    containerClassName = "solid-tiny-popover",
    onClickOutside,
    positions = Constants.DEFAULT_POSITIONS,
    align,
    padding,
    boundaryInset,
    parentElement,
  } = props;
  let childRef: HTMLElement;
  const [popoverState, setPopoverState] = createStore<PopoverState>({
    align,
    nudgedLeft: 0,
    nudgedTop: 0,
    position: positions[0],
    padding,
    childRect: Constants.EMPTY_CLIENT_RECT,
    popoverRect: Constants.EMPTY_CLIENT_RECT,
    parentRect: Constants.EMPTY_CLIENT_RECT,
    boundaryRect: Constants.EMPTY_CLIENT_RECT,
    boundaryInset,
    violations: Constants.EMPTY_CLIENT_RECT,
    hasViolations: false,
  });

  // previous popover state...
  let prevIsOpen = false;
  let prevPositions: PopoverPosition[] | undefined;
  let prevContentLocation: ContentLocation | ContentLocationGetter | undefined;
  let prevReposition = props.reposition;

  // rename this to another thing i don't like this name
  const onPositionPopover = (popoverState: PopoverState) =>
    setPopoverState(popoverState);

  const { popoverRef, scoutRef, positionPopover } = createPopover({
    isOpen: props.isOpen,
    childRef,
    containerClassName,
    parentElement,
    //boundaryElement,
    //contentLocation,
    positions,
    align,
    padding,
    boundaryInset,
    //reposition,
    onPositionPopover,
  });

  const handleOnClickOutside = (e: MouseEvent) => {
    if (props.isOpen && (e.target as Node).contains(popoverRef)) {
      onClickOutside?.(e);
    }
  };

  const handleWindowResize = () => {
    if (childRef) {
      window.requestAnimationFrame(() => positionPopover());
    }
  };

  onMount(() => {
    window.addEventListener("click", handleOnClickOutside, true);
    window.addEventListener("resize", handleWindowResize);
  });

  onCleanup(() => {
    window.removeEventListener("click", handleOnClickOutside, true);
    window.removeEventListener("resize", handleWindowResize);
  });

  const [shouldUpdate, setShouldUpdate] = createSignal(true);

  createEffect(() => {
    const updatePopover = () => {
      if (props.isOpen && shouldUpdate()) {
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
            popoverState.padding !== padding ||
            popoverState.align !== align ||
            positions !== prevPositions ||
            props.contentLocation !== prevContentLocation ||
            props.reposition !== prevReposition)
        ) {
          positionPopover();
        }

        // TODO: factor prev checks out into the custom prev....s hook
        if (positions !== prevPositions) {
          prevPositions = positions;
        }
        if (props.contentLocation !== prevContentLocation) {
          prevContentLocation = props.contentLocation;
        }
        if (props.reposition !== prevReposition) {
          prevReposition = props.reposition;
        }

        if (shouldUpdate()) {
          window.requestAnimationFrame(updatePopover);
        }
      }

      prevIsOpen = props.isOpen;
    };
    window.requestAnimationFrame(updatePopover);
  });

  onCleanup(() => {
    setShouldUpdate(false);
  });

  const renderChildren = () => {
    let c = children(() => props.children);
    childRef = c() as HTMLElement;
    return c();
  };

  return (
    <>
      {renderChildren()}
      <Show when={props.isOpen}>
        <PopoverPortal
          element={popoverRef}
          container={parentElement}
          scoutElement={scoutRef}
        >
          {typeof props.content !== "function" && props.content}
        </PopoverPortal>
      </Show>
    </>
  );
};

//<PopoverPortal
//element={popoverRef.current}
//scoutElement={scoutRef.current}
//container={parentElement}
//>
//{typeof content === "function" ? content(popoverState) : content}
//{children}
//</PopoverPortal>
