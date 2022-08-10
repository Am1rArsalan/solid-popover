//import React, { FC, useMemo, useReducer, useRef } from "react";
import { Box } from "./Box";
import { useBoxBehavior } from "./useBoxPositioning";
import { Controls } from "./Controls";
import { ControlsState, reducer } from "./shared";
import { PopoverContent } from "./PopoverContent";
import { Component, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import { Popover } from "solid-tiny-popover";

const BOX_SIZE = {
  width: 100,
  height: 100,
} as const;

// TODO: ADD css class for this extra styles

//interface BoxStyleProps {
//$isSelected: boolean;
//}

//const Box = styled(_Box)<BoxStyleProps>`
//${(props) =>
//props.$isSelected &&
//css`
//border-width: 5px;
//`}
//`;

type Props = {
  className?: string;
};

export const Demo: Component<Props> = ({ className }) => {
  const [state, setState] = createStore<ControlsState>({
    padding: 10,
    align: "center",
    positions: ["top", "left", "bottom", "right"],
    boundaryInset: 0,
    reposition: true,
    contentLocation: {
      left: 20,
      top: 20,
    },
    contentLocationEnabled: true,
    containerClassName: "solid-tiny-popover-container",
    boundaryTolerance: 0,
    arrowSize: 0,
    popoverSize: {
      width: 100,
      height: 100,
    },
  });

  const [isOpen, setIsOpen] = createSignal(false);
  let parentRef;
  let elementRef;

  return (
    <div>
      <div ref={parentRef}>
        <Popover
          ref={elementRef}
          positions={state.positions}
          parentElement={parentRef}
          isOpen={isOpen()}
          padding={state.padding}
          align={state.align}
          contentLocation={
            state.contentLocationEnabled ? state.contentLocation : undefined
          }
          reposition={state.reposition}
          //containerStyle={containerStyle}
          //boundaryInset={state.boundaryInset}
          //boundaryTolerance={state.boundaryTolerance}
          containerClassName={state.containerClassName}
          onClickOutside={() => setIsOpen(false)}
          content={
            <div
              style={{ width: "10rem", height: "10rem", background: "#eee" }}
            >
              <h1> content is here baby</h1>
            </div>
          }
        >
          <button onClick={() => setIsOpen(!isOpen())}>click me</button>
        </Popover>
      </div>
    </div>
  );
  //const boxContainerRef = <HTMLDivElement | undefined>();
  //const {
  //boxPosition,
  //isSelected,
  //isPopoverOpen,
  //handleBoxOnMouseDown,
  //handleOnMouseMove,
  //handleOnMouseUp,
  //isDragging,
  //} = useBoxBehavior(boxContainerRef);
  //const containerStyle = useMemo(
  //() =>
  //({
  //// transition: 'transform 0.04s ease-in',
  //} as Partial<CSSStyleDeclaration>),
  //[]
  //);
};

function fake() {
  //return (
  //<div
  //style={{
  //position: "relative",
  //width: "100%",
  //height: "800px",
  //backgroundColor: "black",
  //border: "1px solid white",
  //}}
  //>
  //<div
  //style={{ height: "100%" }}
  //ref={boxContainerRef}
  //onMouseMove={handleOnMouseMove}
  //>
  //<Popover
  //isOpen={isPopoverOpen}
  //parentElement={boxContainerRef.current}
  //containerStyle={containerStyle}
  //padding={state.padding}
  //align={state.align}
  //positions={state.positions}
  //contentLocation={
  //state.contentLocationEnabled ? state.contentLocation : undefined
  //}
  //boundaryInset={state.boundaryInset}
  //boundaryTolerance={state.boundaryTolerance}
  //reposition={state.reposition}
  //containerClassName={state.containerClassName}
  //content={({ position, childRect, popoverRect, ...rest }) => (
  //<ArrowContainer
  //popoverRect={popoverRect}
  //childRect={childRect}
  //position={position}
  //arrowColor={"salmon"}
  //arrowSize={state.arrowSize}
  //>
  //<PopoverContent
  //style={{
  //minWidth: state.popoverSize.width,
  //minHeight: state.popoverSize.height,
  //backgroundColor: "salmon",
  //"min-width": "100px",
  //padding: "16px",
  //}}
  //position={position}
  //childRect={childRect}
  //popoverRect={popoverRect}
  //{...rest}
  ///>
  //</ArrowContainer>
  //)}
  //>
  //<Box
  //style={{
  //position: "relative",
  //border: "1px solid white",
  //width: `${BOX_SIZE.width}px`,
  //height: `${BOX_SIZE.height}px`,
  //...boxPosition,
  //}}
  //onMouseDown={handleBoxOnMouseDown}
  //onMouseUp={handleOnMouseUp}
  //$isSelected={isSelected}
  ///>
  //</Popover>
  //</div>
  //<Controls
  //style={{
  //position: "absolute",
  //bottom: 0,
  //left: 0,
  //}}
  //values={state}
  //dispatch={dispatch}
  //disabled={isDragging}
  ///>
  //</div>
  //);
}
