import { AnyLayer, AnySourceData } from "mapbox-gl";

export const accessToken =
  "pk.eyJ1Ijoicm9iYi10cmFpc3RlciIsImEiOiJja3F0emc4djEyZXE0MndwZTJldmNndzE1In0.meVaPSdL9woUC9beFzSldQ";

const PRIMARY = "#0097C4";
const SECONDARY = "#243A76";

export const sources: Record<string, AnySourceData> = {
  diabetes: {
    type: "vector",
    url: "mapbox://robb-traister.8gp3ur7k",
  },
};

export const layers: Record<string, AnyLayer> = {
  diabetes: {
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
  },
};
