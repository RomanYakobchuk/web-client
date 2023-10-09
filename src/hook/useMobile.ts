import {useContext, useEffect, useState} from "react";
import {ColorModeContext} from "../contexts";

interface IMobile {
    width: number,
    device: boolean,
    layoutWidth: number,
    height: number
}
export const useMobile = (): IMobile => {
    const {collapsed} = useContext(ColorModeContext);
    const [device, setDevice] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [layoutWidth, setLayoutWidth] = useState<number>(collapsed ? width - 64 : width - 200);

    const checkDevice = () => {
        const userAgent = navigator.userAgent;

        if ((/Android/i.test(userAgent)) || (/iPhone|iPad|iPod/i.test(userAgent))) {
            setDevice(true)
        } else {
            setDevice(false)
        }
    };

    function handleSet() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        checkDevice();
    }

    useEffect(() => {
        handleSet();
        window.addEventListener('load', handleSet);
        window.addEventListener('resize', handleSet);
        return () => {
            window.removeEventListener("load", handleSet);
            window.removeEventListener("resize", handleSet);
        }
    }, []);

    useEffect(() => {
        if (width) {
            setLayoutWidth(collapsed ? width - 64 : width - 200)
        }
    }, [width, collapsed])


    return {
        device, width, layoutWidth, height
    }
}