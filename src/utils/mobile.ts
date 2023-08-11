import {useContext, useEffect, useState} from "react";
import {ColorModeContext} from "../contexts";

interface IMobile {
    width: number,
    device: any,
    layoutWidth: number
}
export const useMobile = (): IMobile => {
    const {collapsed} = useContext(ColorModeContext);
    const [device, setDevice] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [layoutWidth, setLayoutWidth] = useState<number>(collapsed ? width - 64 : width - 200);

    const checkDevice = () => {
        const userAgent = navigator.userAgent;

        if ((/Android/i.test(userAgent)) || (/iPhone|iPad|iPod/i.test(userAgent))) {
            setDevice(true)
        } else {
            setDevice(false)
        }
    };

    function handleWidth() {
        setWidth(window.innerWidth)
        checkDevice();
    }

    useEffect(() => {
        handleWidth();
        window.addEventListener('load', handleWidth);
        window.addEventListener('resize', handleWidth);
        return () => {
            window.removeEventListener("load", handleWidth);
            window.removeEventListener("resize", handleWidth);
        }
    }, []);

    useEffect(() => {
        if (width) {
            setLayoutWidth(collapsed ? width - 64 : width - 200)
        }
    }, [width, collapsed])


    return {
        device, width, layoutWidth
    }
}