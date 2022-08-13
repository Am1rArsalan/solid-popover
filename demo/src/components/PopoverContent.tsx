import { PopoverState } from "solid-popover";
import { JSX } from "solid-js";

type Props = PopoverState & {
  style?: JSX.CSSProperties;
  className?: string;
};

export function PopoverContent(props: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        border: "1px solid #fff",
        ...props.style,
      }}
      class={props.className}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexBasis: "100%",
          color: "#fff",
        }}
      >
        position: {props.position}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexBasis: "100%",
          color: "#fff",
        }}
      >
        nudgedLeft: {Math.floor(props.nudgedLeft)}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexBasis: "100%",
          color: "#fff",
        }}
      >
        nudgedTop: {Math.floor(props.nudgedTop)}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexBasis: "100%",
          color: "#fff",
        }}
      >
        spacing: {Math.floor(props.spacing)}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexBasis: "100%",
          color: "#fff",
        }}
      >
        align: {props.align}
      </div>
    </div>
  );
}
