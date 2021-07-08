import { useEffect, useRef, useState } from "react";
import mapboxgl, { MapboxGeoJSONFeature, Point } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import { InfoCard } from "../info-card";
import { Tooltip } from "../tooltip";
import type { County } from "../../types/county";

import { accessToken, layers, sources } from "./config";
import styles from "./index.scss";

mapboxgl.accessToken = accessToken;

function useMap(container: React.RefObject<HTMLDivElement>) {
  const [clicked, setClicked] = useState<County>();
  const [hovered, setHovered] = useState<{ pt: Point; county: County }>();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: container.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-80, 33],
      zoom: 7,
    });

    let lastHoveredFeature: MapboxGeoJSONFeature | undefined;
    function updateHovered(newFeature?: MapboxGeoJSONFeature, pt?: Point) {
      if (newFeature?.id !== lastHoveredFeature?.id) {
        if (lastHoveredFeature) {
          map.setFeatureState(lastHoveredFeature, { hovered: false });
        }
        if (newFeature) {
          map.setFeatureState(newFeature, { hovered: true });
        }
      }
      lastHoveredFeature = newFeature;
      const county = newFeature?.properties as County | undefined;
      setHovered(county ? { county, pt: pt! } : undefined);
    }

    let lastClickedFeature: MapboxGeoJSONFeature | undefined;
    function updateClicked(newFeature?: MapboxGeoJSONFeature) {
      if (newFeature?.id !== lastClickedFeature?.id) {
        if (lastClickedFeature) {
          map.setFeatureState(lastClickedFeature, { clicked: false });
        }
        if (newFeature) {
          map.setFeatureState(newFeature, { clicked: true });
        }
      }
      lastClickedFeature = newFeature;
      setClicked(newFeature?.properties as County);
    }

    map.on("load", function () {
      map.addSource((layers.diabetes as any).source, sources.diabetes);
      map.addLayer(layers.diabetes);

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["diabetes-data"],
        });
        updateClicked(features?.[0]);
      });

      map.on("mouseenter", "diabetes-data", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "diabetes-data", () => {
        map.getCanvas().style.removeProperty("cursor");
        updateHovered();
      });

      map.on("mousemove", "diabetes-data", (e) => {
        updateHovered(e.features?.[0], e.point);
      });

      map.on("mousedown", "diabetes-data", () => {
        setHovered(undefined);
      });
    });

    return () => map.remove();
  }, [container, setClicked, setHovered]);

  return { clicked, hovered };
}

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { clicked, hovered } = useMap(mapContainer);

  return (
    <div className={styles.container} ref={mapContainer}>
      <InfoCard county={clicked} />
      {hovered ? <Tooltip {...hovered} /> : null}
    </div>
  );
}
