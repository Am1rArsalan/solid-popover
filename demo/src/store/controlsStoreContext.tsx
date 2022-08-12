import { Component, createContext, useContext } from "solid-js";
import { ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import { PopoverPosition } from "../../../dist/types/types";
import { ControlsState } from "../components/shared";

export interface ControlActions {
  updateSpacing(value: number): void;
  updateAlignment(value: "center" | "end" | "start"): void;
  updatePositions(value: Exclude<PopoverPosition, "custom">[]): void;
  updateBoundaryInset(value: number): void;
  updatePopoverWidth(value: number): void;
  updatePopoverHeight(value: number): void;
  updateReposition(): void;
  toggleContentLocationEnabled(): void;
  updateContentLocationFromLeft(value: number): void;
  updateContentLocationFromTop(value: number): void;
  updateContainerClassName(value: string): void;
  updateArrowSize(value: number): void;
  togglePopover(value?: boolean): void;
}

export type ControlStateContextType = [ControlsState, ControlActions];

const initialState = {
  isOpen: false,
  spacing: 10,
  align: "center",
  positions: ["top", "left", "bottom", "right"] as PopoverPosition[],
  boundaryInset: 0,
  reposition: true,
  contentLocation: {
    left: 0,
    top: 0,
  },
  contentLocationEnabled: false,
  containerClassName: "solid-tiny-popover-container",
  boundaryTolerance: 0,
  arrowSize: 10,
  popoverSize: {
    width: 100,
    height: 100,
  },
};

const ControlsStateContext = createContext<ControlStateContextType>([
  initialState,
  Object({}),
]);

export const ControlsProvider: Component<ParentProps> = (props) => {
  const [state, setState] = createStore<ControlsState>(initialState);

  const actions: ControlActions = Object({
    updateSpacing(value: string) {
      setState("spacing", +value);
    },
    updateAlignment(value: "center" | "end" | "start") {
      setState("align", value);
    },
    updatePositions(value: Exclude<PopoverPosition, "custom">[]) {
      setState("positions", value);
    },
    updateBoundaryInset(value: number) {
      setState("boundaryInset", value);
    },
    updateArrowSize(value: number) {
      setState("arrowSize", value);
    },
    updatePopoverWidth(value: number) {
      setState("popoverSize", {
        width: value,
        height: state.popoverSize?.height,
      });
    },
    updatePopoverHeight(value: number) {
      setState("popoverSize", {
        height: value,
        width: state.popoverSize?.width,
      });
    },
    updateReposition() {
      setState("reposition", !state.reposition);
    },
    toggleContentLocationEnabled() {
      setState({
        ...state,
        contentLocationEnabled: !state.contentLocationEnabled,
      });
    },
    updateContentLocationFromLeft(value: number) {
      setState("contentLocation", {
        left: value,
        top: state.contentLocation?.top,
      });
    },
    updateContentLocationFromTop(value: number) {
      setState("contentLocation", {
        top: value,
        left: state.contentLocation?.left,
      });
    },
    updateContainerClassName(value: string) {
      setState("containerClassName", value);
    },
    togglePopover(value?: boolean) {
      if (value !== undefined) {
        setState("isOpen", value);
        return;
      }

      setState("isOpen", !state.isOpen);
    },
  });

  const store: ControlStateContextType = [state, actions];

  return (
    <ControlsStateContext.Provider value={store}>
      {props.children}
    </ControlsStateContext.Provider>
  );
};

export function useControls() {
  const store = useContext(ControlsStateContext);
  return store;
}
