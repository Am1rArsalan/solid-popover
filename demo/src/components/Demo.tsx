import { Box } from "./Box";
import { Controls } from "./Controls";
import { PopoverContent } from "./PopoverContent";
import { createEffect, createSignal } from "solid-js";
import { Popover, ArrowContainer } from "solid-popover";
import { ControlsProvider, useControls } from "../store/controlsStoreContext";

const BOX_SIZE = {
  width: 100,
  height: 100,
} as const;

type Props = {
  className?: string;
};

type Position = {
  left: number;
  top: number;
};

type BoxInfo = {
  isDragging?: boolean;
  mouseLeft: number;
  mouseTop: number;
  width: number;
  height: number;
  parentLeft: number;
  parentTop: number;
};

export function Demo(props: Props) {
  const [store] = useControls();
  const [isPopoverOpen, setIsPopoverOpen] = createSignal(false);
  let boxContainerRef: HTMLDivElement;
  let popoverRef: HTMLElement;

  const [boxOffsetInfo, setBoxOffsetInfo] = createSignal<BoxInfo>();
  const [boxPosition, setBoxPosition] = createSignal<Position>({
    left: 200,
    top: 300,
  });

  // mouse event
  function handleOnMouseMove({ clientX, clientY }: any) {
    //console.log("on mouse move", clientX, clientY);
    const boxInfo = boxOffsetInfo();

    if (!boxInfo) return;

    !boxInfo.isDragging &&
      setBoxOffsetInfo({
        ...boxInfo,
        isDragging: true,
      });

    setBoxPosition({
      left: clientX - boxInfo.parentLeft - boxInfo.mouseLeft,
      top: clientY - boxInfo.parentTop - boxInfo.mouseTop,
    });
  }

  function handleOnMouseUp() {
    console.log("on mouse up");
    if (!boxOffsetInfo()?.isDragging) setIsPopoverOpen(!isPopoverOpen());
    setBoxOffsetInfo(undefined);
  }

  // mouse event
  function handleBoxOnMouseDown(e: any) {
    const { currentTarget, clientX, clientY } = e;
    console.log("on mouse down", currentTarget, clientY, clientX);
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const { left: parentLeft, top: parentTop } =
      boxContainerRef?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
      };
    const mouseLeft = clientX - left;
    const mouseTop = clientY - top;

    setBoxOffsetInfo({
      width,
      height,
      parentLeft,
      parentTop,
      mouseLeft,
      mouseTop,
    });
  }

  const containerStyle = {};

  createEffect(() => {
    console.log("boxOffsetInfo", boxOffsetInfo());
  });

  return (
    <ControlsProvider>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "800px",
          backgroundColor: "black",
          border: "1px solid white",
        }}
      >
        <div
          style={{ height: "100%" }}
          ref={boxContainerRef}
          onMouseMove={handleOnMouseMove}
        >
          <Popover
            onClickOutside={() => setIsPopoverOpen(!isPopoverOpen())}
            ref={popoverRef}
            isOpen={isPopoverOpen()}
            parentElement={boxContainerRef}
            containerStyle={containerStyle}
            padding={store.padding}
            align={store.align}
            positions={store.positions}
            contentLocation={
              store.contentLocationEnabled ? store.contentLocation : undefined
            }
            boundaryInset={store.boundaryInset}
            boundaryTolerance={store.boundaryTolerance}
            reposition={store.reposition}
            containerClassName={store.containerClassName}
            content={(contentProps) => {
              const { childRect, popoverRect, position, ...rest } =
                contentProps;
              console.log("what is contentProps", contentProps);
              return (
                <ArrowContainer
                  popoverRect={contentProps.popoverRect}
                  childRect={contentProps.childRect}
                  position={contentProps.position}
                  arrowColor={"salmon"}
                  arrowSize={store.arrowSize || 0}
                >
                  <PopoverContent
                    style={{
                      minWidth: store.popoverSize?.width || 0,
                      minHeight: store.popoverSize?.height || 0,
                      //backgroundColor: "salmon",
                      backgroundColor: "#eee",
                      "min-width": "100px",
                      padding: "16px",
                    }}
                    position={contentProps.position}
                    childRect={contentProps.childRect}
                    popoverRect={contentProps.popoverRect}
                    {...rest}
                  />
                </ArrowContainer>
              );
            }}
          >
            <Box
              style={{
                position: "relative",
                border: "1px solid white",
                width: `${BOX_SIZE.width}px`,
                height: `${BOX_SIZE.height}px`,
                // isSelected : boxOffsetInfo() !== undefined
                ...(boxOffsetInfo() && { background: "#fff" }),
                ...boxPosition,
              }}
              onMouseDown={handleBoxOnMouseDown}
              onMouseUp={handleOnMouseUp}
            />
          </Popover>
        </div>
        <Controls
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
          disabled={boxOffsetInfo()?.isDragging}
        />
      </div>
    </ControlsProvider>
  );
}

//return (
//<div>
//<div ref={parentRef}>
//<Popover
//ref={elementRef}
//positions={store.positions}
//parentElement={parentRef}
//isOpen={isOpen()}
//padding={store.padding}
//align={store.align}
//contentLocation={
//store.contentLocationEnabled ? store.contentLocation : undefined
//}
//reposition={store.reposition}
////containerStyle={containerStyle}
////boundaryInset={store.boundaryInset}
////boundaryTolerance={store.boundaryTolerance}
//containerClassName={store.containerClassName}
//onClickOutside={() => setIsOpen(false)}
//content={
//<div
//style={{ width: "10rem", height: "10rem", background: "#eee" }}
//>
//<h1> content is here baby</h1>
//</div>
//}
//>
//<button onClick={() => setIsOpen(!isOpen())}>click me</button>
//</Popover>
//</div>
//</div>
//);

//function fake() {
//return (
//);
//}
