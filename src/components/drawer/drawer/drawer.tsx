import {CssBaseline, StyledEngineProvider, SwipeableDrawer, SxProps} from "@mui/material";
import React, {Dispatch, ReactNode, SetStateAction} from "react";
import { Global } from "@emotion/react";

import {Anchor, drawerBleeding, Root, StyledBox} from "../utills";
import {useMobile} from "@/hook";

type TDrawerProps = {
    header: ReactNode,
    anchor: "left" | "bottom" | "right" | "top",
    isVisible: boolean,
    maxWidth?: string,
    contentStyle?: SxProps,
    bgColor?: string,
    toggleDrawer: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
    closeWithOtherData?: () => void,
    drawerHeight?: string,
    showDefaultHeader?: boolean
}
const Drawer = ({header, anchor, isVisible, maxWidth, bgColor, contentStyle, toggleDrawer, children, closeWithOtherData, drawerHeight, showDefaultHeader = true}: TDrawerProps) => {
    const {device, width} = useMobile();

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/i.test(navigator.userAgent) && true;

    const height = (device && width < 600 && anchor === 'bottom') ? `calc(100% - ${drawerBleeding}px)` : drawerHeight ? drawerHeight : "100%";

    return (
        <StyledEngineProvider injectFirst>
            <Root>
                <CssBaseline/>
                <Global styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        overflow: (width < 600 && device) ? 'hidden' : 'hidden',
                        zIndex: 150,
                    },
                }}
                />
                <SwipeableDrawer
                    id={'customDrawer'}
                    anchor={anchor as Anchor}
                    open={isVisible as boolean}
                    // hysteresis={0.72}
                    // minFlingVelocity={650}
                    onOpen={() => {
                        toggleDrawer(true);
                    }}
                    // disableBackdropTransition={!iOS}
                    // disableDiscovery={iOS}
                    // swipeAreaWidth={drawerBleeding}
                    disableSwipeToOpen={true}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    onClose={() => {
                        toggleDrawer(false)
                        if (closeWithOtherData) {
                            closeWithOtherData()
                        }
                    }}
                    PaperProps={{
                        sx: {
                            width: "100%",
                            maxWidth: (width < 600 && device) ? '100%' : maxWidth,
                            bgcolor: bgColor,
                            height: height,
                            bottom: 0,
                            top: 'unset'
                        },
                    }}
                >
                    {showDefaultHeader && header}
                    <StyledBox
                        sx={{
                            p: {xs: 1, sm: 2},
                            display: 'flex',
                            height: '100%',
                            // overflowX: 'hidden',
                            overflowY: 'auto',
                            bgcolor: 'transparent',
                            ...contentStyle
                        }}
                    >
                        {children}
                    </StyledBox>
                </SwipeableDrawer>
            </Root>
        </StyledEngineProvider>
    )
}
export default Drawer;