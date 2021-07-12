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
      const sourceId = (layer as any).source;

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

      function init() {
        if (!map?.getSource(sourceId)) {
          map!.addSource(sourceId, source);
        }
        map!.addLayer(layer);

        map!.on("click", (e) => {
          const features = map!.queryRenderedFeatures(e.point, {
            layers: [layer.id],
          });
          updateClicked(features?.[0]);
        });

        map!.on("mouseenter", layer.id, () => {
          map!.getCanvas().style.cursor = "pointer";
        });

        map!.on("mouseleave", layer.id, () => {
          map!.getCanvas().style.removeProperty("cursor");
          updateHovered();
        });

        map!.on("mousemove", layer.id, (e) => {
          updateHovered(e.features?.[0], e.point);
        });

        map!.on("mousedown", layer.id, () => {
          onHover?.(undefined);
        });
      }

      if (map.loaded()) {
        init();
      } else {
        map.on("load", init);
      }

      return () => {
        try {
          map.removeLayer(layer.id);
          if (lastClickedFeature) {
            map!.setFeatureState(lastClickedFeature, { clicked: false });
          }
          if (lastHoveredFeature) {
            map!.setFeatureState(lastHoveredFeature, { hovered: false });
          }
        } catch (e) {
          // do nothing
        }
      };
    }
  }, [map, layer, source, onClick, onHover]);

  return <>{children ?? null}</>;
}
