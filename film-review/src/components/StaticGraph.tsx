import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Point } from "../types/GraphTypes";
import { addBackground, addGridLinesAndLabels } from "../utils/GraphUtils";
import { GRAPH_CONFIG as config } from "../config/GraphConfig";

type Props = {
  posterUrl: string;
  averageData: Point[];
  userData: Point[];
  filmPeakData: Point[];
  showAudience?: boolean;
  showYou?: boolean;
  showFilmPeak?: boolean;
};

const StaticGraph: React.FC<Props> = ({
  posterUrl,
  averageData,
  userData,
  filmPeakData,
  showAudience = true,
  showYou = true,
  showFilmPeak = true,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef(
    d3.line<Point>().x((d) => d.x).y((d) => d.y).curve(d3.curveMonotoneX)
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.append("g").attr("class", "bg-layer");
    svg.append("g").attr("class", "grid-layer");
    svg.append("g").attr("class", "film-layer");
    svg.append("g").attr("class", "audience-layer");
    svg.append("g").attr("class", "user-layer");

    addBackground(svg.select(".bg-layer"), posterUrl, config);
    addGridLinesAndLabels(svg.select(".grid-layer"), config);
  }, [posterUrl]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const line = lineRef.current;

    const filmLayer = svg.select(".film-layer");
    const audienceLayer = svg.select(".audience-layer");
    const userLayer = svg.select(".user-layer");

    filmLayer
      .selectAll<SVGPathElement, Point[]>("path")
      .data(showFilmPeak && filmPeakData.length ? [filmPeakData] : [])
      .join(
        (enter) => enter.append("path").attr("fill", "none").attr("stroke", "red").attr("stroke-width", 8).attr("opacity", 0.3),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("d", line);

    audienceLayer
      .selectAll<SVGPathElement, Point[]>("path")
      .data(showAudience && averageData.length ? [averageData] : [])
      .join(
        (enter) => enter.append("path").attr("fill", "none").attr("stroke", "#0079DD").attr("stroke-width", 8).attr("opacity", 0.3),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("d", line);

    userLayer
      .selectAll<SVGPathElement, Point[]>("path")
      .data(showYou && userData.length ? [userData] : [])
      .join(
        (enter) => enter.append("path").attr("fill", "none").attr("stroke", "#0D6901").attr("stroke-width", 8).attr("opacity", 0.5),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("d", line);
  }, [averageData, userData, filmPeakData, showAudience, showYou, showFilmPeak]);

  return <svg ref={svgRef} viewBox={`0 0 ${config.svgBoxWidth} ${config.svgBoxHeight}`} preserveAspectRatio="xMidYMid meet" />;
};

export default React.memo(StaticGraph);