import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Point } from "../types/GraphTypes";
import { addBackground, addGridLinesAndLabels } from "../utils/GraphUtils";
import { GRAPH_CONFIG as config } from "../config/GraphConfig";

type Props = {
  posterUrl: string;
  data: Point[];
};

const StaticGraph: React.FC<Props> = ({ posterUrl, data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef(
    d3.line<Point>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveMonotoneX)
  );

  // Draw static background once
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // clear previous content

    svg.append("g").attr("class", "bg-layer");
    svg.append("g").attr("class", "grid-layer");
    svg.append("g").attr("class", "line-layer");

    addBackground(svg.select(".bg-layer"), posterUrl, config);
    addGridLinesAndLabels(svg.select(".grid-layer"), config);
  }, [posterUrl]);

  // Update line only (no full redraw)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const lineLayer = svg.select(".line-layer");
    const line = lineRef.current;

    lineLayer
      .selectAll<SVGPathElement, Point[]>("path")
      .data(data.length ? [data] : [])
      .join(
        enter => enter.append("path")
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 8)
          .attr("opacity", 0.5),
        update => update,
        exit => exit.remove()
      )
      .attr("d", line);
  }, [data]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${config.svgBoxWidth} ${config.svgBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default React.memo(StaticGraph);