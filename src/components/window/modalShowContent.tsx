import React, {ReactNode} from "react";
import {Box, IconButton, Modal, SxProps} from "@mui/material";
import {Close} from "@mui/icons-material";

import {useMobile} from "../../hook";

type TProps = {
    children: ReactNode,
    openComponent: ReactNode,
    openComponentStyle?: SxProps,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    contentStyle?: SxProps,
    modalStyle?: SxProps
}
const ModalShowContent = ({children, openComponent, openComponentStyle, isOpen, setIsOpen, contentStyle, modalStyle}: TProps) => {

    const {device} = useMobile();

    const scrollBar = !device ? {
        '&::-webkit-scrollbar': {
            width: '7px',
            bgcolor: 'transparent',
            borderRadius: '5px',
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            bgcolor: 'steelblue',
            borderRadius: '5px',
        }
    } : {};
    return (
        <>
            <Box sx={{
                ...openComponentStyle
            }}>
                {openComponent}
            </Box>
            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    whiteSpace: 'break-spaces',
                    borderRadius: '7px',
                    maxWidth: '90%',
                    maxHeight: '70vh',
                    overflow: 'hidden',
                    transform: 'translate(-50%, -50%)',
                    width: 'max-content',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    ...modalStyle
                }}>
                    <header style={{
                        margin: '-32px',
                        marginBottom: '32px',
                        display: 'flex',
                        justifyContent: 'end',
                    }}>
                        <IconButton
                            onClick={() => setIsOpen(false)}
                        >
                            <Close/>
                        </IconButton>
                    </header>
                    <Box sx={{
                        maxHeight: 'calc(70vh - 104px)',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        ...scrollBar,
                        pr: '20px',
                        mr: '-20px',
                        ...contentStyle
                    }}>
                        {children}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
export default ModalShowContent
