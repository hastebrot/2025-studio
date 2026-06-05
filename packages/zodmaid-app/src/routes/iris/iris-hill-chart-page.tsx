import { useEffect, useRef } from "react";
import { HillChart, type HillChartData } from "../../components/iris-hill-chart";
import { useDocumentTitle } from "../../helpers/react";

export const IrisHillChartPage = () => {
  useDocumentTitle("iris: hill chart");
  const data = {
    title: "Benjamin G.",
    description: "18-Aug-25 at 12:45",
    items: [
      {
        title: "STU-46 Render chart and edit progress",
        color: hashStringToColor("Hill charts"),
        progressX: 50,
      },
      {
        title: "STU-47 Edit chart table data",
        color: hashStringToColor("Hill charts"),
        progressX: 30,
      },
      {
        title: "STU-48 Update chart history",
        color: hashStringToColor("Hill charts"),
        progressX: 30,
      },
      {
        title: "STU-50 Extract tetra module",
        color: hashStringToColor("Modules"),
        progressX: 40,
      },
      {
        title: "STU-51 Extract tri module",
        color: hashStringToColor("Modules"),
        progressX: 65,
      },
      {
        title: "STU-52 Follow-up chart legend and labels",
        color: hashStringToColor("Hill charts"),
        progressX: 0,
      },
      {
        title: "STU-53 Navigation for iteration weekdays",
        color: hashStringToColor("Hill charts"),
        progressX: 0,
      },
      {
        title: "FIN-2 Kaufzahlung bookings",
        color: hashStringToColor("first-contract", "yellow"),
        progressX: 0,
      },
      {
        title: "FIN-3 Mietzahlung bookings",
        color: hashStringToColor("first-contract", "yellow"),
        progressX: 0,
      },
      {
        title: "FIN-4 Rückkaufzahlung bookings",
        color: hashStringToColor("first-contract", "yellow"),
        progressX: 0,
      },
    ],
    // title: "John D.",
    // description: "11-Aug-25 at 15:30",
    // items: [
    //   { title: randWords(), color: "orange", progressX: 0 },
    //   { title: randWords(), color: "orange", progressX: 0 },
    //   { title: randWords(), color: "orange", progressX: 20 },
    //   { title: randWords(), color: "red", progressX: 40 },
    //   { title: randWords(), color: "red", progressX: 50 },
    //   { title: randWords(), color: "red", progressX: 50 },
    //   { title: randWords(), color: "blue", progressXx: 70 },
    //   { title: randWords(), color: "green", progressX: 70 },
    //   { title: randWords(), color: "green", progressX: 70 },
    //   { title: randWords(), color: "cyan", progressX: 80 },
    //   { title: randWords(), color: "cyan", progressX: 80 },
    //   { title: randWords(), color: "blue", progressX: 100 },
    //   { title: randWords(), color: "blue", progressX: 100 },
    //   { title: randWords(), color: "blue", progressX: 100 },
    // ],
  };

  return (
    <div className="m-4 p-4 w-fit border-2 border-[#aaa]">
      <IrisHillChart data={data} width={700} height={350} />
    </div>
  );
};

export type IrisHillChartProps = {
  data: HillChartData;
  width?: number;
  height?: number;
};

export const IrisHillChart = (props: IrisHillChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const render = () => {
    if (!ref.current) return;
    const width = props.width ?? ref.current.clientWidth;
    const height = props.height ?? ref.current.clientHeight;
    const svg = new HillChart().render(props.data, width, height);
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
  }, [props.data, props.height]);

  return <div ref={ref}></div>;
};

export const randWords = (minWords = 2, maxWords = 5) => {
  // prettier-ignore
  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod",
    "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim",
    "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  ];
  const pickItem = (items: string[]) => {
    return items[Math.floor(Math.random() * items.length)];
  };
  const generateLorem = (count: number) => {
    return Array.from({ length: count }, () => pickItem(loremWords)).join(" ");
  };
  const randNumber = (minNumber: number, maxNumber: number) => {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  };
  return generateLorem(randNumber(minWords, maxWords));
};

const sdbmHash = (input: string): number => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = input.charCodeAt(index) + (hash << 6) + (hash << 16) - hash;
  }
  return hash >>> 0;
};

export const hashStringToColor = (input: string, defaultColor?: string) => {
  // prettier-ignore
  const rainbowColors = [
    "red", "orange", "yellow", "green", "blue", "indigo", "violet",
    "cyan", "magenta",
  ];
  const hash = Math.abs(sdbmHash(input));
  return defaultColor ?? rainbowColors[hash % rainbowColors.length];
};
