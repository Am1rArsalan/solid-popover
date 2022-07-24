import type { Component } from "solid-js";

import styles from "./App.module.css";
import { Main } from "./demo/Main";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Main />
    </div>
  );
};

export default App;
