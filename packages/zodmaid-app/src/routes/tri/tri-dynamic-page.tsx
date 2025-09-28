import { Fragment, type CSSProperties } from "react";
import { useLocation, useNavigate, type RouteObject } from "react-router";
import { BaseGridView, defineGridContext, type BaseCellProps, type GridContextProps } from "zodspy";
import { TriCell } from "zodspy/components/tri-cell";
import { TriGrid } from "zodspy/components/tri-grid";
import { TriRow } from "zodspy/components/tri-row";
import { TriBulletButton } from "zodspy/components/tri/tri-bullet-button";
import { TriCellContext } from "zodspy/components/tri/tri-cell-context";
import { TriCellRenderer } from "zodspy/components/tri/tri-cell-renderer";
import { type TriItem } from "zodspy/components/tri/tri-data-model";
import {
  iconAt,
  iconCheck,
  iconCode,
  iconCursorText,
  iconHash,
} from "zodspy/components/tri/tri-icons";
import { items } from "zodspy/examples/tri-schema-items";
import { classNames } from "../../helpers/clsx";
import { throwError } from "../../helpers/error";
import { useDocumentTitle } from "../../helpers/react";
import { routes } from "../routes";

const toPaths = (routes: RouteObject[]) => {
  const paths = [];
  for (const route of routes) {
    const subRoutes = route.children ?? [];
    for (const subRoute of subRoutes) {
      const path = route.path + "/" + subRoute.path;
      paths.push(path);
    }
  }
  return paths;
};

const RoutesPathNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paths = toPaths(routes);
  const onSelectChange = (value: string) => {
    navigate(value);
  };

  return (
    <div className="-mt-4 pb-4">
      <select
        className="appearance-none cursor-pointer text-(--fg-accent) text-sm"
        value={location.pathname}
        onChange={(event) => {
          onSelectChange(event.target.value);
        }}
      >
        {paths.map((path) => (
          <option key={path} value={path}>
            {path}
          </option>
        ))}
      </select>
    </div>
  );
};

export const TriDynamicPage = () => {
  useDocumentTitle("tri: grid view dynamic");
  const rows: TriItem[] = items;

  return (
    <div
      className={classNames(
        "h-dvh p-8 bg-(--bg-base) text-(--fg-base)",
        "[scrollbar-color:var(--border-base)_var(--bg-base)]",
        "overflow-auto overscroll-contain",
        [
          "[--bg-base:var(--color-zinc-900)]",
          "[--border-base:var(--color-zinc-700)]",
          "[--fg-base:var(--color-zinc-300)]",
          "[--fg-accent:var(--color-blue-500)]",
        ],
      )}
    >
      <RoutesPathNav />
      <TriTheme>
        <TriGridView value={rows} />
      </TriTheme>
    </div>
  );
};

export const TriGridView = (gridProps: { value: TriItem[] }) => {
  const context = defineGridContext<TriItem>({
    rows: gridProps.value,
    columns: [
      {
        label: "item",
        width: "minmax(200px, max-content)",
        cellRenderer(props) {
          const row = props.data.row ?? throwError("row is undefined");
          return <TriColumnItem item={row} />;
        },
      },
      {
        label: "items",
        width: "1fr",
        cellRenderer(props) {
          const row = props.data.row ?? throwError("row is undefined");
          return <TriColumnItems item={row} />;
        },
      },
    ],
    elements: {
      Grid(props) {
        return <TriGrid {...props} className="w-full" />;
      },
      Row(props) {
        return <TriRow {...props} className="grid grid-cols-subgrid grid-flow-col col-span-full" />;
      },
      Cell(props) {
        const row = props.data.row ?? throwError("row is undefined");
        row.type = row.type ?? "plain";
        row.view = row.view ?? "list";
        const style = { ...props.style };
        if (row.view === "list" && props.data.columnIndex === 0) {
          style.gridColumn = props.data.columnIndex + 1;
          style.gridColumnEnd = -1;
        }
        if (row.view === "list" && props.data.columnIndex === 1) {
          return <Fragment />;
        }

        return (
          <TriCellContext value={{ cellProps: props as BaseCellProps }}>
            <TriCell {...props} className="relative grid cursor-auto text-nowrap" style={style}>
              <TriCellRenderer />
            </TriCell>
          </TriCellContext>
        );
      },
    },
  });

  return <BaseGridView context={context as GridContextProps} />;
};

type TriItemProps = {
  item: TriItem;
  isNested?: boolean; // is items nested or is items inline
};

const TriItem = (props: TriItemProps) => {
  const item = props.item;
  return <div>tri item</div>;
};

type TriItemListProps = {
  items: TriItem[];
};

const TriItemList = (props: TriItemListProps) => {
  return <div>tri item list</div>;
};

