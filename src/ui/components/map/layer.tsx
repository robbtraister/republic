import { useEffect } from "react";
import {
  AnyLayer,
  AnySourceData,
  MapboxGeoJSONFeature,
  Point,
} from "mapbox-gl";

import { useMap } from ".";

export function Layer<Properties>({
  layer,
  source,
  children,
  onClick,
  onHover,
}: {
  layer: AnyLayer;
  source: AnySourceData;
  children?: React.ReactNode;
  onClick?: (properties?: Properties) => void;
  onHover?: (properties?: Properties, pt?: Point) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      let lastHoveredFeature: MapboxGeoJSONFeature | undefined;
      function updateHovered(newFeature?: MapboxGeoJSONFeature, pt?: Point) {
        if (newFeature?.id !== lastHoveredFeature?.id) {
          if (lastHoveredFeature) {
            map!.setFeatureState(lastHoveredFeature, { hovered: false });
          }
          if (newFeature) {
            map!.setFeatureState(newFeature, { hovered: true });
          }
        }
        lastHoveredFeature = newFeature;
        const properties = newFeature?.properties as Properties | undefined;
        onHover?.(properties, pt);
      }

      let lastClickedFeature: MapboxGeoJSONFeature | undefined;
      function updateClicked(newFeature?: MapboxGeoJSONFeature) {
        if (newFeature?.id !== lastClickedFeature?.id) {
          if (lastClickedFeature) {
            map!.setFeatureState(lastClickedFeature, { clicked: false });
          }
          if (newFeature) {
            map!.setFeatureState(newFeature, { clicked: true });
          }
        }
        lastClickedFeature = newFeature;
        onClick?.(newFeature?.properties as Properties);
      }

      map.on("load", function () {
        map.addSource((layer as any).source, source);
        map.addLayer(layer);

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
          onHover?.(undefined);
        });
      });

      return () => {
        map.removeLayer(layer.id);
      };
    }
  }, [map, layer, source, onClick, onHover]);

  return <>{children ?? null}</>;
}
