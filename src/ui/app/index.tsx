import Logo from "../../images/logo.svg";
import { Map } from "../components/map";
import { DiabetesLayer } from "../components/map/layers/diabetes";

import styles from "./index.scss";

const mapConfig = {
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-80, 33] as [number, number],
  zoom: 7,
};

export function App() {
  return (
    <>
      <div className={styles.header}>
        <Logo className={styles.logo} />
        <span className={styles.wordMark}>Re:Public</span>
      </div>
      <Map config={mapConfig}>
        <DiabetesLayer />
      </Map>
    </>
  );
}
