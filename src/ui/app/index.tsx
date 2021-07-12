import { useState } from "react";
import Logo from "../../images/logo.svg";
import { Map } from "../components/map";
import { DiabetesLayer } from "../components/map/layers/diabetes";

import styles from "./index.scss";

const mapConfig = {
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-96, 38] as [number, number],
  zoom: 4,
};

export function App() {
  const [showDiabetes, setShowDiabetes] = useState(true);
  return (
    <>
      <div className={styles.header}>
        <Logo className={styles.logo} />
        <span className={styles.wordMark}>Re:Public</span>
      </div>
      <Map config={mapConfig}>
        <div className={styles.toggle}>
          <input
            type="checkbox"
            id="diabetes-toggle"
            checked={showDiabetes}
            onChange={(e) => {
              setShowDiabetes(e.target.checked);
            }}
          />
          <label htmlFor="diabetes-toggle">Diabetes Layer</label>
        </div>
        {showDiabetes ? <DiabetesLayer /> : null}
      </Map>
    </>
  );
}
