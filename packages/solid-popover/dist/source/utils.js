export function createContainer(containerStyle, containerClassName) {
    const container = document.createElement("div");
    if (containerClassName)
        container.className = containerClassName;
    Object.assign(container.style, containerStyle);
    return container;
}
export function rectsAreEqual(rectA, rectB) {
    return (rectA === rectB ||
        (rectA?.bottom === rectB?.bottom &&
            rectA?.height === rectB?.height &&
            rectA?.left === rectB?.left &&
            rectA?.right === rectB?.right &&
            rectA?.top === rectB?.top &&
            rectA?.width === rectB?.width));
}
export function popoverRectForPosition(position, childRect, popoverRect, spacing, align) {
    const targetMidX = childRect.left + childRect.width / 2;
    const targetMidY = childRect.top + childRect.height / 2;
    const { width, height } = popoverRect;
    let top;
    let left;
    switch (position) {
        case "left":
            top = targetMidY - height / 2;
            left = childRect.left - spacing - width;
            if (align === "start") {
                top = childRect.top;
            }
            if (align === "end") {
                top = childRect.bottom - height;
            }
            break;
        case "bottom":
            top = childRect.bottom + spacing;
            left = targetMidX - width / 2;
            if (align === "start") {
                left = childRect.left;
            }
            if (align === "end") {
                left = childRect.right - width;
            }
            break;
        case "right":
            top = targetMidY - height / 2;
            left = childRect.right + spacing;
            if (align === "start") {
                top = childRect.top;
            }
            if (align === "end") {
                top = childRect.bottom - height;
            }
            break;
        default:
            top = childRect.top - height - spacing;
            left = targetMidX - width / 2;
            if (align === "start") {
                left = childRect.left;
            }
            if (align === "end") {
                left = childRect.right - width;
            }
            break;
    }
    return {
        top,
        left,
        width,
        height,
        right: left + width,
        bottom: top + height,
    };
}
export function getNewPopoverRect({ position, align, childRect, popoverRect, boundaryRect, spacing, reposition, }, boundaryInset) {
    const rect = popoverRectForPosition(position, childRect, popoverRect, spacing, align);
    const boundaryViolation = reposition &&
        ((position === "top" && rect.top < boundaryRect.top + boundaryInset) ||
            (position === "left" && rect.left < boundaryRect.left + boundaryInset) ||
            (position === "right" &&
                rect.right > boundaryRect.right - boundaryInset) ||
            (position === "bottom" &&
                rect.bottom > boundaryRect.bottom - boundaryInset));
    return {
        rect,
        boundaryViolation,
    };
}
export const getNudgedPopoverRect = (popoverRect, boundaryRect, boundaryInset) => {
    const topBoundary = boundaryRect.top + boundaryInset;
    const leftBoundary = boundaryRect.left + boundaryInset;
    const rightBoundary = boundaryRect.right - boundaryInset;
    const bottomBoundary = boundaryRect.bottom - boundaryInset;
    let top = popoverRect.top < topBoundary ? topBoundary : popoverRect.top;
    top =
        top + popoverRect.height > bottomBoundary
            ? bottomBoundary - popoverRect.height
            : top;
    let left = popoverRect.left < leftBoundary ? leftBoundary : popoverRect.left;
    left =
        left + popoverRect.width > rightBoundary
            ? rightBoundary - popoverRect.width
            : left;
    return {
        top,
        left,
        width: popoverRect.width,
        height: popoverRect.height,
        right: left + popoverRect.width,
        bottom: top + popoverRect.height,
    };
};
