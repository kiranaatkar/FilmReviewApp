// src/components/Graph.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/Graph.css";
import { Point } from "../types/GraphTypes";
import { addBackground, addGridLinesAndLabels } from "../utils/GraphUtils";
import { GRAPH_CONFIG as config } from "../config/GraphConfig";

type Props = {
  posterUrl: string;
  filmPeakPoints: Point[];
  data: Point[];
  audienceData: Point[];
  showFilmPeak: boolean;
  showAudience: boolean;
  showYou: boolean;
};

const Graph: React.FC<Props> = ({
  posterUrl,
  filmPeakPoints,
  data,
  audienceData,
  showFilmPeak,
  showAudience,
  showYou,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // --- STATIC LAYERS (run once when posterUrl changes)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // initial clean

    // Create named groups for layers
    svg.append("g").attr("class", "background-layer");
    svg.append("g").attr("class", "grid-layer");
    svg.append("g").attr("class", "film-layer");
    svg.append("g").attr("class", "audience-layer");
    svg.append("g").attr("class", "user-layer");

    // Draw background and grid into their groups
    addBackground(svg.select(".background-layer"), posterUrl, config);
    addGridLinesAndLabels(svg.select(".grid-layer"), config);

    // Gradient in defs
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
  }, [posterUrl]);

  // --- DYNAMIC LAYERS (update when data or toggles change)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const filmLayer = svg.select<SVGGElement>(".film-layer");
    const audienceLayer = svg.select<SVGGElement>(".audience-layer");
    const userLayer = svg.select<SVGGElement>(".user-layer");

    // Clear only the dynamic layers
    filmLayer.selectAll("*").remove();
    audienceLayer.selectAll("*").remove();
    userLayer.selectAll("*").remove();
    svg.selectAll(".peak-triangle").remove();

    // Helper to create a line generator
    const makeLine = () =>
      d3.line<Point>().x((d) => d.x).y((d) => d.y).curve(d3.curveMonotoneX);

    // --- Film Peak Layer
    if (showFilmPeak && filmPeakPoints.length > 0) {
      const line = makeLine();
      filmLayer
        .append("path")
        .attr("d", line(filmPeakPoints) || "")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 8)
        .attr("opacity", 0.3);

      filmLayer
        .selectAll<SVGCircleElement, Point>("circle")
        .data(filmPeakPoints)
        .join("circle")
        .attr("r", 8)
        .attr("fill", "red")
        .attr("opacity", 0.3)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("pointer-events", "none");
    }

    // --- Audience Layer
    if (showAudience && audienceData.length > 0) {
      const line = makeLine();
      audienceLayer
        .append("path")
        .attr("d", line(audienceData) || "")
        .attr("fill", "none")
        .attr("stroke", "#0079DD")
        .attr("stroke-width", 8)
        .attr("opacity", 0.3);

      audienceLayer
        .selectAll<SVGCircleElement, Point>("circle")
        .data(audienceData)
        .join("circle")
        .attr("r", 8)
        .attr("fill", "#0079DD")
        .attr("opacity", 0.3)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("pointer-events", "none");
    }

    // --- User (draggable) Layer
    if (showYou && data.length > 0) {
      const line = makeLine();

      // Add the user path
      userLayer
        .append("path")
        .attr("class", "user-path")
        .attr("d", line(data) || "")
        .attr("fill", "none")
        .attr("stroke", "#0D6901")
        .attr("stroke-width", 8);

      // updateLines updates the path and the peak triangle
      const updateLines = () => {
        const pathData = line(data);
        userLayer.selectAll<SVGPathElement, Point>(".user-path").attr("d", pathData || "");

        // compute peak
        const peak = data.reduce((prev, curr) => (curr.y < prev.y ? curr : prev), data[0]);
        svg.selectAll(".peak-triangle").remove();
        svg
          .append("polygon")
          .attr("class", "peak-triangle")
          .attr(
            "points",
            `${peak.x},${peak.y - 25} ${peak.x - 10},${peak.y - 10} ${peak.x + 10},${peak.y - 10}`
          )
          .attr("fill", "url(#triangle-gradient)")
          .attr("stroke", "none")
          .attr("pointer-events", "none");
      };

      // Create drag behavior with correct generic types
      const dragBehavior = d3
        .drag<SVGCircleElement, Point>()
        .on(
          "drag",
          function (
            this: SVGCircleElement,
            event: d3.D3DragEvent<SVGCircleElement, Point, unknown>,
            draggedPoint: Point
          ) {
            const idx = data.indexOf(draggedPoint);
            if (idx > 0 && idx < data.length - 1) {
              draggedPoint.x = Math.max(
                data[idx - 1].x + config.pointPadding,
                Math.min(data[idx + 1].x - config.pointPadding, event.x)
              );
            }
            draggedPoint.y = Math.max(config.verticalGridPadding, Math.min(config.graphHeight, event.y));

            // Update element position
            d3.select(this).attr("cx", draggedPoint.x).attr("cy", draggedPoint.y);
            updateLines();
          }
        );

      // Join circles and attach drag — to satisfy TypeScript, attach per element via .each and cast the .call to any
      userLayer
        .selectAll<SVGCircleElement, Point>("circle")
        .data(data)
        .join("circle")
        .attr("class", "draggable-point")
        .attr("r", 8)
        .attr("fill", "#0D6901")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .each(function () {
          // `this` is an element for which we attach the drag behavior
          // cast dragBehavior to any only at call-site to satisfy TS defs for Selection.call(...)
          d3.select(this).call(dragBehavior as any);
        });

      updateLines();
    }
  }, [filmPeakPoints, audienceData, data, showFilmPeak, showAudience, showYou]);

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

export default Graph;
