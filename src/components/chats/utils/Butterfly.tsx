import {SvgIcon, SvgIconProps} from "@mui/material";
import MyPath from "./My path.svg"

export const ButterflySVG = () => {
    return (
        // <svg xmlns="http://www.w3.org/2000/svg" viewBox="-44.1 -0.1 71.2 14.2">
        //     <path
        //         d="M 23 12 C 23 14 21 14 8 14 L -40 14 C -44 14 -44 12 -44 8 L -44 6 C -44 2 -44 0 -40 0 L 18 0 C 23 0 24 2 24 4 V 8 C 24 10 24 13 27 14 C 23 14 23 12 23 12"
        //         stroke="#c1c1c1" strokeWidth="0.1" fill="#1084ff"/>
        // </svg>
        <svg width="24"
             height="24"
             xmlns="http://www.w3.org/2000/svg" viewBox="15.4518 -12 20.55 26">
            <path d="M 24 -12 C 24 -2 22 4 36 14 C 9 14 16 -1 17 -4 L 24 -12" fill="#1084ff"/>
        </svg>
        // <svg
        //     width="24"
        //     height="24"
        //     viewBox="32.485 17.5 15.515 17.5"
        //     fill="none"
        //     enableBackground="new 32.485 17.5 15.515 17.5"
        //     xmlns="http://www.w3.org/2000/svg"
        // >
        //     <path
        //         d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
        //         fill="#1084ff"
        //     />
        // </svg>
    );
};

type TButterflyIcon = {
    props?: SvgIconProps
}
export const ButterflyIcon = ({props}: TButterflyIcon) => {
    return (
        <SvgIcon {...props} component={ButterflySVG}/>
    )
}