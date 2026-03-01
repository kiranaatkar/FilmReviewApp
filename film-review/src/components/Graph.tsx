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
  onUserChange?: (points: Point[]) => void; // emit after drag
};

const Graph: React.FC<Props> = ({
  posterUrl,
  filmPeakPoints,
  data,
  audienceData,
  showFilmPeak,
  showAudience,
  showYou,
  onUserChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef(
    d3.line<Point>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveMonotoneX)
  );

  // RAF throttling
  const rafId = useRef<number | null>(null);

  const scheduleUpdate = (updateFn: () => void) => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      updateFn();
      rafId.current = null;
    });
  };

  // --- STATIC LAYERS (runs once)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    svg.append("g").attr("class", "background-layer");
    svg.append("g").attr("class", "grid-layer");
    svg.append("g").attr("class", "film-layer");
    svg.append("g").attr("class", "audience-layer");
    svg.append("g").attr("class", "user-layer");
    svg.append("g").attr("class", "peak-layer");

    addBackground(svg.select(".background-layer"), posterUrl, config);
    addGridLinesAndLabels(svg.select(".grid-layer"), config);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "triangle-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "purple");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "red");
  }, [posterUrl]);

  // --- DYNAMIC LAYERS
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const filmLayer = svg.select(".film-layer");
    const audienceLayer = svg.select(".audience-layer");
    const userLayer = svg.select(".user-layer");
    const peakLayer = svg.select(".peak-layer");

    const line = lineRef.current;

    // Film Peak Layer
    filmLayer
      .selectAll<SVGPathElement, Point[]>("path")
      .data(showFilmPeak && filmPeakPoints.length ? [filmPeakPoints] : [])
      .join(
        enter => enter.append("path")
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 8)
          .attr("opacity", 0.3),
        update => update,
        exit => exit.remove()
      )
      .transition()
      .duration(300)
      .attr("d", line);

    filmLayer
      .selectAll<SVGCircleElement, Point>("circle")
      .data(showFilmPeak ? filmPeakPoints : [])
      .join("circle")
      .attr("r", 8)
      .attr("fill", "red")
      .attr("opacity", 0.3)
      .attr("pointer-events", "none")
      .transition()
      .duration(300)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    // ===============================
    // 👥 Audience Layer (D3 join)
    // ===============================
    audienceLayer
      .selectAll<SVGPathElement, Point[]>("path")
      .data(showAudience && audienceData.length ? [audienceData] : [])
      .join(
        enter => enter.append("path")
          .attr("fill", "none")
          .attr("stroke", "#0079DD")
          .attr("stroke-width", 8)
          .attr("opacity", 0.3),
        update => update,
        exit => exit.remove()
      )
      .transition()
      .duration(300)
      .attr("d", line);

    audienceLayer
      .selectAll<SVGCircleElement, Point>("circle")
      .data(showAudience ? audienceData : [])
      .join("circle")
      .attr("r", 8)
      .attr("fill", "#0079DD")
      .attr("opacity", 0.3)
      .attr("pointer-events", "none")
      .transition()
      .duration(300)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    // User Layer (Draggable)
    if (showYou && data.length) {
      // Path join
      userLayer
        .selectAll<SVGPathElement, Point[]>("path")
        .data([data])
        .join("path")
        .attr("class", "user-path")
        .attr("fill", "none")
        .attr("stroke", "#0D6901")
        .attr("stroke-width", 8)
        .transition()
        .duration(150)
        .attr("d", line);

      const updatePeak = () => {
        const peak = data.reduce((prev, curr) => (curr.y < prev.y ? curr : prev), data[0]);

        peakLayer
          .selectAll<SVGPolygonElement, Point>("polygon")
          .data([peak])
          .join("polygon")
          .attr("fill", "url(#triangle-gradient)")
          .attr("pointer-events", "none")
          .transition()
          .duration(150)
          .attr("points", `${peak.x},${peak.y - 25} ${peak.x - 10},${peak.y - 10} ${peak.x + 10},${peak.y - 10}`);
      };

      const updateLines = () => {
        userLayer.select<SVGPathElement>(".user-path").attr("d", line(data) || "");
        updatePeak();
      };

      const dragBehavior = d3.drag<SVGCircleElement, Point>()
        .on("drag", function (event, draggedPoint) {
          const idx = data.indexOf(draggedPoint);

          if (idx > 0 && idx < data.length - 1) {
            draggedPoint.x = Math.max(
              data[idx - 1].x + config.pointPadding,
              Math.min(data[idx + 1].x - config.pointPadding, event.x)
            );
          }

          draggedPoint.y = Math.max(
            config.verticalGridPadding,
            Math.min(config.graphHeight, event.y)
          );

          d3.select(this)
            .attr("cx", draggedPoint.x)
            .attr("cy", draggedPoint.y);

          scheduleUpdate(updateLines);
        })
        .on("end", () => {
          onUserChange?.([...data]); // emit once after drag
        });

      // Circle join
      userLayer
        .selectAll<SVGCircleElement, Point>("circle")
        .data(data)
        .join("circle")
        .attr("class", "draggable-point")
        .attr("r", 8)
        .attr("fill", "#0D6901")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .each(function () {
          d3.select(this).call(dragBehavior as any);
        });

      updatePeak();
    } else {
      userLayer.selectAll("*").remove();
      peakLayer.selectAll("*").remove();
    }
  }, [filmPeakPoints, audienceData, data, showFilmPeak, showAudience, showYou, onUserChange]);

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

export default React.memo(Graph);