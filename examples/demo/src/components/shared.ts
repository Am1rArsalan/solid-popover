import { ContentLocation, PopoverProps } from "solid-popover";

export interface PopoverSize {
  width: number;
  height: number;
}

export type ControlsState = Partial<
  PopoverProps & {
    arrowSize: number;
    popoverSize: PopoverSize;
    contentLocation: ContentLocation;
    contentLocationEnabled: boolean;
  }
>;

export type Keys = { [K in keyof ControlsState]: K };
