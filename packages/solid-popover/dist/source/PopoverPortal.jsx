import { onMount, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
function PopoverPortal(props) {
    onMount(() => {
        props.container.appendChild(props.element);
        props.container.appendChild(props.scoutElement);
    });
    onCleanup(() => {
        props.container.removeChild(props.element);
        props.container.removeChild(props.scoutElement);
    });
    return <Portal mount={props.element}>{props.children}</Portal>;
}
export default PopoverPortal;
