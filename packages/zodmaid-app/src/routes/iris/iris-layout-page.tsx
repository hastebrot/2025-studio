import { type CSSProperties } from "react";
import { IrisIcon } from "../../components/iris-icon";
import { classNames } from "../../helpers/clsx";
import { useDocumentTitle } from "../../helpers/react";

export const IrisLayoutPage = () => {
  useDocumentTitle("iris: layout");

  return (
    <Theme theme="light">
      <div
        className={classNames(
          "h-dvh overscroll-contain overflow-auto",
          "bg-(--bg-base) text-(--fg-base) border-(--border-base)",
          "[scrollbar-color:var(--border-base)_var(--bg-base)]",
        )}
      >
        <div className="grid grid-cols-[auto_1fr_auto] h-full">
          <Theme theme="light">
            <div className="flex flex-col w-[240px] bg-(--bg-base) border-r border-(--border-base)">
              <div className="p-[14px] pr-[8px] flex items-center text-sm gap-2">
                <div className="w-[18px] h-[18px] text-(--fg-base) bg-(--bg-layer-active) rounded-sm flex items-center justify-center font-bold text-xs">
                  W
                </div>
                <div className="text-(--fg-base)">Workspace</div>
                <IrisIcon name="selector" variant="outlined" height={18} strokeWidth={2} />
                <div className="ml-auto flex items-center justify-center size-[30px]">
                  <IrisIcon name="layout-sidebar" variant="outlined" height={18} strokeWidth={2} />
                </div>
              </div>
              <div className="p-[8px] flex items-center">
                <div className="text-(--fg-base)">text base</div>
                <div
                  className={classNames(
                    "ml-auto border border-(--border-base) rounded-md flex items-center justify-center size-[30px]",
                    "hover:bg-(--bg-layer-active) hover:border-(--border-active) cursor-pointer",
                  )}
                >
                  <IrisIcon name="plus" variant="outlined" height={18} strokeWidth={2} />
                </div>
              </div>
              <hr className="h-px w-full bg-(--border-base) border-none" />
              <div className="flex px-[8px] mt-[8px]">
                <div className="h-[30px] w-full bg-(--bg-layer-active) rounded-md"></div>
              </div>
              <div className="flex px-[8px] mt-[8px]">
                <div className="h-[30px] w-full bg-(--bg-layer-active) rounded-md"></div>
              </div>
            </div>
          </Theme>
          <div className="flex flex-col bg-(--bg-layer)">
            <div className="px-[14px] flex items-center h-[44px]">
              <div className="flex items-center justify-center size-[30px]">
                <IrisIcon name="layout-sidebar" variant="outlined" height={18} strokeWidth={2} />
              </div>
              <div className="flex items-center justify-center size-[30px]">
                <IrisIcon name="arrow-left" variant="outlined" height={18} strokeWidth={2} />
              </div>
              <div className="flex items-center justify-center size-[30px]">
                <IrisIcon name="arrow-right" variant="outlined" height={18} strokeWidth={2} />
              </div>
              <div className="text-(--fg-base)">text base</div>
              <div className="ml-auto flex items-center justify-center size-[30px] text-(--fg-accent)">
                <IrisIcon name="stack-2" variant="outlined" height={18} strokeWidth={2} />
              </div>
              <div className="flex items-center justify-center size-[30px]">
                <IrisIcon name="calendar-week" variant="outlined" height={18} strokeWidth={2} />
              </div>
              <div className="flex items-center justify-center size-[30px]">
                <IrisIcon name="books" variant="outlined" height={18} strokeWidth={2} />
              </div>
              <div className="flex items-center justify-center size-[30px]">
                <IrisIcon name="dots" variant="outlined" height={18} strokeWidth={2} />
              </div>
            </div>
            <div className="px-[14px]">
              <div className="text-(--fg-base)">text base</div>
              <div className="text-(--fg-subtle)">text subtle</div>
              <div className="text-(--fg-muted)">text muted</div>
              <div className="my-4 p-4 rounded-sm shadow-sm bg-white">panel</div>
            </div>
          </div>
          <div className="p-8 bg-(--bg-base) border-l border-(--border-base)">
            <div className="text-(--fg-base)">text base</div>
            <div className="text-(--fg-subtle)">text subtle</div>
            <div className="text-(--fg-muted)">text muted</div>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export const Theme = (props: { children?: React.ReactNode; theme: "light" | "dark" }) => {
  const style = {
    "--text-font-size": "15px",
    "--text-line-height": "21px",
  } as CSSProperties;
  const lightMode = {
    "--bg-base": "var(--color-white)",
    "--bg-layer": "var(--color-zinc-100)",
    "--bg-layer-active": "var(--color-zinc-200)",
    "--fg-base": "var(--color-zinc-800)",
    "--fg-subtle": "var(--color-zinc-600)",
    "--fg-muted": "var(--color-zinc-400)",
    "--border-base": "var(--color-zinc-200)",
    "--border-active": "var(--color-zinc-300)",
    "--fg-accent": "var(--color-blue-500)",
    "--bg-accent": "var(--color-blue-100)",
    "--bg-highlight": "var(--color-yellow-100)",
    "--border-highlight": "var(--color-yellow-400)",
  } as CSSProperties;
  const darkMode = {
    "--bg-base": "var(--color-neutral-900)",
    "--bg-layer": "var(--color-neutral-800)",
    "--bg-layer-active": "var(--color-neutral-700)",
    "--fg-base": "var(--color-neutral-200)",
    "--fg-subtle": "var(--color-neutral-400)",
    "--fg-muted": "var(--color-neutral-500)",
    "--border-base": "var(--color-neutral-700)",
    "--border-active": "var(--color-neutral-600)",
    "--fg-accent": "var(--color-sky-300)",
    "--bg-accent": "var(--color-slate-700)",
    "--bg-highlight": "var(--color-yellow-100)",
    "--border-highlight": "var(--color-yellow-400)",
  } as CSSProperties;
  return (
    <div
      className="font-sans text-(size:--text-font-size)/(--text-line-height) grid"
      style={{ ...style, ...(props.theme === "light" ? lightMode : darkMode) }}
      data-theme={props.theme}
    >
      {props.children}
    </div>
  );
};
