import { Component, JSX, ParentProps, Show } from "solid-js";
import { ContentRenderer } from "./types";
import { Portal } from "solid-js/web";

export type PopoverProps = {
  isOpen: boolean;
  children: JSX.Element;
  content: ContentRenderer | JSX.Element;
  //positions?: PopoverPosition[];
  //align?: PopoverAlign;
  padding?: number;
  reposition?: boolean;
  ref?: HTMLElement;
  containerClassName?: string;
  parentElement?: HTMLElement;
  containerStyle?: Partial<CSSStyleDeclaration>;
  //contentLocation?: ContentLocationGetter | ContentLocation;
  boundaryElement?: HTMLElement;
  boundaryInset?: number;
  boundaryTolerance?: number;
  onClickOutside?: (e: MouseEvent) => void;
};

const PopoverPortal: Component<ParentProps> = ({ children }) => {
  return <Portal>{children}</Portal>;
};

export const Popover: Component<ParentProps<PopoverProps>> = ({
  children,
  isOpen,
  content,
}) => {
  return (
    <>
      {children}
      <Show when={isOpen}>
        <PopoverPortal
        //element={popoverRef.current}
        //scoutElement={scoutRef.current}
        //container={parentElement}
        >
          {typeof content !== "function" && content}
        </PopoverPortal>
      </Show>
    </>
  );
};

//<PopoverPortal
//element={popoverRef.current}
//scoutElement={scoutRef.current}
//container={parentElement}
//>
//{typeof content === "function" ? content(popoverState) : content}
//{children}
//</PopoverPortal>
