import {Box, Typography} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import React, {useContext} from "react";
import {useTranslate} from "@refinedev/core";
import {ColorModeContext} from "@/contexts";

type TProps = {
    description: string
}
export const MainDescription = ({description}: TProps) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    return (
        <Box sx={{
            bgcolor: 'modern.modern_1.main',
            p: '10px',
            borderRadius: '15px',
        }}>
            <Typography variant={'h5'} sx={{
                color: 'common.white'
            }}>
                {translate('home.create.description')}
            </Typography>
            <Box sx={{
                width: '100%',
            }}>
                <MDEditor.Markdown source={description}
                                   style={{
                                       whiteSpace: 'break-spaces',
                                       fontSize: "14px",
                                       padding: "5px 0",
                                       background: 'transparent',
                                       color: mode === 'dark' ? '#fff' : '#000'
                                   }}/>
            </Box>
        </Box>
    );
};

