import { GraphConfig, Point } from "../types/GraphTypes";

export const GRAPH_CONFIG: GraphConfig = {
  svgBoxWidth: 400,
  svgBoxHeight: 400,
  graphPadding: 20,
  pointPadding: 30,
  verticalGridPadding: 10,
  graphWidth: 400 - 20, // width - padding
  graphHeight: 400 - 20, // width - padding
  horizontalGridLines: 5,
  verticalGridLines: 2,
};

export const DEFAULT_POINTS: Point[] = [
  {
    point_index: 0,
    x: GRAPH_CONFIG.graphPadding,
    y: GRAPH_CONFIG.graphHeight / 2,
  },
  {
    point_index: 1,
    x: GRAPH_CONFIG.graphWidth / 6 + GRAPH_CONFIG.graphPadding,
    y: GRAPH_CONFIG.graphHeight / 2,
  },
  {
    point_index: 2,
    x: GRAPH_CONFIG.graphWidth / 3 + GRAPH_CONFIG.graphPadding,
    y: GRAPH_CONFIG.graphHeight / 2,
  },
  {
    point_index: 3,
    x: GRAPH_CONFIG.graphWidth / 2 + GRAPH_CONFIG.graphPadding,
    y: GRAPH_CONFIG.graphHeight / 2,
  },
  {
    point_index: 4,
    x: (GRAPH_CONFIG.graphWidth * 2) / 3 + GRAPH_CONFIG.graphPadding,
    y: GRAPH_CONFIG.graphHeight / 2,
  },
  {
    point_index: 5,
    x: (GRAPH_CONFIG.graphWidth * 5) / 6 + GRAPH_CONFIG.graphPadding,
    y: GRAPH_CONFIG.graphHeight / 2,
  },
  {
    point_index: 6,
    x: GRAPH_CONFIG.graphWidth + GRAPH_CONFIG.graphPadding,
    y: GRAPH_CONFIG.graphHeight / 2,
  },
];
