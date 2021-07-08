import type { Point } from "mapbox-gl";
import type { County } from "../../types/county";

import styles from "./index.scss";

export function Tooltip({ properties, pt }: { properties: County; pt: Point }) {
  const style =
    pt.y > window.innerHeight / 2
      ? { left: pt.x, top: pt.y - 10, transform: "translate(-50%, -100%)" }
      : { left: pt.x, top: pt.y + 30, transform: "translateX(-50%)" };

  return (
    <div role="table" className={styles.tooltip} style={style}>
      <div role="row">{properties.State}</div>
      <div role="row">{properties.County}</div>
      <div role="row" className={styles.percentage}>
        {properties.Percentage}%
      </div>
    </div>
  );
}
