import type { County } from "../../types/county";

import styles from "./index.scss";

export function InfoCard({ county }: { county?: County }) {
  return (
    <div role="table" className={styles.infoCard}>
      {county ? (
        <>
          <div role="rowheader">
            <div role="cell">Diabetes Rate</div>
          </div>
          <div role="row">
            <div role="cell" className={styles.label}>
              State:
            </div>
            <div role="cell">{county.State}</div>
          </div>
          <div role="row">
            <div role="cell" className={styles.label}>
              County:
            </div>
            <div role="cell">{county.County}</div>
          </div>
          <div role="row" className={styles.rates}>
            <div role="cell">{county["Lower Limi"]}%</div>
            <div role="cell" className={styles.percentage}>
              {county.Percentage}%
            </div>
            <div role="cell">{county["Upper Limi"]}%</div>
          </div>
        </>
      ) : (
        <>Click a county for more information</>
      )}
    </div>
  );
}
