import {useEffect, useState} from "react";

interface IMobile {
    width: number,
    device: any
}
export const useMobile = (): IMobile => {
    const [device, setDevice] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

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
    }, [])


    return {
        device, width
    }
}