import type { Component } from "solid-js";

import styles from "./App.module.css";
import { Demo } from "./components/Demo";

const App: Component = () => {
  return (
    <div class={styles.App}>
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
    </div>
  );
};

export default App;
