import { createArrowContainer } from "./createArrowContainer";
export function ArrowContainer(props) {
    const { childRect, popoverRect, position, arrowColor, arrowSize, arrowClassName, arrowStyle: externalArrowStyle, className, style: externalArrowContainerStyle, } = props;
    const { arrowContainerStyle, arrowStyle } = createArrowContainer({
        childRect,
        popoverRect,
        position,
        arrowColor,
        arrowSize,
    });
    const mergedContainerStyle = {
        ...arrowContainerStyle,
        ...externalArrowContainerStyle,
    };
    const mergedArrowStyle = {
        ...arrowStyle,
        ...externalArrowStyle,
    };
    return (<div class={className} style={mergedContainerStyle}>
      <div style={mergedArrowStyle} class={arrowClassName}/>
      {props.children}
    </div>);
}
