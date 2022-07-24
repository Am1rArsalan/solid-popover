import styled from "@emotion/styled";
import { PopoverState } from "solid-tiny-popover";
import { Component, JSX } from "solid-js";

type Props = PopoverState & {
  style?: JSX.CSSProperties;
  className?: string;
};

export const PopoverContent: Component<Props> = ({
  className,
  style,
  position,
  align,
  padding,
  nudgedTop,
  nudgedLeft,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      ...style,
    }}
    class={className}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexBasis: "100%",
      }}
    >
      position: {position}
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexBasis: "100%",
      }}
    >
      nudgedLeft: {Math.floor(nudgedLeft)}
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexBasis: "100%",
      }}
    >
      nudgedTop: {Math.floor(nudgedTop)}
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexBasis: "100%",
      }}
    >
      padding: {Math.floor(padding)}
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexBasis: "100%",
      }}
    >
      align: {align}
    </div>
  </div>
);
