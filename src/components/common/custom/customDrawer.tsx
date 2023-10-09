import {Box, CssBaseline, IconButton, StyledEngineProvider, SwipeableDrawer} from "@mui/material";
import {Global} from "@emotion/react";
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import {grey} from "@mui/material/colors";
import {Close, CloseOutlined} from "@mui/icons-material";
import {useMobile} from "../../../hook";

const Root = styled('div')(({theme}) => ({
    height: '100%',
    zIndex: 150,
    position: 'relative',
    backgroundColor:
        theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));
const StyledBox = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({theme}) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

const drawerBleeding = 56;

interface IProps {
    window?: () => Window,
    children: ReactNode,
    anchor: "left" | "bottom" | "right" | "top",
    open: boolean,
    toggleDrawer: Dispatch<SetStateAction<boolean>>,
    title: string | any,
    button?: ReactNode,
    closeWithOtherData?: any
}

const CustomDrawer = ({children, anchor, toggleDrawer, title, button, open, closeWithOtherData}: IProps) => {

    const {device} = useMobile();

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/i.test(navigator.userAgent) && true;
    const height = device ? `calc(100% - ${drawerBleeding}px)` : "100%";

    useEffect(() => {
        if (open) {
            setIsVisible(true)
        } else {
            const timeoutId = setTimeout(() => {
                setIsVisible(false)
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [open]);


    return (
        <StyledEngineProvider injectFirst>
            <Root>
                <CssBaseline/>
                <Global styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: height,
                        overflow: device ? 'visible' : 'hidden',
                        zIndex: 150,
                    },
                }}
                />
                <SwipeableDrawer
                    anchor={anchor as IProps['anchor']}
                    open={open as boolean}
                    hysteresis={0.52}
                    minFlingVelocity={450}
                    onOpen={() => toggleDrawer(true)}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                    swipeAreaWidth={drawerBleeding}
                    disableSwipeToOpen={true}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    onClose={() => toggleDrawer(false)}
                    PaperProps={{
                        sx: {
                            width: "100%",
                            maxWidth: device ? '100%' : '725px',
                            p: 1,
                        },
                    }}
                >
                    <StyledBox
                        sx={{
                            position: 'absolute',
                            top: -drawerBleeding,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            visibility: device ? 'inherit' : 'hidden',
                            right: 0,
                            left: 0,
                        }}
                    >
                        <Puller/>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: '10px'
                        }}>
                            <Box sx={{p: 2}}>
                                {title}
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mr: '15px',
                                gap: 2
                            }}>
                                {button}
                                <CloseOutlined
                                    onClick={closeWithOtherData ? closeWithOtherData : () => toggleDrawer(false)}/>
                            </Box>
                        </Box>
                    </StyledBox>
                    <Box sx={{
                        visibility: !device ? 'inherit' : 'hidden',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <span>
                        {title}
                        </span>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: '0',
                                left: '0'
                            }}
                            onClick={() => toggleDrawer(false)}>
                            <Close/>
                        </IconButton>
                    </Box>
                    <StyledBox
                        sx={{
                            p: {xs: 1, sm: 2},
                            display: 'flex',
                            height: '100%',
                            overflow: 'hidden',
                            bgcolor: 'transparent'
                        }}
                    >
                        {children}
                    </StyledBox>
                </SwipeableDrawer>
            </Root>
        </StyledEngineProvider>
    );
};
export default CustomDrawer
