import { PopoverPosition } from "solid-tiny-popover";
import { createSignal } from "solid-js";
import { useControls } from "../store/controlsStoreContext";
import { ControlsField } from "./ControlsField";

type Props = {
  className?: string;
  disabled?: boolean;
};

const ALIGN = ["center", "end", "start"] as const;
const POSITION = ["top", "left", "bottom", "right"] as const;

const getPositionArray = (
  startIndex: number
): Exclude<PopoverPosition, "custom">[] => {
  const first = POSITION.slice(startIndex);
  const second = POSITION.slice(0, startIndex);
  return [...first, ...second];
};

export function Controls(props: Props) {
  const { className, disabled } = props;
  const [
    store,
    {
      updatePadding,
      updateAlignment,
      updatePositions,
      updateBoundaryInset,
      updatePopoverWidth,
      updatePopoverHeight,
      updateReposition,
      toggleContentLocationEnabled,
      updateContentLocationFromTop,
      updateContentLocationFromLeft,
      updateContainerClassName,
    },
  ] = useControls();
  const [alignIndex, setAlignIndex] = createSignal(0);
  const [positionIndex, setPositionIndex] = createSignal(0);
  return (
    <div
      class={className}
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        width: "100%",
        pointerEvents: disabled ? "none" : "inherit",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ControlsField label={"Padding"}>
        <input
          value={store.padding}
          onChange={(e) => updatePadding(e.currentTarget.value)}
          style={{ width: "80px" }}
        />
      </ControlsField>
      <ControlsField label={"Align"}>
        <button
          onClick={() => {
            const nextIndex = (alignIndex() + 1) % ALIGN.length;
            updateAlignment(ALIGN[nextIndex]);
            setAlignIndex(nextIndex);
          }}
          style={{
            width: " 50px",
            display: " flex",
            alignItems: " center",
            justifyContent: " center",
          }}
        >
          {ALIGN[alignIndex()]}
        </button>
      </ControlsField>
      <ControlsField label={"Positions"}>
        <button
          onClick={() => {
            const nextIndex = (positionIndex() + 1) % POSITION.length;
            updatePositions(getPositionArray(nextIndex));
            setPositionIndex(nextIndex);
          }}
          style={{
            width: " 50px",
            display: " flex",
            alignItems: " center",
            justifyContent: " center",
          }}
        >
          {POSITION[positionIndex()]}
        </button>
      </ControlsField>
      <ControlsField label={"Boundary inset"}>
        <input
          style={{
            width: "80px",
          }}
          value={store.boundaryInset}
          onChange={(e) => updateBoundaryInset(+e.currentTarget.value)}
        />
      </ControlsField>
      <ControlsField label={"Arrow size"}>
        <input
          style={{
            width: "80px",
          }}
          value={store.arrowSize}
          onChange={(e) => updateBoundaryInset(+e.currentTarget.value)}
        />
      </ControlsField>
      <ControlsField label={"Popover min-width"}>
        <input
          style={{
            width: "80px",
          }}
          value={store.popoverSize.width}
          onChange={(e) => updatePopoverWidth(+e.currentTarget.value)}
        />
      </ControlsField>
      <ControlsField label={"Popover min-height"}>
        <input
          style={{
            width: "80px",
          }}
          value={store.popoverSize.height}
          onChange={(e) => updatePopoverHeight(+e.currentTarget.value)}
        />
      </ControlsField>
      <ControlsField label={"Repositioning enabled"}>
        <input
          style={{ width: "80%" }}
          type="checkbox"
          checked={store.reposition ? true : false}
          onChange={() => updateReposition()}
        />
      </ControlsField>
      <ControlsField label={"Fixed content location"}>
        <input
          type="checkbox"
          checked={store.contentLocationEnabled ? true : false}
          onChange={() => toggleContentLocationEnabled()}
        />
      </ControlsField>
      <ControlsField label={"Fixed content location top"}>
        <input
          style={{ width: "80px" }}
          value={store.contentLocation.top}
          onChange={(e) =>
            updateContentLocationFromLeft(+e.currentTarget.value)
          }
        />
      </ControlsField>
      <ControlsField label={"Fixed content location left"}>
        <input
          style={{ width: "80px" }}
          value={store.contentLocation.left}
          onChange={(e) => updateContentLocationFromTop(+e.currentTarget.value)}
        />
      </ControlsField>
      <ControlsField label={"Container class name"}>
        <input
          style={{ width: "80px" }}
          value={store.containerClassName ?? ""}
          onChange={(e) => updateContainerClassName(e.currentTarget.value)}
        />
      </ControlsField>
    </div>
  );
}
