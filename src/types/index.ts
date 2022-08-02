import { JSX } from "solid-js/jsx-runtime";

export type ContentLocation = {
  top: number;
  left: number;
};

export type BoundaryViolations = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type PopoverState = {
  childRect: ClientRect;
  popoverRect: ClientRect;
  parentRect: ClientRect;
  boundaryRect: ClientRect;
  position?: PopoverPosition;
  align?: PopoverAlign;
  padding: number;
  nudgedLeft: number;
  nudgedTop: number;
  boundaryInset: number;
  violations: BoundaryViolations;
  hasViolations: boolean;
};

export type ContentRenderer = (popoverState: PopoverState) => JSX.Element;
export type ContentLocationGetter = (
  popoverState: PopoverState
) => ContentLocation;

export type PopoverPosition = "left" | "right" | "top" | "bottom";
export type PopoverAlign = "start" | "center" | "end";

export type UseArrowContainerProps = {
  childRect: ClientRect;
  popoverRect: ClientRect;
  position?: PopoverPosition;
  arrowSize: number;
  arrowColor: string;
};

export type ArrowContainerProps = UseArrowContainerProps & {
  children: JSX.Element;
  className?: string;
  //style?: CSSProperties;
  //arrowStyle?: CSSProperties;
  arrowClassName?: string;
};

export type CreatePopover = {
  isOpen: boolean;
  childRef: HTMLElement | undefined;
  positions: PopoverPosition[];
  align: PopoverAlign;
  padding: number;
  reposition: boolean;
  boundaryInset: number;
  parentElement?: HTMLElement;
  boundaryElement?: HTMLElement;
  containerClassName?: string;
  contentLocation?: ContentLocationGetter | ContentLocation;
  onPositionPopover(popoverState: PopoverState): void;
};

export type PopoverProps = {
  isOpen: boolean;
  children: JSX.Element;
  content: ContentRenderer | JSX.Element;
  positions?: PopoverPosition[];
  align?: PopoverAlign;
  reposition?: boolean;
  ref?: HTMLElement;
  containerClassName?: string;
  parentElement?: HTMLElement;
  containerStyle?: Partial<CSSStyleDeclaration>;
  contentLocation?: ContentLocationGetter | ContentLocation;
  boundaryElement?: HTMLElement;
  boundaryInset?: number;
  boundaryTolerance?: number;
  onClickOutside?: (e: MouseEvent) => void;
  padding?: number;
};

export interface PositionPopoverProps {
  positionIndex?: number;
  childRect?: ClientRect;
  popoverRect?: ClientRect;
  parentRect?: ClientRect;
  scoutRect?: ClientRect;
  parentRectAdjusted?: ClientRect;
  boundaryRect?: ClientRect;
}

export type GetNewPopoverRectProps = {
  position: PopoverPosition;
  reposition: boolean;
  align: PopoverAlign;
  childRect: ClientRect;
  popoverRect: ClientRect;
  boundaryRect: ClientRect;
  padding: number;
};

export type PositionPopover = (props?: PositionPopoverProps) => void;

//export type PopoverRefs = {
//popoverRef: HTMLDivElement;
//scoutRef: HTMLDivElement;
//};

//export type UsePopoverResult = {
//positionPopover: PositionPopover;
//popoverRef: HTMLDivElement;
//scoutRef: MutableRefObject<HTMLDivElement>;
//};

//export interface UseArrowContainerResult {
//arrowStyle: CSSProperties;
//arrowContainerStyle: CSSProperties;
//}

//export const usePopover: (props: UsePopoverProps) => UsePopoverResult;
//export const useArrowContainer: (
//props: UseArrowContainerProps
//) => UseArrowContainerResult;

//export const Popover: Component<ParentProps<PopoverProps>>;
//export const ArrowContainer: FC<ArrowContainerProps>;
