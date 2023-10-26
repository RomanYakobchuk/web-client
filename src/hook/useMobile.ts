import {useContext, useEffect, useState} from "react";
import {ColorModeContext} from "../contexts";

type TMobile = {
    width: number,
    device: boolean,
    layoutWidth: number,
    height: number
}

async function checkDevice() {
    const userAgent = navigator.userAgent;
    return (/Android/i.test(userAgent)) || (/iPhone|iPad|iPod/i.test(userAgent));
}

export const useMobile = (): TMobile => {
    const {collapsed} = useContext(ColorModeContext);
    const [device, setDevice] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    // const [layoutWidth, setLayoutWidth] = useState<number>(width > 900 ? collapsed ? width - 64 : width - 200 : width);

    const maxDeviceWidth = Math.min(window.innerWidth, window.screen.width);

    const [layoutWidth, setLayoutWidth] = useState<number>(
        width > 900 ? (collapsed ? Math.min(width - 64, maxDeviceWidth) : Math.min(width - 200, maxDeviceWidth)) : width
    );

    const handleCheckLayout = () => {
        const newWidth = window.innerWidth;
        const newLayoutWidth =
            newWidth > 900 ? (collapsed ? Math.min(newWidth - 64, maxDeviceWidth) : Math.min(newWidth - 200, maxDeviceWidth)) : newWidth;
        setWidth(newWidth);
        setLayoutWidth(newLayoutWidth);
    };

    useEffect(() => {
        handleCheckLayout();
        window.addEventListener('resize', handleCheckLayout);
        window.addEventListener('orientationchange', handleCheckLayout);

        return () => {
            window.removeEventListener('resize', handleCheckLayout);
            window.removeEventListener('orientationchange', handleCheckLayout);
        };
    }, [width, collapsed, maxDeviceWidth, window.screen.orientation]);
    useEffect(() => {
        const handleSet = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
            checkDevice().then(isMobile => {
                setDevice(isMobile);
            });
        };

        handleSet();
        window.addEventListener('load', handleSet);
        window.addEventListener('resize', handleSet);
        window.addEventListener('orientationchange', () => {
            handleSet();
            handleCheckLayout();
        });
        return () => {
            window.removeEventListener("load", handleSet);
            window.removeEventListener("resize", handleSet);
            window.removeEventListener('orientationchange', handleSet)
        }
    }, [window.screen.orientation, window.innerWidth, collapsed]);

    return {
        device, width, layoutWidth, height
    }
}