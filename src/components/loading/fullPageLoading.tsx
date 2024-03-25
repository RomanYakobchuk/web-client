import {createPortal} from "react-dom";
import {Box, CircularProgress} from "@mui/material";
import {useContext, useEffect, useState} from "react";

import {ColorModeContext} from "@/contexts";

type TFullPageLoading = {
    isOpen: boolean,
}
export const FullPageLoading = ({isOpen}: TFullPageLoading) => {

    const {mode} = useContext(ColorModeContext);
    const [_, setIsVisible] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setScale(1);
            }, 0)
            setIsVisible(true)
        } else {
            setScale(0);
            const timer = setTimeout(() => {
                setIsVisible(isOpen)
            }, 0);
            return () => {
                clearTimeout(timer)
            }
        }
    }, [isOpen]);

    const spinnerColor = mode === 'dark' ? 'secondary' : 'primary';
    return createPortal(
        <Box sx={{
            width: '100%',
            position: 'fixed',
            inset: 0,
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(2px)',
            cursor: 'not-allowed',
            zIndex: 2000,
            transform: `scale(${scale})`,
            transition: 'all 0 linear',
        }}>
            <Box sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                p: 3,
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <CircularProgress color={spinnerColor}/>
            </Box>
        </Box>,
        document.body
    );
};

