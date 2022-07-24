//import React, { Dispatch, FC, useState } from "react";
import { PopoverPosition } from "react-tiny-popover";
import { Component, createSignal } from "solid-js";
import { ControlsField } from "./ControlsField";
import { ControlsState, Action } from "./shared";

// TODO : fix any
type Props = {
  className?: string;
  values: ControlsState;
  dispatch: any;
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

export const Controls: Component<Props> = ({
  values,
  dispatch,
  className,
  disabled,
}) => {
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
          value={values.padding}
          onChange={(e) =>
            dispatch({ type: "padding", payload: Number(e.target.value) })
          }
          style={{
            width: "80px",
          }}
        />
      </ControlsField>
      <ControlsField label={"Align"}>
        <button
          onClick={() => {
            const nextIndex = (alignIndex + 1) % ALIGN.length;
            dispatch({ type: "align", payload: ALIGN[nextIndex] });
            setAlignIndex(nextIndex);
          }}
          style={{
            width: " 50px",
            display: " flex",
            alignItems: " center",
            justifyContent: " center",
          }}
        >
          {ALIGN[alignIndex]}
        </button>
      </ControlsField>
      <ControlsField label={"Positions"}>
        <button
          onClick={() => {
            const nextIndex = (positionIndex + 1) % POSITION.length;
            dispatch({
              type: "positions",
              payload: getPositionArray(nextIndex),
            });
            setPositionIndex(nextIndex);
          }}
          style={{
            width: " 50px",
            display: " flex",
            alignItems: " center",
            justifyContent: " center",
          }}
        >
          {POSITION[positionIndex]}
        </button>
      </ControlsField>
      <ControlsField label={"Boundary inset"}>
        <input
          style={{
            width: "80px",
          }}
          value={values.boundaryInset}
          onChange={(e) =>
            dispatch({
              type: "boundaryInset",
              payload: Number(e.target.value),
            })
          }
        />
      </ControlsField>
      <ControlsField label={"Arrow size"}>
        <input
          style={{
            width: "80px",
          }}
          value={values.arrowSize}
          onChange={(e) =>
            dispatch({ type: "arrowSize", payload: Number(e.target.value) })
          }
        />
      </ControlsField>
      <ControlsField label={"Popover min-width"}>
        <input
          style={{
            width: "80px",
          }}
          value={values.popoverSize.width}
          onChange={(e) =>
            dispatch({
              type: "popoverSize",
              payload: {
                ...values.popoverSize,
                width: Number(e.target.value),
              },
            })
          }
        />
      </ControlsField>
      <ControlsField label={"Popover min-height"}>
        <input
          style={{
            width: "80px",
          }}
          value={values.popoverSize.height}
          onChange={(e) =>
            dispatch({
              type: "popoverSize",
              payload: {
                ...values.popoverSize,
                height: Number(e.target.value),
              },
            })
          }
        />
      </ControlsField>
      <ControlsField label={"Repositioning enabled"}>
        <input
          style={{ width: "80%" }}
          type="checkbox"
          checked={values.reposition ? true : false}
          onChange={() => {
            dispatch({
              type: "reposition",
              payload: values.reposition ? false : true,
            });
          }}
        />
      </ControlsField>
      <ControlsField label={"Fixed content location"}>
        <input
          type="checkbox"
          checked={values.contentLocationEnabled ? true : false}
          onChange={() => {
            dispatch({
              type: "contentLocationEnabled",
              payload: values.contentLocationEnabled ? false : true,
            });
          }}
        />
      </ControlsField>
      <ControlsField label={"Fixed content location top"}>
        <input
          style={{
            width: "80px",
          }}
          value={values.contentLocation.top}
          onChange={(e) =>
            dispatch({
              type: "contentLocation",
              payload: {
                ...values.contentLocation,
                top: Number(e.target.value),
              },
            })
          }
        />
      </ControlsField>
      <ControlsField label={"Fixed content location left"}>
        <input
          style={{ width: "80px" }}
          value={values.contentLocation.left}
          onChange={(e) =>
            dispatch({
              type: "contentLocation",
              payload: {
                ...values.contentLocation,
                left: Number(e.target.value),
              },
            })
          }
        />
      </ControlsField>
      <ControlsField label={"Container class name"}>
        <input
          style={{ width: "80px" }}
          value={values.containerClassName ?? ""}
          onChange={(e) =>
            dispatch({
              type: "containerClassName",
              payload: e.target.value,
            })
          }
        />
      </ControlsField>
    </div>
  );
};
