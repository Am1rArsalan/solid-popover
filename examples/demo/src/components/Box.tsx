import { Component } from "solid-js";

//interface BoxProps extends ComponentPropsWithRef<"div"> {}

export const Box: Component<{ ref: any }> = ({ ref, ...rest }) => (
  <div ref={ref} {...rest} />
);
