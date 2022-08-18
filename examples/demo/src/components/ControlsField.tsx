import { ParentProps } from "solid-js";

interface Props {
  label: string;
  className?: string;
}

export function ControlsField({
  label,
  children,
  className,
}: ParentProps<Props>) {
  return (
    <div
      style={{
        display: " flex",
        "flex-direction": "column",
        "align-items": "flex-start",
        "justify-content": "center",
        padding: " 4px",
        color: " white",
      }}
      class={className}
    >
      <div
        style={{
          marginBottom: "4px",
          fontSize: "12px",
          userSelect: "none",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