const TriColumnItem = (props: { item: TriItem }) => {
  const title = props.item.title;
  const description = props.item.description;
  const type = props.item.type;
  const view = props.item.view;
  const tags = props.item.tags ?? [];
  const items = props.item.items;
  const isFolded = props.item.isFolded ?? false;
  const isReference = props.item.isReference ?? false;
  const hasTags = tags.length > 0;
  const hasTitle = title.trim() !== "";

  return (
    <TriNodeList>
      <TriNode isSelected={true} isField={false}>
        <div className="flex items-center h-(--text-line-height)">
          {type === "plain" && (
            <TriBulletButton
              variant="point"
              color={!hasTitle ? "gray" : hasTags ? "cyan" : undefined}
              hasOutline={isFolded}
              hasOutlineBorder={isReference}
            />
          )}
          {type === "field:plain" && (
            <TriBulletButton variant="field" color={true ? "cyan" : undefined}>
              <TriBulletIcon iconSlot={iconCursorText} style={{ marginLeft: "-3px" }} />
            </TriBulletButton>
          )}
          {type === "field:tag" && (
            <TriBulletButton variant="field" color={true ? "cyan" : undefined}>
              <TriBulletIcon iconSlot={iconHash} />
            </TriBulletButton>
          )}
          {type === "field:email" && (
            <TriBulletButton variant="field" color={true ? "cyan" : undefined}>
              <TriBulletIcon iconSlot={iconAt} />
            </TriBulletButton>
          )}
          {type === "field:bool" && (
            <TriBulletButton variant="field" color={true ? "cyan" : undefined}>
              <TriBulletIcon iconSlot={iconCheck} />
            </TriBulletButton>
          )}
          {type === "field:code" && (
            <TriBulletButton variant="field" color={true ? "cyan" : undefined}>
              <TriBulletIcon iconSlot={iconCode} />
            </TriBulletButton>
          )}
        </div>
        <div className="flex flex-col">
          <span className={classNames("text-nowrap", !hasTitle && "text-zinc-500")}>
            {title === "" ? "Empty" : title}
          </span>
          {description && (
            <span className="text-nowrap text-[14px]/[20px] text-zinc-500">{description}</span>
          )}
        </div>
        {tags?.map((tag) => (
          <div key={tag.title} className="flex items-center h-(--text-line-height)">
            <TriBulletButton
              variant="action"
              textSlot={tag.title}
              hasOutline
              color={hasTags ? "cyan" : undefined}
            >
              <TriBulletIcon iconSlot={iconHash} />
            </TriBulletButton>
          </div>
        ))}
      </TriNode>
      {view === "list" && items && items.length > 0 && (
        <TriNodeItems>
          <TriGridView value={items} />
        </TriNodeItems>
      )}
    </TriNodeList>
  );
};

const TriColumnItems = (props: { item: TriItem }) => {
  const items = props.item.items ?? [];

  return (
    items.length > 0 && (
      <div
        className={classNames(
          "grid",
          props.item.type === "field:code" &&
            "font-mono [&_span]:bg-zinc-800 [&_span]:text-amber-500 [&_span]:rounded-sm [&_span]:px-1",
        )}
      >
        <TriGridView value={items} />
      </div>
    )
  );
};

export const TriTheme = (props: { children?: React.ReactNode }) => {
  const style = {
    "--text-font-size": "15px",
    "--text-line-height": "21px",
    "--bullet-size": "17px",
    "--bullet-field-size": "12px",
    "--bullet-icon-size": "12px",
    "--bullet-point-size": "7px",
  } as CSSProperties;
  const colors = {
    "--color-zinc-750": "color-mix(in oklch, var(--color-zinc-700), var(--color-zinc-800))",
  } as CSSProperties;

  return (
    <div
      className="font-sans text-(size:--text-font-size)/(--text-line-height)"
      style={{ ...style, ...colors }}
    >
      {props.children}
    </div>
  );
};

export const TriNodeList = (props: { children?: React.ReactNode; isField?: boolean }) => {
  return <div className="flex flex-col">{props.children}</div>;
};

export const TriNode = (props: {
  children?: React.ReactNode;
  isSelected?: boolean;
  isField?: boolean;
}) => {
  return (
    <div
      className={classNames(
        "relative flex items-start gap-2 py-[3px] h-full",
        props.isField && "border-b border-(--color-zinc-750)",
      )}
    >
      {props.children}
      <div
        className={classNames(
          "absolute inset-0 my-0.5 -ml-0.5 mr-1.5 pointer-events-none",
          props.isSelected && "bg-blue-500/20 outline-blue-500/50 outline rounded-sm",
        )}
      ></div>
    </div>
  );
};

export const TriNodeItems = (props: { children?: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col gap-1.5 pl-[calc(var(--bullet-size)*2)]">
      <div className="absolute left-0 top-0 bottom-0 w-(--bullet-size) h-full flex justify-center">
        <button className="w-[1px] h-full rounded-[4px] bg-(--color-zinc-750)"></button>
      </div>
      {props.children}
    </div>
  );
};

export const TriBulletIcon = (props: { iconSlot?: React.ReactNode; style?: CSSProperties }) => {
  return (
    <span
      className="flex size-(--bullet-icon-size) items-center justify-center"
      style={props.style}
    >
      {props.iconSlot}
    </span>
  );
};
