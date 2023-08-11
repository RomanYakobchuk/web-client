import {Box, CssBaseline, StyledEngineProvider, SwipeableDrawer} from "@mui/material";
import {Global} from "@emotion/react";
import React from "react";
import {styled} from "@mui/material/styles";
import {grey} from "@mui/material/colors";
import {CloseOutlined} from "@mui/icons-material";
import {useMobile} from "../../../utils";

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
    children: any,
    otherProps?: any,
    anchor: "left" | "bottom" | "right" | "top",
    open?: boolean,
    toggleDrawer: (value: boolean) => void,
    title: string | any,
    button?: any,
    closeWithOtherData?: any
}

const CustomDrawer = ({children, anchor, toggleDrawer, title, button, open, closeWithOtherData}: IProps) => {

    const {device} = useMobile();

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/i.test(navigator.userAgent) && true;
    const height = device ? `calc(100% - ${drawerBleeding}px)` : "100%";
    return (
        <StyledEngineProvider injectFirst>
            <Root>
                <CssBaseline/>
                <Global styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: height,
                        overflow: 'visible',
                        zIndex: 150,
                    },
                }}
                />
                <SwipeableDrawer
                    anchor={anchor}
                    open={open}
                    hysteresis={0.52}
                    minFlingVelocity={450}
                    onOpen={() => toggleDrawer(true)}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                    swipeAreaWidth={drawerBleeding}
                    disableSwipeToOpen={false}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    onClose={closeWithOtherData ? closeWithOtherData : () => toggleDrawer(false)}
                    PaperProps={{
                        sx: {
                            width: "100%",
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
                                <CloseOutlined onClick={closeWithOtherData ? closeWithOtherData : () => toggleDrawer(false)}/>
                            </Box>
                        </Box>
                    </StyledBox>
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
