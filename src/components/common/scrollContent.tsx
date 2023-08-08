import {Box} from "@mui/material";
import {useEffect, useState} from "react";

interface IProps {
    children: any,
    id: string
}
const ScrollContent = ({children, id}: IProps) => {

    const [parentWidth, setParentWidth] = useState(0);

    useEffect(() => {
        const parentEl = document.getElementById(id)!;
        setParentWidth(parentEl.clientWidth);
        const handleResize = () => setParentWidth(parentEl.clientWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id, document.getElementById(id)?.clientWidth]);

    return (
        <Box id={id} sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
        }}>
            <Box sx={{
                width: parentWidth,
                maxWidth: '100%',
                display: 'flex',
                flexWrap: 'nowrap',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                gap: '20px',
                pb: '20px',
                "&::-webkit-scrollbar": {
                    height: '10px',
                    borderRadius: '5px',
                    bgcolor: '#dfcdcd'
                },
                "&::-webkit-scrollbar-thumb": {
                    bgcolor: '#a98282',
                    borderRadius: '5px'
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    margin: 'auto'
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
export default ScrollContent
