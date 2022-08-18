import { onCleanup, onMount, Show, children, createEffect, } from "solid-js";
import { createStore } from "solid-js/store";
import { createContainer, getNewPopoverRect, getNudgedPopoverRect, rectsAreEqual, } from "./utils";
import PopoverPortal from "./PopoverPortal";
import { Constants } from "./constants";
export function Popover(props) {
    let childRef;
    // previous popover state...
    let prevIsOpen = false;
    let prevPositions;
    let prevContentLocation;
    let prevReposition = props.reposition;
    const [popoverState, setPopoverState] = createStore({
        align: props.align,
        nudgedLeft: 0,
        nudgedTop: 0,
        position: props.positions.length > 0
            ? props.positions[0]
            : Constants.DEFAULT_POSITIONS[0],
        spacing: props.spacing,
        childRect: Constants.EMPTY_CLIENT_RECT,
        popoverRect: Constants.EMPTY_CLIENT_RECT,
        parentRect: Constants.EMPTY_CLIENT_RECT,
        boundaryRect: Constants.EMPTY_CLIENT_RECT,
        boundaryInset: props.boundaryInset,
        violations: Constants.EMPTY_CLIENT_RECT,
        hasViolations: false,
    });
    const popoverRef = createContainer({
        position: "fixed",
        overflow: "visible",
        top: "0px",
        left: "0px",
    }, props.containerClassName ? props.containerClassName : "solid-popover");
    const scoutRef = createContainer({
        position: "fixed",
        top: "0px",
        left: "0px",
        width: "0px",
        height: "0px",
        visibility: "hidden",
    }, "solid-tiny-popover-scout");
    function positionPopover({ contentLocation, positionIndex = 0, parentRect = props.parentElement.getBoundingClientRect(), childRect = childRef?.getBoundingClientRect(), boundaryRect = props.boundaryElement === props.parentElement
        ? parentRect
        : props.boundaryElement.getBoundingClientRect(), }) {
        let scoutRect = scoutRef?.getBoundingClientRect();
        let popoverRect = popoverRef.getBoundingClientRect();
        if (!childRect || !parentRect || !props.isOpen) {
            return;
        }
        if (contentLocation) {
            const { top: inputTop, left: inputLeft } = typeof contentLocation === "function"
                ? contentLocation({
                    childRect,
                    popoverRect,
                    parentRect,
                    boundaryRect,
                    spacing: props.spacing,
                    nudgedTop: 0,
                    nudgedLeft: 0,
                    boundaryInset: props.boundaryInset,
                    violations: Constants.EMPTY_CLIENT_RECT,
                    hasViolations: false,
                })
                : contentLocation;
            const left = parentRect.left + inputLeft;
            const top = parentRect.top + inputTop;
            popoverRef.style.transform = `translate(${left - scoutRect.left}px, ${top - scoutRect.top}px)`;
            setPopoverState({
                childRect,
                popoverRect,
                parentRect,
                boundaryRect,
                spacing: props.spacing,
                nudgedTop: 0,
                nudgedLeft: 0,
                boundaryInset: props.boundaryInset,
                violations: Constants.EMPTY_CLIENT_RECT,
                hasViolations: false,
            });
            return;
        }
        const isExhausted = positionIndex === props.positions.length;
        const position = isExhausted
            ? props.positions[0]
            : props.positions[positionIndex];
        const { rect, boundaryViolation } = getNewPopoverRect({
            childRect,
            popoverRect,
            boundaryRect,
            position,
            align: props.align,
            spacing: props.spacing,
            reposition: props.reposition,
        }, props.boundaryInset);
        if (boundaryViolation && props.reposition && !isExhausted) {
            positionPopover({
                positionIndex: positionIndex + 1,
                childRect,
                popoverRect,
                parentRect,
                boundaryRect,
            });
            return;
        }
        const { top, left, width, height } = rect;
        const shouldNudge = props.reposition && !isExhausted;
        const { left: nudgedLeft, top: nudgedTop } = getNudgedPopoverRect(rect, boundaryRect, props.boundaryInset);
        let finalTop = top;
        let finalLeft = left;
        if (shouldNudge) {
            finalTop = nudgedTop;
            finalLeft = nudgedLeft;
        }
        popoverRef.style.transform = `translate(${finalLeft - scoutRect.left}px, ${finalTop - scoutRect.top}px)`;
        const potentialViolations = {
            top: boundaryRect.top + props.boundaryInset - finalTop,
            left: boundaryRect.left + props.boundaryInset - finalLeft,
            right: finalLeft + width - boundaryRect.right + props.boundaryInset,
            bottom: finalTop + height - boundaryRect.bottom + props.boundaryInset,
        };
        setPopoverState({
            childRect,
            popoverRect: {
                top: finalTop,
                left: finalLeft,
                width,
                height,
                right: finalLeft + width,
                bottom: finalTop + height,
            },
            parentRect,
            boundaryRect,
            position,
            align: props.align,
            spacing: props.spacing,
            nudgedTop: nudgedTop - top,
            nudgedLeft: nudgedLeft - left,
            boundaryInset: props.boundaryInset,
            violations: {
                top: potentialViolations.top <= 0 ? 0 : potentialViolations.top,
                left: potentialViolations.left <= 0 ? 0 : potentialViolations.left,
                right: potentialViolations.right <= 0 ? 0 : potentialViolations.right,
                bottom: potentialViolations.bottom <= 0 ? 0 : potentialViolations.bottom,
            },
            hasViolations: potentialViolations.top > 0 ||
                potentialViolations.left > 0 ||
                potentialViolations.right > 0 ||
                potentialViolations.bottom > 0,
        });
    }
    function handleOnClickOutside(e) {
        if (props.isOpen && e.target.contains(popoverRef)) {
            props.onClickOutside?.(e);
        }
    }
    function handleWindowResize() {
        if (childRef) {
            const boundaryElement = props.boundaryElement
                ? props.boundaryElement
                : props.parentElement;
            requestAnimationFrame(() => positionPopover({
                contentLocation: props.contentLocation,
                childRect: childRef?.getBoundingClientRect(),
                parentRect: props.parentElement.getBoundingClientRect(),
                boundaryRect: props.boundaryElement === props.parentElement
                    ? props.parentElement.getBoundingClientRect()
                    : boundaryElement.getBoundingClientRect(),
            }));
        }
    }
    let shouldUpdate = true;
    function updatePopover() {
        const childRect = childRef?.getBoundingClientRect();
        const popoverRect = popoverRef?.getBoundingClientRect();
        if (childRect != null &&
            popoverRect != null &&
            (!rectsAreEqual(childRect, {
                top: popoverState.childRect.top,
                left: popoverState.childRect.left,
                width: popoverState.childRect.width,
                height: popoverState.childRect.height,
                bottom: popoverState.childRect.top + popoverState.childRect.height,
                right: popoverState.childRect.left + popoverState.childRect.width,
            }) ||
                popoverRect.width !== popoverState.popoverRect.width ||
                popoverRect.height !== popoverState.popoverRect.height ||
                popoverState.spacing !== props.spacing ||
                popoverState.align !== props.align ||
                props.positions !== prevPositions ||
                props.contentLocation !== prevContentLocation ||
                props.reposition !== prevReposition)) {
            const boundaryElement = props.boundaryElement
                ? props.boundaryElement
                : props.parentElement;
            positionPopover({
                contentLocation: props.contentLocation,
                childRect,
                parentRect: props.parentElement.getBoundingClientRect(),
                boundaryRect: props.boundaryElement === props.parentElement
                    ? props.parentElement.getBoundingClientRect()
                    : boundaryElement.getBoundingClientRect(),
            });
        }
        // TODO: factor prev checks out into the custom prev....s hook
        if (props.positions !== prevPositions) {
            prevPositions = props.positions;
        }
        if (props.contentLocation !== prevContentLocation) {
            prevContentLocation = props.contentLocation;
        }
        if (props.reposition !== prevReposition) {
            prevReposition = props.reposition;
        }
    }
    function renderChildren() {
        let c = children(() => props.children);
        childRef = c();
        return c();
    }
    // createRenderEffect || createEffect
    createEffect(() => {
        if (props.isOpen && shouldUpdate) {
            window.requestAnimationFrame(updatePopover);
            prevIsOpen = true;
        }
    });
    onMount(() => {
        window.addEventListener("click", handleOnClickOutside, true);
        window.addEventListener("resize", handleWindowResize);
    });
    onCleanup(() => {
        window.removeEventListener("click", handleOnClickOutside, true);
        window.removeEventListener("resize", handleWindowResize);
        shouldUpdate = false;
    });
    return (<>
      {renderChildren()}
      <Show when={props.isOpen}>
        <PopoverPortal element={popoverRef} container={props.parentElement} scoutElement={scoutRef}>
          {typeof props.content !== "function"
            ? props.content
            : props.content(popoverState)}
        </PopoverPortal>
      </Show>
    </>);
}
