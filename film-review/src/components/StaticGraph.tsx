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

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render


    addBackground(svg, posterUrl, config);
    addGridLinesAndLabels(svg, config);
    

    // Static line
    const lineGenerator = d3
      .line<Point>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 8)
      .attr("opacity", 0.5);
  }, [posterUrl, data]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${config.svgBoxWidth} ${config.svgBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default StaticGraph;
