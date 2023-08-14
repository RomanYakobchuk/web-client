import {Box} from "@mui/material";
import {useContext} from "react";

import {ColorModeContext} from "../../contexts";
import {useMobile} from "../../utils";

interface IProps {
    children: any,
}

const ScrollContent = ({children}: IProps) => {

    const {collapsed} = useContext(ColorModeContext);
    const {layoutWidth} = useMobile();

    return (
        <Box sx={{
            width: {xs: '87vw', md: `calc(${layoutWidth}px - 13vw)`},
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
        }}>
            <Box sx={{
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
