import { PopoverAlign, PopoverPosition } from "./types";

export const Constants = {
  DEFAULT_ALIGN: "center" as PopoverAlign,
  DEFAULT_POSITIONS: ["top", "left", "right", "bottom"] as PopoverPosition[],
  EMPTY_CLIENT_RECT: {
    top: 0,
    left: 0,
    bottom: 0,
    height: 0,
    right: 0,
    width: 0,
  } as ClientRect,
} as const;
