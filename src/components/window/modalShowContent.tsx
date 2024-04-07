import React, {CSSProperties, ReactNode, useContext, useEffect, useState} from "react";
import {Box, Button, IconButton, Modal, SxProps} from "@mui/material";
import {Close} from "@mui/icons-material";

import {useMobile} from "@/hook";
import {useTranslate} from "@refinedev/core";
import {ColorModeContext} from "@/contexts";

type TProps = {
    children: ReactNode,
    openComponent?: ReactNode,
    openComponentStyle?: SxProps,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    contentStyle?: SxProps,
    modalStyle?: SxProps
    headerStyle?: CSSProperties,
    additionalHeaderValue?: ReactNode,
    onClick: () => void,
    onSuccessText?: string,
    onCancelText?: string,
    onClose?: () => void,
    disabledSuccess?: boolean
}
const ModalShowContent = ({
                              children,
                              openComponent,
                              openComponentStyle,
                              isOpen,
                              setIsOpen,
                              contentStyle,
                              modalStyle,
                              onClick,
                              headerStyle,
                              additionalHeaderValue,
                              onSuccessText,
                              onCancelText,
                              onClose,
                              disabledSuccess = false
                          }: TProps) => {

    const {device} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const [isVisible, setIsVisible] = useState<boolean>(false);
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
        const t = setTimeout(() => {
            setIsVisible(isOpen)
        }, 300)
        if (isOpen) {
            const modalRoot = document.getElementById('modalShowContent');
            if (modalRoot) {
                modalRoot.focus();
            }
        }
        return () => {
            clearTimeout(t);
        }
    }, [isOpen]);

    return (
        <>
            {
                openComponent && (
                    <Box sx={{
                        ...openComponentStyle
                    }}>
                        {openComponent}
                    </Box>
                )
            }
            {/*<Portal>*/}
            <Modal
                id={'modalShowContent'}
                open={isVisible}
                container={() => document.body}
                onClose={() => {
                    if (onClose) {
                        onClose()
                    } else setIsOpen(false)
                }}
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
                    transition: 'scale 300ms linear',
                    scale: isOpen ? 1 : 0,
                    maxWidth: {xs: '300px', sm: '400px'},
                    p: 0,
                    bgcolor: mode === 'dark' ? 'rgba(20, 20, 20, 1)' : 'rgba(230, 230, 230, 1)',
                    // backdropFilter: 'blur(15px)',
                    boxShadow: `0px 0px 2px 0px #fff`,
                    top: '45%',
                    "& header svg": {
                        color: 'common.white'
                    },
                    ...modalStyle
                }}>
                    <header style={{
                        // margin: '-32px',
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
                            p: 2,
                            gap: 5,
                            "& button": {
                                textTransform: 'inherit',
                                p: '8px 16px',
                                fontSize: '16px',
                                borderRadius: '7px'
                            }
                        }}>
                            <Button
                                color={'error'}
                                variant={'contained'}
                                onClick={() => {
                                    if (onClose) {
                                        onClose()
                                    } else {
                                        setIsOpen(false)
                                    }
                                }}
                            >
                                {onCancelText || translate('buttons.cancel')}
                            </Button>
                            <Button
                                color={'info'}
                                variant={'contained'}
                                onClick={(event) => {
                                    event.preventDefault();
                                    onClick();
                                }}
                                disabled={disabledSuccess}
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
