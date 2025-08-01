import React, { useEffect, useRef } from "react";
import "../styles/Graph.css";
import { Point, GraphConfig } from "../types/GraphTypes";
import * as d3 from "d3";
import { addBackground, addGridLinesAndLabels } from "../utils/GraphUtils";
import { GRAPH_CONFIG as config } from "../config/GraphConfig";


type Props = {
  posterUrl: string;
  data: Point[];
  avgData: Point[];
  showAvg: boolean;
};

const DraggableGraph: React.FC<Props> = ({
  posterUrl,
  data,
  avgData,
  showAvg,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const AddAvgPoints = (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
    ) => {
      svg
        .selectAll(".avg-point")
        .data(avgData)
        .join("circle")
        .attr("class", "avg-point")
        .attr("r", 8)
        .attr("fill", "red")
        .attr("opacity", 0.3)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("pointer-events", "none");
    };

    const AddDraggablePoints = (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
    ) => {
      svg
        .selectAll<SVGCircleElement, Point>(".draggable-point")
        .data(data)
        .join("circle")
        .attr("class", "draggable-point")
        .attr("r", 8)
        .attr("fill", "red")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .call(
          d3
            .drag<SVGCircleElement, Point>()
            .on("start", function () {
              d3.select(this).raise().attr("stroke", "black");
            })
            .on(
              "drag",
              function (
                event: d3.D3DragEvent<SVGCircleElement, Point, Point>,
                d
              ) {
                // Keep first and last point on graph boundary
                const pointIndex: number = data.indexOf(d);
                if (pointIndex > 0 && pointIndex < data.length - 1) {
                  d.x = Math.max(
                    data[pointIndex - 1].x + config.pointPadding,
                    Math.min(
                      data[pointIndex + 1].x - config.pointPadding,
                      event.x
                    )
                  );
                }
                // Update Y for all points
                d.y = Math.max(
                  config.verticalGridPadding,
                  Math.min(config.graphHeight, event.y)
                );

                d3.select(this).attr("cx", d.x).attr("cy", d.y);
                updateLines(); // Redraw lines dynamically
              }
            )
            .on("end", function () {
              d3.select(this).attr("stroke", null);
            })
        );

      const updateLines = () => {
        const lineGenerator = d3
          .line<Point>()
          .x((d) => d.x)
          .y((d) => d.y)
          .curve(d3.curveMonotoneX);
        // Generate the smooth curve path between data points
        const pathData = lineGenerator(data);
        // update curve
        svg
          .selectAll(".updating-path")
          .data([data])
          .attr("d", (d) => pathData || "");

        // update peak on curve
        const peak: Point = data.reduce(
          (prev, curr) => (curr.y < prev.y ? curr : prev),
          data[0]
        );
        // Remove old triangle if it exists
        svg.selectAll(".peak-triangle").remove();
        // Add a new triangle at the peak
        svg
          .append("polygon")
          .attr("class", "peak-triangle")
          .attr(
            "points",
            `
                ${peak.x},${peak.y - 25} 
                ${peak.x - 10},${peak.y - 10} 
                ${peak.x + 10},${peak.y - 10}
              `
          )
          .attr("fill", "url(#triangle-gradient)"); // Apply gradient
      };

      updateLines();
    };

    const AddGradient = (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
    ) => {
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
    };

    const AddUpdatingPath = (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
    ) => {
      svg
        .selectAll(".updating-path")
        .data([data])
        .join("path")
        .attr("class", "updating-path")
        .attr("d", (d) => {
          const lineGenerator = d3
            .line<Point>()
            .x((d) => d.x)
            .y((d) => d.y)
            .curve(d3.curveMonotoneX);
          return lineGenerator(d) || "";
        })
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 8);
    };

    const AddStaticPath = (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
    ) => {
      svg
        .selectAll(".static-path")
        .data([avgData])
        .join("path")
        .attr("class", "static-path")
        .attr("d", (d) => {
          const lineGenerator = d3
            .line<Point>()
            .x((d) => d.x)
            .y((d) => d.y)
            .curve(d3.curveMonotoneX);
          return lineGenerator(d) || "";
        })
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("opacity", 0.3)
        .attr("stroke-width", 8);
    };

    addBackground(svg, posterUrl, config);
    addGridLinesAndLabels(svg, config);
    AddGradient(svg);
    if (showAvg) {
      AddStaticPath(svg);
      AddAvgPoints(svg);
      svg.selectAll(".draggable-point").raise();
    } else {
      svg.selectAll(".static-path").remove();
      svg.selectAll(".avg-point").remove();
    }
    AddUpdatingPath(svg);
    AddDraggablePoints(svg);
  }, [config, data, avgData, showAvg, posterUrl]);

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
