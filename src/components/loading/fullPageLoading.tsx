import {createPortal} from "react-dom";
import {Box, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";

type TFullPageLoading = {
    isOpen: boolean,
}
export const FullPageLoading = ({isOpen}: TFullPageLoading) => {

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
            transition: 'all 0.3s linear',
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
                <CircularProgress color={'primary'}/>
            </Box>
        </Box>,
        document.body
    );
};

