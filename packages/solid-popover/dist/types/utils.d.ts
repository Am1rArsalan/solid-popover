import { GetNewPopoverRectProps, PopoverAlign, PopoverPosition } from "./types";
export declare function createContainer(containerStyle?: Partial<CSSStyleDeclaration>, containerClassName?: string): HTMLDivElement;
export declare function rectsAreEqual(rectA: DOMRect, rectB: DOMRect): boolean;
export declare function popoverRectForPosition(position: PopoverPosition, childRect: DOMRect, popoverRect: DOMRect, spacing: number, align: PopoverAlign): {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
};
export declare function getNewPopoverRect({ position, align, childRect, popoverRect, boundaryRect, spacing, reposition, }: GetNewPopoverRectProps, boundaryInset: number): {
    readonly rect: {
        top: number;
        left: number;
        width: number;
        height: number;
        right: number;
        bottom: number;
    };
    readonly boundaryViolation: boolean;
};
export declare const getNudgedPopoverRect: (popoverRect: DOMRect, boundaryRect: DOMRect, boundaryInset: number) => {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
};
