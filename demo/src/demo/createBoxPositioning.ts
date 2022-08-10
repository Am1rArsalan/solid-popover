//import { MutableRefObject, createSignal } from "react";

import { createSignal } from "solid-js";
//import { Mouse } from "solid-js/web";

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

export const createBoxBehavior = (boxContainerRef: HTMLElement) => {
  const [boxOffsetInfo, setBoxOffsetInfo] = createSignal<BoxInfo>();
  const [boxPosition, setBoxPosition] = createSignal<Position>({
    left: 200,
    top: 300,
  });
  const [isPopoverOpen, setIsPopoverOpen] = createSignal(true);

  // mouse event
  const handleOnMouseMove = ({ clientX, clientY }: any) => {
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
  };

  const handleOnMouseUp = () => {
    if (!boxOffsetInfo()?.isDragging) setIsPopoverOpen(!isPopoverOpen);
    setBoxOffsetInfo(undefined);
  };

  const handleBoxOnMouseDown = (e: any) => {
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
  };

  return {
    boxPosition,
    isSelected: boxOffsetInfo != null,
    isPopoverOpen,
    setIsPopoverOpen,
    handleOnMouseMove,
    handleOnMouseUp,
    handleBoxOnMouseDown,
    isDragging: boxOffsetInfo()?.isDragging ?? false,
  };
};
