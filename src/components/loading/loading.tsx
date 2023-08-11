import {Box, CircularProgress} from "@mui/material";
import React, {useContext} from "react";

import './loading.css';
import {ColorModeContext} from "../../contexts";

interface IProps {
    height?: string
}
const Loading = ({height}: IProps) => {
    const {mode} = useContext(ColorModeContext);
    return (
        <Box sx={{
            display: 'flex',
            flex: 1,
            height: height ? height : '100%',
            // minHeight: height ? height : '90vh',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <span className={'loader'} style={{
                color: mode === 'dark' ? '#fff' : '#000'
            }}></span>
            {/*<CircularProgress color={'secondary'}/>*/}
        </Box>
    );
};

export default Loading