import {Box, CircularProgress} from "@mui/material";
import React from "react";

interface IProps {
    height?: string
}
const Loading = ({height}: IProps) => {
    return (
        <Box sx={{
            display: 'flex',
            flex: 1,
            height: '100%',
            // minHeight: height ? height : '90vh',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <CircularProgress color={'secondary'}/>
        </Box>
    );
};

export default Loading