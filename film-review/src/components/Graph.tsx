import React, { useEffect, useRef } from "react";
import "../styles/Graph.css";
import { Point } from "../types/GraphTypes";
import * as d3 from "d3";
import { addBackground, addGridLinesAndLabels } from "../utils/GraphUtils";
import { GRAPH_CONFIG as config } from "../config/GraphConfig";

type Props = {
  posterUrl: string;
  data: Point[];
  avgData: Point[];
  showAvg: boolean;         // controls average line/points
  showUserPoints: boolean;  // controls draggable points and their path
};

const DraggableGraph: React.FC<Props> = ({
  posterUrl,
  data,
  avgData,
  showAvg,
  showUserPoints,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear before re-render

    // --- Gradient for peak triangle
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "triangle-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "purple");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "red");

    // --- Setup background and grid
    addBackground(svg, posterUrl, config);
    addGridLinesAndLabels(svg, config);

    // --- Avg path + points
    if (showAvg) {
      const lineGenerator = d3
        .line<Point>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .attr("class", "static-path")
        .attr("d", lineGenerator(avgData) || "")
        .attr("fill", "none")
        .attr("stroke", "#0079DD")
        .attr("opacity", 0.3)
        .attr("stroke-width", 8);

      svg
        .selectAll(".avg-point")
        .data(avgData)
        .join("circle")
        .attr("class", "avg-point")
        .attr("r", 8)
        .attr("fill", "#0079DD")
        .attr("opacity", 0.3)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("pointer-events", "none");
    }

    // --- User (draggable) path + points
    if (showUserPoints) {
      const lineGenerator = d3
        .line<Point>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .attr("class", "updating-path")
        .attr("d", lineGenerator(data) || "")
        .attr("fill", "none")
        .attr("stroke", "#0D6901")
        .attr("stroke-width", 8);

      const updateLines = () => {
        const pathData = lineGenerator(data);
        svg.selectAll(".updating-path").attr("d", pathData || "");

        // add triangle at peak
        const peak = data.reduce(
          (prev, curr) => (curr.y < prev.y ? curr : prev),
          data[0]
        );
        svg.selectAll(".peak-triangle").remove();
        svg
          .append("polygon")
          .attr("class", "peak-triangle")
          .attr(
            "points",
            `${peak.x},${peak.y - 25} ${peak.x - 10},${peak.y - 10} ${peak.x + 10},${peak.y - 10}`
          )
          .attr("fill", "url(#triangle-gradient)");
      };

      svg
        .selectAll<SVGCircleElement, Point>(".draggable-point")
        .data(data)
        .join("circle")
        .attr("class", "draggable-point")
        .attr("r", 8)
        .attr("fill", "#0D6901")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .call(
          d3
            .drag<SVGCircleElement, Point>()
            .on("drag", function (event, d) {
              const idx = data.indexOf(d);
              if (idx > 0 && idx < data.length - 1) {
                d.x = Math.max(
                  data[idx - 1].x + config.pointPadding,
                  Math.min(data[idx + 1].x - config.pointPadding, event.x)
                );
              }
              d.y = Math.max(config.verticalGridPadding, Math.min(config.graphHeight, event.y));
              d3.select(this).attr("cx", d.x).attr("cy", d.y);
              updateLines();
            })
        );

      updateLines();
    }

  }, [posterUrl, data, avgData, showAvg, showUserPoints]);

  return (
    <div className="graph-wrapper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${config.svgBoxWidth} ${config.svgBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default DraggableGraph;
