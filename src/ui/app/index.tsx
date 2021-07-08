import Logo from "../../images/logo.svg";
import { Map } from "../components/map";

import styles from "./index.scss";

export function App() {
  return (
    <>
      <div className={styles.header}>
        <Logo className={styles.logo} />
        <span className={styles.wordMark}>Re:Public</span>
      </div>
      <Map />
    </>
  );
}
