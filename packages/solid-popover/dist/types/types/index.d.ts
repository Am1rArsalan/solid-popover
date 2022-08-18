import { JSX } from "solid-js/jsx-runtime";
export declare type ContentLocation = {
    top: number;
    left: number;
};
export declare type BoundaryViolations = {
    top: number;
    left: number;
    right: number;
    bottom: number;
};
export declare type PopoverState = {
    childRect: ClientRect;
    popoverRect: ClientRect;
    parentRect: ClientRect;
    boundaryRect: ClientRect;
    position?: PopoverPosition;
    align?: PopoverAlign;
    spacing: number;
    nudgedLeft: number;
    nudgedTop: number;
    boundaryInset: number;
    violations: BoundaryViolations;
    hasViolations: boolean;
};
export declare type ContentRenderer = (popoverState: PopoverState) => JSX.Element;
export declare type ContentLocationGetter = (popoverState: PopoverState) => ContentLocation;
export declare type PopoverPosition = "left" | "right" | "top" | "bottom";
export declare type PopoverAlign = "start" | "center" | "end";
export declare type UseArrowContainerProps = {
    childRect: ClientRect;
    popoverRect: ClientRect;
    position?: PopoverPosition;
    arrowSize: number;
    arrowColor: string;
};
export declare type ArrowContainerProps = UseArrowContainerProps & {
    children: JSX.Element;
    className?: string;
    style?: JSX.CSSProperties;
    arrowStyle?: JSX.CSSProperties;
    arrowClassName?: string;
};
export declare type PopoverProps = {
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
    spacing?: number;
};
export declare type PositionPopoverProps = {
    positionIndex?: number;
    childRect?: DOMRect;
    parentRect?: DOMRect;
    boundaryRect: DOMRect;
    contentLocation?: ContentLocationGetter | ContentLocation;
};
export declare type GetNewPopoverRectProps = {
    position: PopoverPosition;
    reposition: boolean;
    align: PopoverAlign;
    childRect: ClientRect;
    popoverRect: ClientRect;
    boundaryRect: ClientRect;
    spacing: number;
};
export declare type PositionPopover = (props?: PositionPopoverProps) => void;
