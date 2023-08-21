import {Box, IconButton, Modal, StyledEngineProvider, SxProps} from "@mui/material";
import {ReactNode, useContext, MouseEvent, useState, useEffect} from "react";
import {CloseOutlined} from "@mui/icons-material";
import ReactDOM from "react-dom";

import {ColorModeContext} from "../../contexts";
import {useMobile} from "../../utils";

import './modalWindow.css';
import {SchemaContext} from "../../settings/schema";

interface IProps {
    children: ReactNode,
    open: boolean,
    setOpen: (value: boolean) => void,
    title: ReactNode,
    titleStyle?: SxProps,
    bodyProps?: SxProps,
}

const ModalWindow = ({children, open, setOpen, title, titleStyle, bodyProps}: IProps) => {

    const {collapsed} = useContext(ColorModeContext);
    const {schema} = useContext(SchemaContext);

    const [isVisible, setIsVisible] = useState(open);

    const {width, device} = useMobile();

    const someStyle = !device ? {
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
        event.stopPropagation();
    }

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

    // const modalWidth = schema === 'schema_1' ? collapsed ? '' : '' : '100%'

    if (!isVisible) {
        return null;
    }

    return ReactDOM.createPortal(
            <Box
                role={'presentation'}
                sx={{
                    position: 'fixed',
                    inset: 0,
                    opacity: 1,
                    zIndex: 30,
                    width: '100%',
                    top: open ? 0 : '100%',
                    height: '100vh',
                    transition: 'top 1s linear',
                    animation: `${open ? 'OpenModalWindow' : 'CloseModalWindow'} 1s linear forwards`,
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
                onClick={() => setOpen(false)}
            >
            <Box
                onClick={handleModalClick}
                sx={{
                    width: '100%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '700px',
                    boxShadow: 'rgba(67, 77, 91, 0.2) 0px 4px 20px',
                    borderRadius: 'clamp(0px, (100vw - 750px) * 9999, 12px)',
                    height: width < 700 ? '100vh' : '70vh',
                    bgcolor: 'common.black',
                }}>
                <header style={{
                    borderBottom: title ? '1px solid rgb(218, 226, 237)' : '1px solid transparent',
                    borderTopColor: 'rgb(218, 226, 237)',
                    borderRightColor: 'rgb(218, 226, 237)',
                    borderLeftColor: 'rgb(218, 226, 237)',
                    padding: width > 600 ? '14px' : '8px',
                    display: 'flex',
                    justifyContent: 'center',

                    position: 'relative'
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
                        minHeight: '384px',
                        maxWidth: '80%',
                        margin: '0 auto',
                        maxHeight: '80%',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        ...someStyle,
                        ...bodyProps,
                    }}
                >
                    {children}
                </Box>
            </Box>
            </Box>, document.body
        // </Modal>
    );
};

export default ModalWindow;
