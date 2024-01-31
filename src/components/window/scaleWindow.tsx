import ReactDOM from "react-dom";
import {Dispatch, MouseEvent, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {Box, SxProps} from "@mui/material";
import {ColorModeContext} from "@/contexts";

type TProps = {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
    contentSx?: SxProps
}
export const ScaleWindow = ({isOpen, setIsOpen, children, contentSx}: TProps) => {
    const {mode} = useContext(ColorModeContext);

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setScale(1);
            }, 100)
            setIsVisible(true)
        } else {
            setScale(0);
            const timer = setTimeout(() => {
                setIsVisible(isOpen)
            }, 500);
            return () => {
                clearTimeout(timer)
            }
        }
    }, [isOpen]);

    const handleStop = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }
    const handleClose = () => {
        setIsOpen(false)
    };
    if (!isVisible) {
        return null;
    }
    return ReactDOM.createPortal(
        <Box sx={{
            position: 'fixed',
            zIndex: 500,
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${scale})`,
            transition: 'all 0.3s linear',
            bgcolor: mode === 'dark' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(20, 20, 20, 0.2)',
            backdropFilter: 'blur(10px)',
            "& div.MuiInputBase-root": {
                borderRadius: '7px',
                color: 'common.white',
                "&::placeholder": {
                    color: 'silver'
                },
                "& > fieldset": {
                    borderColor: `${mode === 'dark' ? '#fff' : '#000'} !important`
                }
            },
            "& .ant-select-auto-complete input": {
                borderColor: 'common.white'
            },
            '& label': {
                color: 'secondary.main',
            },
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: 'common.white',
                },
                '&:hover fieldset': {
                    borderColor: 'common.white',
                },
                '&.Mui-focused fieldset': {
                    borderColor: 'common.white',
                },
            },
            "& label, & label.Mui-focused": {
                color: 'common.white'
            },
            "& *:not(button).Mui-disabled": {
                WebkitTextFillColor: '#514f4f !important'
            },
        }}
             onClick={handleClose}
        >
            <Box
                sx={{
                    position: 'absolute',
                    zIndex: 1,
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '10px',
                    bgcolor: 'common.black',
                    color: 'common.white',
                    width: '95%',
                    maxWidth: '600px',
                    ...contentSx
                }}
                onClick={handleStop}
            >
                {children}
            </Box>
        </Box>, document.body
    )
};

