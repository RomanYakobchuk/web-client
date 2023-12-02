import {Box, IconButton, SxProps} from "@mui/material";
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {Close, CloseOutlined} from "@mui/icons-material";
import 'react-spring-bottom-sheet/dist/style.css'

import {useMobile} from "@/hook";
import {Puller, drawerBleeding, StyledBox} from "./utills";
import SwipeDrawer from "./swipeDrawer/swipeDrawer";
import Drawer from "./drawer/drawer";
import HeaderDrawer from "./headerDrawer";


type TProps = {
    window?: () => Window,
    children: ReactNode,
    anchor: "left" | "bottom" | "right" | "top",
    open: boolean,
    toggleDrawer: Dispatch<SetStateAction<boolean>>,
    title: string | ReactNode,
    button?: ReactNode,
    closeWithOtherData?: any,
    maxWidth?: string,
    contentStyle?: SxProps,
    bgColor?: string,
    isScaleRoot?: boolean
}


const CustomDrawer = ({children, anchor, toggleDrawer, title, button, open, closeWithOtherData, maxWidth = '725px', contentStyle, bgColor = '', isScaleRoot = false}: TProps) => {
    const {device, width} = useMobile();

    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true)
        } else {
            const timeoutId = setTimeout(() => {
                setIsVisible(false)
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [open]);

    useEffect(() => {
        if (isScaleRoot) {
            const root = document.getElementById('root') as HTMLDivElement;
            if (root) {
                root.style.transition = 'transform 0.5s ease-in-out';
                root.style.transform = isVisible ? 'scale(0.95)' : 'scale(1)';
            }
        }
    }, [isVisible, isScaleRoot]);

    return (
        <>
            {
                (width <= 600 && device)
                    ? <SwipeDrawer
                        isVisible={isVisible}
                        toggleDrawer={toggleDrawer}
                        header={
                            <HeaderDrawer
                                title={title}
                                toggleDrawer={toggleDrawer}
                                button={button}
                            />
                        }
                    >
                        {children}
                    </SwipeDrawer>
                    : <Drawer
                        header={
                            <HeaderDrawer
                                title={title}
                                toggleDrawer={toggleDrawer}
                                button={button}
                            />
                        }
                        bgColor={bgColor}
                        maxWidth={maxWidth}
                        contentStyle={contentStyle}
                        anchor={anchor}
                        isVisible={isVisible}
                        toggleDrawer={toggleDrawer}
                    >
                        {children}
                    </Drawer>
            }
        </>
    );
};

export default CustomDrawer