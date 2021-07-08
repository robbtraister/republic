import { AnyLayer, AnySourceData, Point } from "mapbox-gl";
import { useCallback, useState } from "react";
import { InfoCard } from "ui/components/info-card";
import { Tooltip } from "ui/components/tooltip";
import { County } from "ui/types/county";
import { Layer } from "../layer";

const PRIMARY = "#0097C4";
const SECONDARY = "#243A76";

export const source: AnySourceData = {
  type: "vector",
  url: "mapbox://robb-traister.8gp3ur7k",
};

export const layer: AnyLayer = {
  id: "diabetes-data",
  type: "fill",
  source: "diabetes-atlas",
  "source-layer": "diabetes-60i77q",
  paint: {
    "fill-outline-color": SECONDARY,
    "fill-color": [
      "case",
      // if clicked, use this color
      ["boolean", ["feature-state", "clicked"], false],
      SECONDARY,
      // else if hovered, use this color
      ["boolean", ["feature-state", "hovered"], false],
      SECONDARY,
      // else use this color
      PRIMARY,
    ],
    "fill-opacity": [
      "case",
      // if clicked, use this opacity
      ["boolean", ["feature-state", "clicked"], false],
      0.75,
      // else if hovered, use this opacity
      ["boolean", ["feature-state", "hovered"], false],
      0.5,
      // else linearly interpolate the Percentage value (doubled) as opacity
      [
        "*",
        2,
        [
          "interpolate",
          ["linear"],
          ["to-number", ["get", "Percentage"]],
          0,
          0,
          100,
          1,
        ],
      ],
    ],
  },
};

export function DiabetesLayer() {
  const [clicked, setClicked] = useState<County>();
  const [hovered, setHovered] = useState<{ pt: Point; properties: County }>();

  const onHover = useCallback(
    (properties?: County, pt?: Point) => {
      setHovered(properties ? { properties, pt: pt! } : undefined);
    },
    [setHovered]
  );

  return (
    <Layer<County>
      source={source}
      layer={layer}
      onClick={setClicked}
      onHover={onHover}
    >
      <InfoCard county={clicked} />
      {hovered ? <Tooltip {...hovered} /> : null}
    </Layer>
  );
}
