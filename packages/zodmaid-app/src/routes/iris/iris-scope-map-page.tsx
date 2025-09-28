import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { throwError } from "../../helpers/error";
import { useDocumentTitle } from "../../helpers/react";

export const IrisScopeMapPage = () => {
  useDocumentTitle("iris: scope map");
  return (
    <div className="m-4 p-4 w-fit border-2 border-[#aaa]">
      <SvgContainer
        width={700}
        height={500}
        renderSvg={(width, height) => new ScopeMap().render({}, width, height)}
      />
    </div>
  );
};

export type SvgContainerProps = {
  renderSvg: (width: number, height: number) => SVGSVGElement;
  width?: number;
  height?: number;
};

export const SvgContainer = (props: SvgContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const render = () => {
    if (!ref.current) return;
    const width = props.width ?? ref.current.clientWidth;
    const height = props.height ?? ref.current.clientHeight;
    const svg = props.renderSvg(width, height);
    ref.current.replaceChildren(svg);
  };
  useEffect(() => {
    render();
    const observer = new ResizeObserver(() => render());
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [props.width, props.height]);

  return <div ref={ref}></div>;
};

type SvgSelection<Datum = undefined> = d3.Selection<SVGSVGElement, Datum, null, undefined>;

export class ScopeMap {
  width: number = 0;
  height: number = 0;
  styles = {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: 14,
    lineHeight: 16,
    textPrimary: "#000",
    textSecondary: "#aaa",
    strokePrimary: "#aaa",
    strokeSecondary: "#ccc",
    fillPrimary: "#fff",
  };

  render(data: {}, width: number, height: number) {
    this.width = width;
    this.height = height;
    const svg = d3
      .create("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox", [0, 0, width, height].join(" "))
      .attr("width", width)
      .attr("height", height);
    this.renderChart(svg);
    return svg.node() ?? throwError("svg selection is empty");
  }

  renderChart(svg: SvgSelection) {
    // svg
    //   .append("rect")
    //   .attr("x", 10)
    //   .attr("y", 10)
    //   .attr("width", 100)
    //   .attr("height", 100)
    //   .style("fill", "none")
    //   .style("stroke", this.styles.strokePrimary)
    //   .style("stroke-width", 2);

    // // Regular hexagon vertices around (cx, cy) with "radius" r (distance from center to a vertex).
    // function hexagonPoints(cx: number, cy: number, r: number) {
    //   // Flat-topped hexagon: start angle at 0. For pointy-top, use -Math.PI/2.
    //   const startAngle = 0;
    //   return d3.range(6).map((i) => {
    //     const a = startAngle + (i * Math.PI) / 3; // 60° steps
    //     return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    //   });
    // }

    // Create a shared canvas context for text measurement
    const measureCtx = document.createElement("canvas").getContext("2d");

    function measureTextWidth(text, fontSize = "16px", fontFamily = "sans-serif") {
      measureCtx.font = `${fontSize} ${fontFamily}`;
      return measureCtx.measureText(text).width;
    }

    function wrapTextCanvas(textSelection, maxWidth, fontSize = "16px", fontFamily = "sans-serif") {
      textSelection.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word,
          line = [],
          lineNumber = 0;
        const lineHeight = 1.2; // em
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy")) || 0;

        // Clear and start fresh
        text.text(null);
        let tspan = text
          .append("tspan")
          .attr("x", text.attr("x"))
          .attr("y", y)
          .attr("dy", dy + "em");

        while ((word = words.pop())) {
          line.push(word);
          let lineText = line.join(" ");
          console.log(line);
          if (measureTextWidth(lineText, fontSize, fontFamily) > maxWidth) {
            // remove last word and commit line
            line.pop();
            tspan.text(line.join(" "));

            // start new line
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", text.attr("x"))
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          } else {
            tspan.text(lineText);
          }
        }
      });
    }

    function hexagonPoints(cx: number, cy: number, h: number, w = h * 1.75) {
      // Half dimensions
      const hw = w / 2; // half of flat width
      const hh = h / 2; // half of full height

      // Horizontal offset: half of the top/bottom "slant"
      const dx = hw / 2;

      return [
        [cx - dx, cy - hh], // top-left
        [cx + dx, cy - hh], // top-right
        [cx + hw, cy], // right
        [cx + dx, cy + hh], // bottom-right
        [cx - dx, cy + hh], // bottom-left
        [cx - hw, cy], // left
      ];
    }

    // Draw a single hexagon
    const r = 170;
    const center = [this.width / 2, this.height / 2];
    // svg
    //   .append("polygon")
    //   .attr("class", "hex")
    //   .attr(
    //     "points",
    //     hexagonPoints(center[0], center[1], r)
    //       .map((p) => p.join(","))
    //       .join(" "),
    //   );

    // (Optional) draw a small grid of hexagons to show spacing
    const rowSpacing = r / 2; // vertical spacing
    const colSpacing = r / 2; // horizontal spacing for flat-topped grid

    const cols = 6;
    const rows = 5;
    const gridGroup = svg.append("g").attr("opacity", 1);

    const map = [
      {
        title: "STU-46 Render chart and edit progress",
      },
      {
        title: "STU-47 Edit chart table data",
      },
      {
        title: "STU-48 Update chart history",
      },
      {
        title: "STU-50 Extract tetra module",
      },
      {
        title: "STU-51 Extract tri module",
      },
      {
        title: "STU-52 Follow-up chart legend and labels",
      },
      {
        title: "STU-53 Navigation for iteration weekdays",
      },
      {
        title: "FIN-2 Kaufzahlung bookings",
      },
      {
        title: "FIN-3 Mietzahlung bookings",
      },
      {
        title: "FIN-4 Rückkaufzahlung bookings",
      },
    ];

    let textIndex = 0;
    d3.range(rows).forEach((row) => {
      d3.range(cols).forEach((col, index) => {
        const cx = 74 + col * colSpacing * 1.3;
        const cy = 54 + row * rowSpacing + (((index + 1) % 2) * rowSpacing) / 2;
        gridGroup
          .append("polygon")
          .attr("class", "hex")
          .attr("fill", this.styles.fillPrimary)
          .attr("stroke", this.styles.strokePrimary)
          .attr("stroke-width", 2)
          .attr(
            "points",
            hexagonPoints(cx, cy, r / 2)
              .map((p) => p.join(","))
              .join(" "),
          );

        const text = map[textIndex % map.length].title;
        const fontSize = 14;

        gridGroup
          .append("text")
          .attr("x", cx)
          .attr("y", cy)
          .attr("dy", -fontSize)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", fontSize)
          .attr("fill", "black")
          .text(text.split(" ").slice(0, 1).join(" "));
        gridGroup
          .append("text")
          .attr("x", cx)
          .attr("y", cy)
          .attr("dy", 0)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", fontSize)
          .attr("fill", "black")
          .text(text.split(" ").slice(1, 2).join(" "));
        gridGroup
          .append("text")
          .attr("x", cx)
          .attr("y", cy)
          .attr("dy", fontSize)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", fontSize)
          .attr("fill", "black")
          .text(text.split(" ").slice(2, 4).join(" "));
        gridGroup
          .append("text")
          .attr("x", cx)
          .attr("y", cy)
          .attr("dy", fontSize * 2)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", fontSize)
          .attr("fill", "black")
          .text(text.split(" ").slice(4).join(" "));

        textIndex += 1;
      });
    });

    const text = svg
      .append("text")
      .attr("x", 200) // center horizontally
      .attr("y", 200 - 20) // slight upward shift
      .attr("dy", "0em")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "white");
    // .text("This is a long label that should wrap inside the hexagon.");

    // Wrap text to fit within hexagon width (leave padding)
    wrapTextCanvas(text, this.width * 0.8, "12px", "sans-serif");
  }
}
