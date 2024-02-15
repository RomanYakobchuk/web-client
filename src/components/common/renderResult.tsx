import {Box, SxProps} from "@mui/material";
import {ReactNode} from "react";

interface IProps {
    children: ReactNode,
    style?: SxProps
}

const RenderResult = ({children, style}: IProps) => {
    return (
        <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '400px',
            overflowY: 'auto',
            width: '100%',
            ...style
        }}>
            {children}
        </Box>
    );
};
export default RenderResult
