import {
  Component,
  JSX,
  onCleanup,
  onMount,
  ParentProps,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { ContentRenderer, PopoverState } from "./types";
import { createContainer } from "./utils";
import PopoverPortal from "./PopoverPortal";
import { PopoverProps } from "./types/";
import { Constants } from "./constants";
import { createPopover } from "./createPopover";
import { spread } from "solid-js/web";

export const Popover: Component<ParentProps<PopoverProps>> = (props) => {
  console.log("what is current Props", props);
  const {
    containerClassName = "solid-tiny-popover",
    onClickOutside,
    positions = Constants.DEFAULT_POSITIONS,
    align,
    padding,
    boundaryInset,
    parentElement,
  } = props;
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

  let childRef;

  // rename this to another thing i don't like this name
  const onPositionPopover = (popoverState: PopoverState) =>
    setPopoverState(popoverState);

  const { popoverRef, scoutRef } = createPopover({
    isOpen: props.isOpen,
    //childRef,
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

  //const handleWindowResize = () => {
  //if (childRef.current) {
  //window.requestAnimationFrame(() => positionPopover());
  //}
  //};

  onMount(() => {
    window.addEventListener("click", handleOnClickOutside, true);
    //window.addEventListener("resize", handleWindowResize);
  });

  onCleanup(() => {
    window.removeEventListener("click", handleOnClickOutside, true);
    //window.removeEventListener("resize", handleWindowResize);
  });

  const renderChildren = () => {
    const children = props.children;

    spread(children, {
      get ref() {
        return childRef;
      },
    });
    return children;
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
