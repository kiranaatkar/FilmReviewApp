import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Point {
  x: number;
  y: number;
}

type Props = {
    posterUrl: string;
}

const WIDTH: number = 400;
const HEIGHT: number = 400;
const PADDING: number = 20;
const HORIZONTAL_GRID_LINES: number = 4;
const VERTICAL_GRID_LINES: number = 2;

const DraggableGraph: React.FC<Props> = ({ posterUrl }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<Point[]>([
    { x: 0, y: HEIGHT * (9/10) },
    { x: WIDTH / 6, y: HEIGHT * (9/10) },
    { x: WIDTH / 2, y: HEIGHT * (9/10) },
    { x: WIDTH - (WIDTH / 6), y: HEIGHT * (9/10) },
    { x: WIDTH, y: HEIGHT * (9/10) },
  ]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    AddBackground(svg);
    AddGridLines(svg)    
    AddPoints(svg);
    AddPath(svg);    
  }, [data]);

  const AddGridLines = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    const horizontalGridSpacing = HEIGHT / (HORIZONTAL_GRID_LINES + 1);
    svg.selectAll(".vertical-grid-line")
        .data(d3.range(1, HORIZONTAL_GRID_LINES + 1))
        .join("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("y1", (d) => d * horizontalGridSpacing)
        .attr("x2", WIDTH)
        .attr("y2", (d) => d * horizontalGridSpacing)
        .attr("stroke", "gray")
        .attr("stroke-width", 1);
    
    const verticalGridSpacing = WIDTH / (VERTICAL_GRID_LINES + 1)
    svg.selectAll(".horizontal-grid-line")
        .data(d3.range(1, VERTICAL_GRID_LINES + 1))
        .join("line")
        .attr("class", "grid-line")
        .attr("x1", (d) => d * verticalGridSpacing)
        .attr("y1", 0)
        .attr("x2", (d) => d * verticalGridSpacing)
        .attr("y2", HEIGHT)
        .attr("stroke", "gray")
        .attr("stroke-width", 1);
  }

  const AddBackground = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    svg.selectAll("image")
      .data([null]) // Dummy data to ensure only one image is added
      .join("image")
      .attr("href", posterUrl)
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("x", 0)
      .attr("y", 0);
  }

  const AddPoints = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    svg.selectAll<SVGCircleElement, Point>("circle")
      .data(data)
      .join("circle")
      .attr("r", 8)
      .attr("fill", "red")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .call(
        d3.drag<SVGCircleElement, Point>()
          .on("start", function () {
            d3.select(this).raise().attr("stroke", "black");
          })
          .on("drag", function (event: d3.D3DragEvent<SVGCircleElement, Point, Point>, d) {

            // Keep first and last point on graph boundary
            const pointIndex: number = data.indexOf(d);
            if (pointIndex > 0 && pointIndex < data.length - 1) {
                d.x = Math.max(data[pointIndex - 1].x + PADDING, Math.min(data[pointIndex + 1].x - PADDING, event.x));
            }
            // Update Y for all points
            d.y = Math.max(0, Math.min(HEIGHT, event.y));

            d3.select(this).attr("cx", d.x).attr("cy", d.y);
            updateLines(); // Redraw lines dynamically
          })
          .on("end", function () {
            d3.select(this).attr("stroke", null);
          })
      );

      const updateLines = () => {
    
        svg.selectAll("path")
          .data([data])
          .attr("d", (d) => {
            const lineGenerator = d3.line<Point>()
              .x((d) => d.x)
              .y((d) => d.y)
              .curve(d3.curveNatural);
            return lineGenerator(d) || "";
          });
      };
  }

  const AddPath = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    svg.selectAll("path")
      .data([data])
      .join("path")
      .attr("d", (d) => {
        const lineGenerator = d3.line<Point>()
          .x((d) => d.x)
          .y((d) => d.y)
          .curve(d3.curveNatural);
        return lineGenerator(d) || "";
      })
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 6);
  }
  
  return (
    <div style={{ border: "1px solid black" }}>
        <svg ref={svgRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

export default DraggableGraph;
