import {Box} from "@mui/material";

import {useMobile} from "../../../hook";
import {ReactNode, useEffect} from "react";
import {touchScroll} from "./touchScroll";

type TProps = {
    children: ReactNode,
    parentWidth?: string,
    class_name?: string
}

const ScrollContent = ({children, parentWidth}: TProps) => {

    const {layoutWidth} = useMobile();
    if (!parentWidth) {
        parentWidth = `calc(${layoutWidth}px - 10vw)`
    }


    useEffect(() => {
        touchScroll('.class_scroll_content')
    }, [children]);
    return (
        <Box sx={{
            width: parentWidth,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
        }}>
            <Box
                className={'class_scroll_content'}
                sx={{
                    width: '100%',
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
                        bgcolor: 'transparent'
                    },
                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: '#a98282',
                        borderRadius: '5px'
                    }
                }}>
                <Box id={'childrenScrollContent'} sx={{
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
