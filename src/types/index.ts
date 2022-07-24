import { JSX } from "solid-js/jsx-runtime";

export type PopoverState = {
  childRect: ClientRect;
  popoverRect: ClientRect;
  parentRect: ClientRect;
  boundaryRect: ClientRect;
  //position?: PopoverPosition;
  //align?: PopoverAlign;
  padding: number;
  nudgedLeft: number;
  nudgedTop: number;
  boundaryInset: number;
  //violations: BoundaryViolations;
  hasViolations: boolean;
};

export type ContentRenderer = (popoverState: PopoverState) => JSX.Element;
