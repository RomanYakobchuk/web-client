import {SxProps} from "@mui/material";
import React, {CSSProperties, Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import 'react-spring-bottom-sheet/dist/style.css'

import {useMobile} from "@/hook";
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
    closeWithOtherData?: () => void,
    maxWidth?: string,
    contentStyle?: SxProps,
    bgColor?: string,
    isScaleRoot?: boolean,
    drawerHeight?: string,
    showDefaultHeader?: boolean,
    isOnlySwiper?: boolean,
    normalDrawerStyle?: SxProps,
    swiperSnapPoints?: number[],
    swiperDefaultSnap?: number,
    swiperStyles?: SxProps,
    swiperClasses?: string
}


const CustomDrawer = ({
                          children,
                          anchor,
                          swiperClasses,
                          toggleDrawer,
                          title,
                          button,
                          open,
                          closeWithOtherData,
                          maxWidth = '725px',
                          contentStyle,
                          bgColor = '',
                          isScaleRoot = false,
                          drawerHeight,
                          showDefaultHeader = true,
                          isOnlySwiper = false,
                          normalDrawerStyle,
                          swiperStyles,
                          swiperDefaultSnap,
                          swiperSnapPoints,
                      }: TProps) => {
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
                isOnlySwiper ||
                (width <= 600 && device && anchor === 'bottom')
                    ? <SwipeDrawer
                        isVisible={isVisible}
                        toggleDrawer={toggleDrawer}
                        snapPoints={swiperSnapPoints}
                        defaultSnap={swiperDefaultSnap}
                        styles={swiperStyles}
                        classes={swiperClasses}
                        header={
                            <HeaderDrawer
                                isForSwipe={true}
                                anchor={anchor}
                                title={title}
                                toggleDrawer={toggleDrawer}
                                button={button}
                                onClick={closeWithOtherData}
                            />
                        }
                    >
                        {children}
                    </SwipeDrawer>
                    : <Drawer
                        header={
                            <HeaderDrawer
                                anchor={anchor}
                                title={title}
                                toggleDrawer={toggleDrawer}
                                button={button}
                                onClick={closeWithOtherData}
                            />
                        }
                        showDefaultHeader={showDefaultHeader}
                        drawerHeight={drawerHeight}
                        bgColor={bgColor}
                        maxWidth={maxWidth}
                        contentStyle={contentStyle}
                        anchor={anchor}
                        isVisible={isVisible}
                        toggleDrawer={toggleDrawer}
                        closeWithOtherData={closeWithOtherData}
                    >
                        {children}
                    </Drawer>
            }
        </>
    );
};

export default CustomDrawer