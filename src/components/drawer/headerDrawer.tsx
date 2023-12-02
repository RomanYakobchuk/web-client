import {Close, CloseOutlined} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import React, {Dispatch, ReactNode, SetStateAction} from "react";

import {drawerBleeding, Puller, StyledBox} from "./utills";
import {useMobile} from "@/hook";

type TProps = {
    toggleDrawer: Dispatch<SetStateAction<boolean>>,
    title: ReactNode,
    button: ReactNode
}
const HeaderDrawer = ({toggleDrawer, button, title}: TProps) => {
    const {width, device} = useMobile();
    return (
        <>
            <StyledBox
                sx={{
                    position: 'absolute',
                    top: -drawerBleeding,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    visibility: (width < 600 && device) ? 'inherit' : 'hidden',
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
                    <Box sx={{p: 1}}>
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
                            onClick={() => toggleDrawer(false)}/>
                    </Box>
                </Box>
            </StyledBox>
            <Box sx={{
                visibility: (!device || (device && width >= 600)) ? 'inherit' : 'hidden',
                position: 'relative',
                display: (width < 600 && device) ? 'none' : 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
        </>
    );
};
export default HeaderDrawer
