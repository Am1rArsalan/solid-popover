import { createSignal } from "solid-js";
import { Popover, ArrowContainer } from "solid-popover";
import { Box } from "./Box";
import { Controls } from "./Controls";
import { PopoverContent } from "./PopoverContent";
import { useControls } from "../store/controlsStoreContext";

const BOX_SIZE = {
  width: 100,
  height: 100,
} as const;

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

export function Demo() {
  const [store, { togglePopover }] = useControls();
  let boxContainerRef: HTMLDivElement;
  let popoverRef: HTMLElement;

  const [boxOffsetInfo, setBoxOffsetInfo] = createSignal<BoxInfo>();
  const [boxPosition, setBoxPosition] = createSignal<Position>({
    left: 200,
    top: 300,
  });

  // mouse event
  function handleOnMouseMove({ clientX, clientY }: any) {
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
    if (!boxOffsetInfo()?.isDragging) togglePopover();
    setBoxOffsetInfo(undefined);
  }

  // mouse event
  function handleBoxOnMouseDown(e: any) {
    const { currentTarget, clientX, clientY } = e;
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

  return (
    <div class="wrapper">
      <div
        style={{ height: "100%" }}
        ref={boxContainerRef}
        onMouseMove={handleOnMouseMove}
      >
        <Popover
          onClickOutside={() => togglePopover()}
          ref={popoverRef}
          isOpen={store.isOpen || false}
          parentElement={boxContainerRef}
          containerStyle={containerStyle}
          spacing={store.spacing}
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
            const { childRect, popoverRect, position, ...rest } = contentProps;
            return (
              <ArrowContainer
                popoverRect={contentProps.popoverRect}
                childRect={contentProps.childRect}
                position={contentProps.position}
                //arrowColor={"salmon"}
                arrowColor="#fff"
                arrowSize={store.arrowSize || 0}
                arrowClassName="hello-world"
              >
                <PopoverContent
                  style={{
                    minWidth: store.popoverSize?.width || 0,
                    minHeight: store.popoverSize?.height || 0,
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
      <Controls className="controls" disabled={boxOffsetInfo()?.isDragging} />
    </div>
  );
}
