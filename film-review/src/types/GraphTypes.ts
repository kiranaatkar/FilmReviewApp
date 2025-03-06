export type Rating = {
  userId: number;
  filmId: number;
  points: Point[];
}

export interface Point {
  x: number;
  y: number;
}

export interface GraphConfig {
  svgBoxWidth: number;
  svgBoxHeight: number;
  graphPadding: number;
  pointPadding: number;
  verticalGridPadding: number;
  graphWidth: number;
  graphHeight: number;
  horizontalGridLines: number;
  verticalGridLines: number;
}