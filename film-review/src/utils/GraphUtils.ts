import * as d3 from "d3";
import { GraphConfig } from "../types/GraphTypes";
import { Point } from "../types/GraphTypes";

type SVG = d3.Selection<SVGSVGElement, unknown, null, undefined>;

export const addBackground = (svg: SVG, posterUrl: string, config: GraphConfig) => {
  svg
    .selectAll("image")
    .data([null])
    .join("image")
    .attr("href", posterUrl)
    .attr("width", config.graphWidth)
    .attr("height", config.graphHeight)
    .attr("x", config.graphPadding)
    .attr("y", 0);
};

export const addGridLinesAndLabels = (svg: SVG, config: GraphConfig) => {
  const horizontalSpacing = config.graphHeight / config.horizontalGridLines;
  const verticalSpacing = config.graphWidth / (config.verticalGridLines + 1);

  // Horizontal lines
  svg
    .selectAll(".h-line")
    .data(d3.range(config.horizontalGridLines))
    .join("line")
    .attr("class", "h-line")
    .attr("x1", config.graphPadding - 5)
    .attr("y1", (d) => d * horizontalSpacing + config.verticalGridPadding)
    .attr("x2", config.svgBoxWidth)
    .attr("y2", (d) => d * horizontalSpacing + config.verticalGridPadding)
    .attr("stroke", "gray")
    .attr("stroke-width", 0.5);

  // Vertical lines
  svg
    .selectAll(".v-line")
    .data(d3.range(config.verticalGridLines + 1))
    .join("line")
    .attr("class", "v-line")
    .attr(
      "x1",
      (d) => config.graphPadding + verticalSpacing * (d + 0.5)
    )
    .attr("y1", 0)
    .attr(
      "x2",
      (d) => config.graphPadding + verticalSpacing * (d + 0.5)
    )
    .attr("y2", config.svgBoxHeight)
    .attr("stroke", "gray")
    .attr("stroke-width", 0.5);

  // Horizontal labels
  svg
    .selectAll(".horizontal-label")
    .data(d3.range(config.horizontalGridLines))
    .join("text")
    .attr("class", "horizontal-label")
    .attr("x", 0)
    .attr("y", (d) => d * horizontalSpacing + config.verticalGridPadding)
    .attr("fill", "black")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("alignment-baseline", "middle")
    .text((d) => 5 - d);

  // Vertical labels
  svg
    .selectAll(".vertical-label")
    .data(d3.range(config.verticalGridLines + 1))
    .join("text")
    .attr("class", "vertical-label")
    .attr(
      "x",
      (d) =>
        config.graphPadding + verticalSpacing * 0.5 + d * verticalSpacing
    )
    .attr("y", config.graphHeight + config.graphPadding)
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text((d) => `Act ${"I".repeat(d + 1)}`);
};

export const createLineGenerator = () => {
  return d3
    .line<Point>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveMonotoneX); // smooth curve
};