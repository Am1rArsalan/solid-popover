import { Component } from "solid-js";
import { Demo } from "./Demo";

export const Main: Component = () => {
  return (
    <main
      style={{
        display: "flex",
        position: "relative",
        flex: "1",
        backgroundColor: "black",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: " center",
        padding: "128px",
      }}
    >
      <Demo />
    </main>
  );
};
