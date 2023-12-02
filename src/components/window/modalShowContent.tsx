import React, {CSSProperties, ReactNode, useEffect} from "react";
import {Box, Button, IconButton, Modal, SxProps} from "@mui/material";
import {Close} from "@mui/icons-material";
import {Portal} from "@reach/portal";

import {useMobile} from "@/hook";
import {useTranslate} from "@refinedev/core";

type TProps = {
    children: ReactNode,
    openComponent: ReactNode,
    openComponentStyle?: SxProps,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    contentStyle?: SxProps,
    modalStyle?: SxProps
    headerStyle?: CSSProperties,
    additionalHeaderValue?: ReactNode,
    onClick: () => void,
    onSuccessText?: string
}
const ModalShowContent = ({children, openComponent, openComponentStyle, isOpen, setIsOpen, contentStyle, modalStyle, onClick, headerStyle, additionalHeaderValue, onSuccessText}: TProps) => {

    const {device} = useMobile();
    const translate = useTranslate();

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

    useEffect(() => {
        if (isOpen) {
            const modalRoot = document.getElementById('modalShowContent'); // Замість 'modal-root' вкажіть ID вашого контейнера модалі
            if (modalRoot) {
                modalRoot.focus();
            }
        }
    }, [isOpen]);
    return (
        <>
            <Box sx={{
                ...openComponentStyle
            }}>
                {openComponent}
            </Box>
            {/*<Portal>*/}
                <Modal
                    id={'modalShowContent'}
                    open={isOpen}
                    container={() => document.body}
                    onClose={() => setIsOpen(false)}
                >
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        left: '50%',
                        whiteSpace: 'break-spaces',
                        borderRadius: '7px',
                        maxHeight: '70vh',
                        overflow: 'hidden',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        maxWidth: {xs: '300px', sm: '400px'},
                        p: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: `0px 0px 2px 0px #fff`,
                        top: '45%',
                        "& header svg": {
                            color: '#fff'
                        },
                        ...modalStyle
                    }}>
                        <header style={{
                            margin: '-32px',
                            marginBottom: '32px',
                            display: 'flex',
                            justifyContent: 'end',
                            ...headerStyle
                        }}>
                            {additionalHeaderValue && additionalHeaderValue}
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
                            <Box sx={{
                                width: '100%',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                borderTop: '0.5px solid silver'
                            }}>
                                <Button
                                    sx={{
                                        textTransform: 'inherit',
                                        p: '8px 16px',
                                        fontSize: '16px',
                                        borderRight: '0.5px solid silver',
                                        borderRadius: '0 0 0 4px'
                                    }}
                                    color={'error'}
                                    variant={'text'}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {translate('buttons.cancel')}
                                </Button>
                                <Button
                                    sx={{
                                        textTransform: 'inherit',
                                        p: '8px 16px',
                                        fontSize: '16px'
                                    }}
                                    color={'info'}
                                    variant={'text'}
                                    onClick={onClick}
                                >
                                    {onSuccessText || translate('buttons.save')}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            {/*</Portal>*/}
        </>
    );
};
export default ModalShowContent
