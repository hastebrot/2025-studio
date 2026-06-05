import * as d3 from "d3";
import { z } from "zod/v4";
import { throwError } from "../helpers/error";

export type HillChartItem = z.infer<typeof HillChartItem>;
export const HillChartItem = z.object({
  title: z.string(),
  color: z.string().optional().default("gray"),
  sizeXY: z.number().optional().default(10),
  progressX: z.number().optional().default(0),
  stackY: z.number().optional().default(0),
  alignX: z.number().optional().default(1),
});

export type HillChartData = {
  title: string;
  description: string;
  items: z.input<typeof HillChartItem>[];
};

type SvgSelection<Datum = undefined> = d3.Selection<SVGSVGElement, Datum, null, undefined>;
type HillCoordinate = { x: number; y: number };

export class HillChart {
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

  items: HillChartItem[] = [];
  itemOffsetTop: number = 0;

  xScale: d3.ScaleLinear<number, number> = d3.scaleLinear();
  yScale: d3.ScaleLinear<number, number> = d3.scaleLinear();
  hillMapToY: (x: number) => number = () => 0;
  hillData: HillCoordinate[] = [];
  hillLine: d3.Line<HillCoordinate> = d3.line();

  render(data: HillChartData, width: number, height: number) {
    this.width = width;
    this.height = height;
    const svg = d3
      .create("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox", [0, 0, width, height].join(" "))
      .attr("width", width)
      .attr("height", height);
    this.renderMeta(svg, data.title, data.description);
    this.renderChart(svg, data.items as HillChartItem[]);
    svg.style("transform", "translateY(0px)");
    // .style("border", `2px solid ${this.styles.strokePrimary}`);
    return svg.node() ?? throwError("svg selection is empty");
  }

  renderChart(svg: SvgSelection, items: HillChartItem[]) {
    this.setupItems(items);
    this.setupScales();
    this.setupHill();
    this.renderBase(svg);
    this.renderData(svg);
  }

  setupItems(items: HillChartItem[]) {
    const signumX = (d: HillChartItem) => {
      if (d.progressX >= 0 && d.progressX < 25) return 1;
      if (d.progressX >= 25 && d.progressX < 50) return 1;
      if (d.progressX >= 50 && d.progressX < 75) return 1;
      if (d.progressX >= 75 && d.progressX <= 100) return -1;
      throw new Error("d.progressX is out of bounds");
    };
    const toPastelColor = (colorSpecifier: string) => {
      const color = d3.hsl(colorSpecifier);
      color.s = 0.6; // Reduce saturation (0 = gray, 1 = full color).
      color.l = 0.6; // Increase lightness (0 = black, 1 = white).
      return color.toString();
    };
    items = HillChartItem.array().parse(items);
    items = items.map((it) => {
      it.progressX = clampToLimits(it.progressX, 0, 100);
      it.progressX = roundToNearestFactor(it.progressX, 5);
      return it;
    });
    items = items
      .sort((it, other) => it.title.localeCompare(other.title))
      .sort((it, other) => it.progressX - other.progressX);
    const dyMap = new Map<number, number>();
    items = items.map((it) => {
      const dy = dyMap.get(it.progressX);
      it.stackY = dy !== undefined ? dy + 1 : 0;
      dyMap.set(it.progressX, it.stackY);
      it.sizeXY = 10;
      it.alignX = signumX(it);
      it.color = toPastelColor(it.color);
      return it;
    });
    const dy = dyMap.get(50);
    this.itemOffsetTop = dy !== undefined ? dy * this.styles.lineHeight : 0;
    this.items = items;
  }

