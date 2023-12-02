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
    children: ReactNode
}
const Drawer = ({header, anchor, isVisible, maxWidth, bgColor, contentStyle, toggleDrawer, children}: TDrawerProps) => {
    const {device, width} = useMobile();

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/i.test(navigator.userAgent) && true;

    const height = (device && width < 600) ? `calc(100% - ${drawerBleeding}px)` : "100%";

    return (
        <StyledEngineProvider injectFirst>
            <Root>
                <CssBaseline/>
                <Global styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        overflow: (width < 600 && device) ? 'visible' : 'hidden',
                        zIndex: 150,
                    },
                }}
                />
                <SwipeableDrawer
                    id={'customDrawer'}
                    anchor={anchor as Anchor}
                    open={isVisible as boolean}
                    hysteresis={0.72}
                    minFlingVelocity={650}
                    onOpen={() => {
                        toggleDrawer(true);
                    }}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                    swipeAreaWidth={drawerBleeding}
                    disableSwipeToOpen={true}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    onClose={() => {
                        toggleDrawer(false)
                    }}
                    PaperProps={{
                        sx: {
                            width: "100%",
                            maxWidth: (width < 600 && device) ? '100%' : maxWidth,
                            p: 1,
                            bgcolor: bgColor,
                            height: height
                        },
                    }}
                >
                    {header}
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