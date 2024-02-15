import {Box, IconButton, SxProps} from "@mui/material";
import {ReactNode, MouseEvent, useState, useEffect} from "react";
import {CloseOutlined} from "@mui/icons-material";
import ReactDOM from "react-dom";

import {useMobile} from "@/hook";
import './modalWindow.css';

interface IProps {
    children: ReactNode,
    open: boolean,
    setOpen: (value: boolean) => void,
    title: ReactNode,
    titleStyle?: SxProps,
    bodyProps?: SxProps,
    contentProps?: SxProps,
    timeOut?: 100 | 200 | 300 | 400 | 500 | 700 | 1000 | 1500 | number
}

const ModalWindow = ({children, open, setOpen, title, titleStyle, bodyProps, contentProps, timeOut = 1000}: IProps) => {

    const [isVisible, setIsVisible] = useState(open);

    const {width, device} = useMobile();

    const someStyle = (!device || width > 600) ? {
        '&::-webkit-scrollbar': {
            width: '10px',
            bgcolor: 'transparent',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            bgcolor: 'steelblue',
            borderRadius: '5px',
        }
    } : {};

    const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleModalClose = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
    }

    useEffect(() => {
        if (open) {
            setIsVisible(true)
        } else {
            const timeoutId = setTimeout(() => {
                setIsVisible(false)
            }, timeOut);
            return () => clearTimeout(timeoutId);
        }
    }, [open, timeOut]);

    if (!isVisible) {
        return null;
    }


    return ReactDOM.createPortal(
        <Box
            role={'presentation'}
            id={'modal_content_window'}
            sx={{
                position: 'fixed',
                inset: 0,
                opacity: 1,
                zIndex: 30,
                height: '100% !important',
                width: '100%',
                top: open ? 0 : '100%',
                p: 0,
                m: 0,
                transition: `top ${timeOut}ms linear`,
                animation: `${open ? 'OpenModalWindow' : 'CloseModalWindow'} ${timeOut}ms linear forwards`,
                bgcolor: 'rgba(107, 122, 144, 0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                "& .ReactModal__Overlay": {
                    opacity: 0,
                    transform: " translateX(-100px)",
                    transition: " all 500ms ease-in-out"
                },
                "& .ReactModal__Overlay--after-open": {
                    opacity: 1,
                    transform: 'translateX(0px)'
                },
                ".ReactModal__Overlay--before-close ": {
                    opacity: 0,
                    transform: 'translateX(-100px)'
                }
            }}
            onClick={handleModalClose}
        >
            <Box
                onClick={handleModalClick}
                sx={{
                    width: '100%',
                    position: 'absolute',
                    overflow: 'hidden',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '700px',
                    boxShadow: 'rgba(67, 77, 91, 0.2) 0px 4px 20px',
                    borderRadius: 'clamp(0px, (100vw - 750px) * 9999, 12px)',
                    height: '70vh',
                    "@media screen and (max-width: 700px)":{
                        height: '100%'
                    },
                    bgcolor: 'common.black',
                    ...contentProps
                }}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                }}>
                    <header style={{
                        borderBottom: title ? '1px solid rgb(218, 226, 237)' : '1px solid transparent',
                        borderTopColor: 'rgb(218, 226, 237)',
                        borderRightColor: 'rgb(218, 226, 237)',
                        borderLeftColor: 'rgb(218, 226, 237)',
                        padding: width > 600 ? '14px' : '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                        minHeight: '50px'
                    }}>
                        <Box sx={{
                            width: '100%',
                            ...titleStyle
                        }}>
                            {title}
                        </Box>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                right: '10px'
                            }}
                            onClick={() => setOpen(false)}
                        >
                            <CloseOutlined/>
                        </IconButton>
                    </header>
                    <Box
                        sx={{
                            height: '100%',
                            maxWidth: '90%',
                            margin: '0 auto',
                            maxHeight: 'calc(100% - 80px)',
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            ...someStyle,
                            ...bodyProps,
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>, document.body
    );
};

export default ModalWindow;
