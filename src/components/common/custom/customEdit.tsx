import {Box, Typography} from "@mui/material";
import {ListButton} from "@refinedev/mui";
import {Breadcrumb, Edit} from "@refinedev/antd";
import React, {ReactNode, useContext} from "react";
import {ButtonProps} from "antd";
import {ColorModeContext} from "../../../contexts";
import {useTranslate} from "@refinedev/core";
import { ArrowBackOutlined } from "@mui/icons-material";

interface IProps {
    saveButtonProps?: ButtonProps & {onClick: () => void },
    children: ReactNode,
    isLoading: boolean,
    bgColor?: string
}
const CustomEdit = ({saveButtonProps, children, isLoading, bgColor}: IProps) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    return (
        <Edit
            isLoading={isLoading}
            contentProps={{
                style: {
                    background: bgColor ? bgColor : mode === 'dark' ? "#4d4d44" : '#fff',
                    padding: '0'
                },
            }}
            headerProps={{
                title: <Typography
                    sx={{
                        color: mode === 'dark' ? '#fcfcfc' : '#000',
                        fontSize: '18px'
                    }}
                >{translate('actions.edit')}</Typography>,
                style: {
                    color: mode === 'dark' ? '#fcfcfc' : '#000',
                    padding: '10px',
                    maxWidth: '1100px',
                    margin: '0 auto'
                },
                backIcon: <ArrowBackOutlined sx={{
                    color: mode === 'dark' ? '#fcfcfc' : '#000'
                }}/>
            }}
            headerButtons={[]}
            breadcrumb={
                <Box sx={{
                    color: mode === 'dark' ? '#fcfcfc' : '#000',
                    "& nav ol li > span": {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        color: mode === 'dark' ? '#fcfcfc' : '#000'
                    },
                    "& nav ol li > span > div > a": {
                        color: mode === 'dark' ? '#d0c9c9' : '#2c2121'
                    },
                    "& nav ol li.ant-breadcrumb-separator" : {
                        color: mode === 'dark' ? '#fcfcfc' : '#000'
                    }
                }}>
                    <Breadcrumb breadcrumbProps={{
                        style: {
                            color: mode === 'dark' ? '#fcfcfc' : '#000'
                        }
                    }}/>
                </Box>
            }
        >
            {children}
        </Edit>
    );
};
export default CustomEdit
