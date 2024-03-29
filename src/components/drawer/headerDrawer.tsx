import {Close, CloseOutlined} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import React, {Dispatch, ReactNode, SetStateAction} from "react";

import {drawerBleeding, Puller, StyledBox} from "./utills";
import {useMobile} from "@/hook";

type TProps = {
    toggleDrawer: Dispatch<SetStateAction<boolean>>,
    title: ReactNode,
    button: ReactNode,
    anchor: "left" | "top" | "bottom" | "right",
    onClick?: () => void,
    isForSwipe?: boolean,
    isShowCloseButton?: boolean,
}
const HeaderDrawer = ({
                          toggleDrawer,
                          button,
                          title,
                          isShowCloseButton = true,
                          anchor,
                          onClick,
                          isForSwipe = false
                      }: TProps) => {
    const {width, device} = useMobile();
    return (
        <>
            <StyledBox
                sx={{
                    position: 'absolute',
                    top: -drawerBleeding,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    visibility: isForSwipe || (width < 600 && device && anchor === 'bottom') ? 'inherit' : 'hidden',
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
                    <Box sx={{p: 1, minHeight: '50px'}}>
                        {title}
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mr: '15px',
                        gap: 2
                    }}>
                        {button}
                        {
                            isShowCloseButton && (
                                <CloseOutlined
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        toggleDrawer(false)
                                        if (onClick) {
                                            onClick();
                                        }
                                    }}/>
                            )
                        }
                    </Box>
                </Box>
            </StyledBox>
            <Box sx={{
                visibility: !isForSwipe || (!device || (device && width >= 600)) || anchor === 'right' ? 'inherit' : 'hidden',
                position: 'relative',
                display: isForSwipe || (width < 600 && device && anchor === 'bottom') ? 'none' : 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50px'
            }}>
                        <span>
                        {title}
                        </span>
                {
                    isShowCloseButton && (
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                cursor: 'pointer'
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleDrawer(false)
                                if (onClick) {
                                    onClick();
                                }
                            }}>
                            <Close/>
                        </IconButton>
                    )
                }
            </Box>
        </>
    );
};
export default HeaderDrawer
