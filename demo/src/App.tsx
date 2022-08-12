import styles from "./App.module.css";
import { Demo } from "./components/Demo";
import { ControlsProvider } from "./store/controlsStoreContext";

function App() {
  return (
    <div class={styles.App}>
      <ControlsProvider>
        <main class="main">
          <Demo />
        </main>
      </ControlsProvider>
    </div>
  );
}

export default App;