  setupScales() {
    const paddingX = 10;
    const paddingTop = 10 + this.itemOffsetTop;
    const paddingBottom = 40;
    this.xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([paddingX, this.width - paddingX]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([this.height - paddingBottom, paddingTop]);
  }

  setupHill() {
    // const easeLinearInOut = (x: number) => 1 - 2 * Math.abs(x - 0.5);
    // this.hillMapToY = (x: number) => easeLinearInOut(x / 100) * 100;
    this.hillMapToY = (x: number) => d3.easeSinInOut((x * 2) / 100) * 100;
    this.hillData = d3
      .range(0, 100, 0.1)
      .map<HillCoordinate>((x) => ({ x, y: this.hillMapToY(x) }));
    this.hillLine = d3
      .line<HillCoordinate>()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y));
  }

  renderMeta(svg: SvgSelection, title: string, description: string) {
    const group = svg.append("g").attr("class", "meta");
    group
      .append("text")
      .style("font-family", this.styles.fontFamily)
      .style("font-size", `${this.styles.fontSize}px`)
      .style("font-weight", 600)
      .attr("y", this.styles.lineHeight * 0)
      .attr("dominant-baseline", "middle")
      .attr("dy", "0.5em")
      .attr("fill", this.styles.textPrimary)
      .text(title);
    group
      .append("text")
      .style("font-family", this.styles.fontFamily)
      .style("font-size", `${this.styles.fontSize}px`)
      .attr("y", this.styles.lineHeight * 1)
      .attr("dominant-baseline", "middle")
      .attr("dy", "0.5em")
      .attr("fill", this.styles.textPrimary)
      .text(description);
    group;
  }

  renderBase(svg: SvgSelection) {
    svg.selectAll(".base").remove();
    const group = svg.append("g").attr("class", "base");
    group
      .append("path")
      .attr("class", "hill-line")
      .datum(this.hillData)
      .attr("d", this.hillLine)
      .attr("fill", "none")
      .attr("stroke", this.styles.strokePrimary)
      .attr("stroke-width", 2);
    group
      .append("line")
      .attr("class", "hill-y")
      .attr("x1", this.xScale(50))
      .attr("y1", this.yScale(0))
      .attr("x2", this.xScale(50))
      .attr("y2", this.yScale(100))
      .attr("stroke", this.styles.strokeSecondary)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "2,3");
    group
      .append("line")
      .attr("class", "hill-x")
      .attr("x1", this.xScale(0))
      .attr("y1", this.yScale(-5))
      .attr("x2", this.xScale(100))
      .attr("y2", this.yScale(-5))
      .attr("stroke", this.styles.strokeSecondary)
      .attr("stroke-width", 1.5);
    group
      .append("text")
      .attr("class", "hill-text")
      .style("font-family", this.styles.fontFamily)
      .style("font-size", `${this.styles.fontSize}px`)
      .style("text-transform", "uppercase")
      .attr("y", this.height - 5)
      .attr("dx", "25%")
      .attr("text-anchor", "middle")
      .attr("fill", this.styles.textSecondary)
      .text("Figure things out");
    group
      .append("text")
      .attr("class", "hill-text")
      .style("font-family", this.styles.fontFamily)
      .style("font-size", `${this.styles.fontSize}px`)
      .style("text-transform", "uppercase")
      .attr("y", this.height - 5)
      .attr("dx", "75%")
      .attr("text-anchor", "middle")
      .attr("fill", this.styles.textSecondary)
      .text("Make it happen");
  }

  renderData(svg: SvgSelection) {
    svg.selectAll(".data").remove();
    const group = svg.selectAll(".data").data(this.items).enter().append("g");
    const dragHandler = this.createDragHandler<SVGGElement>(svg);
    group
      .attr("class", "data")
      .style("cursor", "pointer")
      .attr("transform", (d) => {
        const x = this.xScale(d.progressX);
        const y = this.yScale(this.hillMapToY(d.progressX));
        const dy = d.stackY ?? 0;
        return `translate(${x}, ${y - dy * this.styles.lineHeight})`;
      })
      .call((group) => dragHandler(group));
    group
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d) => d.sizeXY)
      .attr("fill", (d) => d.color)
      .attr("stroke", this.styles.fillPrimary)
      .attr("stroke-width", 2)
      .on("mouseover", function (_e, d) {
        const color = d3.color(d.color)?.darker(1) ?? throwError("no color");
        d3.select(this).attr("fill", color.toString());
      })
      .on("mouseout", function (_e, d) {
        const color = d3.color(d.color) ?? throwError("no color");
        d3.select(this).attr("fill", color.toString());
      });
    group
      .append("line")
      .attr("x1", (d) => 10 * d.alignX)
      .attr("y1", 0)
      .attr("x2", (d) => 20 * d.alignX)
      .attr("y2", 0)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 1.5);
    group
      .append("text")
      .style("font-family", this.styles.fontFamily)
      .style("font-size", `${this.styles.fontSize}px`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", (d) => (d.alignX === 1 ? "start" : "end"))
      .call((text) => {
        text
          .append("tspan")
          .attr("x", (d) => 22 * d.alignX)
          .attr("y", 5)
          .attr("stroke", this.styles.fillPrimary)
          .attr("stroke-width", 3)
          .text((d) => d.title);
        text
          .append("tspan")
          .attr("x", (d) => 22 * d.alignX)
          .attr("y", 5)
          .attr("fill", (d) =>
            d.progressX === 0 || d.progressX === 100
              ? this.styles.textSecondary
              : this.styles.textPrimary,
          )
          .text((d) => d.title);
      });
  }

  createDragHandler<T extends Element>(svg: SvgSelection) {
    const handleDrag = (
      elem: Element,
      e: d3.D3DragEvent<Element, HillChartItem, HillChartItem>,
    ) => {
      const x = e.subject.progressX + this.xScale.invert(this.xScale(0) + e.dx);
      e.subject.progressX = clampToLimits(x, 0, 100);
      d3.select(elem).attr(
        "transform",
        `translate(${this.xScale(e.subject.progressX)}, ${this.yScale(this.hillMapToY(e.subject.progressX))})`,
      );
    };
    const handleDragEnd = (
      _elem: Element,
      e: d3.D3DragEvent<Element, HillChartItem, HillChartItem>,
    ) => {
      const x = e.subject.progressX + this.xScale.invert(this.xScale(0) + e.dx);
      e.subject.progressX = clampToLimits(x, 0, 100);
      e.subject.progressX = roundToNearestFactor(e.subject.progressX, 5);
      this.renderChart(svg, this.items);
    };
    const dragHandler = d3
      .drag<T, HillChartItem>()
      .on("drag", function (e) {
        handleDrag(this, e);
      })
      .on("end", function (e) {
        handleDragEnd(this, e);
      });
    return dragHandler;
  }
}

export const clampToLimits = (value: number, minValue: number, maxValue: number) => {
  return Math.max(minValue, Math.min(maxValue, value));
};

export const roundToNearestFactor = (value: number, factor: number) => {
  return Math.round(value / factor) * factor;
};

export const createSvgElement = (width: number, height: number) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", [0, 0, width, height].join(" "));
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  return svg;
};
