import { createContext, useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import styles from "./index.scss";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9iYi10cmFpc3RlciIsImEiOiJja3F0emc4djEyZXE0MndwZTJldmNndzE1In0.meVaPSdL9woUC9beFzSldQ";

const mapContext = createContext<mapboxgl.Map | undefined>(undefined);
export const useMap = () => useContext(mapContext);

export function Map({
  children,
  config,
}: {
  children?: React.ReactNode;
  config: Omit<mapboxgl.MapboxOptions, "container">;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>();

  useEffect(() => {
    const m = new mapboxgl.Map({ ...config, container: container.current! });

    setMap(m);

    return () => m.remove();
  }, [config, container]);

  return (
    <div className={styles.container} ref={container}>
      <mapContext.Provider value={map}>{children}</mapContext.Provider>
    </div>
  );
}
