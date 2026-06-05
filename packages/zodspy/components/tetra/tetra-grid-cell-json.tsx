import { useEffect, useState } from "react";
import { determineJsonType, TetraJsonTypeButton } from "zodspy";

export function renderCell<DataModel>(item?: DataModel, key?: string) {
  if (item == null || key == null) return null;
  const value = item[key as keyof DataModel];
  const type = determineJsonType(value);
  const text = type === "array" || type === "object" ? JSON.stringify(value) : String(value);
  const [textValue, setTextValue] = useState(text);
  useEffect(() => {
    console.log("text value:", textValue);
  }, [textValue]);
  const onKeyCommand = (event: React.KeyboardEvent<HTMLElement>) => {
    console.log("key command:", event.key, event);
  };
  return (
    <div className="flex items-center">
      <TetraJsonTypeButton type={type} />
      <div className="pr-1 w-full">
        {textValue}
        {/* <IrisInput
          className={classNames("outline-none", "box-content min-w-full min-h-lh")}
          placeholder="Empty"
          value={textValue}
          onValueChange={setTextValue}
          onKeyCommand={onKeyCommand}
        /> */}
        {/* <IrisTextarea
          className={classNames(
            "outline-2 -outline-offset-1 outline-zinc-500 focus:outline-(--cell-outline-selected)",
            "box-content min-w-full min-h-lh",
            "resize-none whitespace-pre overflow-hidden",
          )}
          placeholder="Empty"
          value={textValue}
          onValueChange={setTextValue}
          onKeyCommand={onKeyCommand}
        /> */}
      </div>
    </div>
  );
}

export const FoldedValue = (props: { value: any }) => {
  return (
    <div className="relative w-full h-[24px] min-w-[300px] overflow-hidden">
      <div className="absolute inset-0 px-1 w-full truncate text-(--cell-fg-muted)">
        {JSON.stringify(props.value, null, 1).slice(0, 1000)}
      </div>
    </div>
  );
};
