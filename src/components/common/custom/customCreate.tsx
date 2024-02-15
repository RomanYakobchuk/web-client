import React, {ReactNode, useContext} from "react";
import {Create, SaveButton} from "@refinedev/antd";
import {Breadcrumb} from "antd";
import {useTranslate} from "@refinedev/core";
import {Box, Typography as MuiTypography} from "@mui/material";
import {ArrowBackOutlined, Close} from "@mui/icons-material";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {ItemType} from "antd/es/breadcrumb/Breadcrumb";

import './custom.css';
import {ColorModeContext} from "@/contexts";

type TProps = {
    isLoading: boolean,
    children: ReactNode,
    showButtons?: boolean,
    bgColor?: 'transparent' | string,
    onClick?: () => void,
    breadCrumbItems?: ItemType[],
    headerTitle?: string,
    saveButtonText?: string,
    maxWidth?: string
}

const CustomCreate = ({isLoading, children, bgColor, onClick, breadCrumbItems, headerTitle, saveButtonText, maxWidth}: TProps) => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const navigate = useNavigate();
    return (
        <Box sx={{
            width: '100%',
            "& .ant-card-actions": {
                bgcolor: 'transparent !important',
                borderTop: 'unset !important'
            },
            "& li span div.ant-space": {
                mr: 'unset !important',
                float: 'unset !important',
                width: '100% !important',
                "& > div": {
                    width: '100% !important',
                    p: '20px'
                }
            }
        }}>
            <Create
                isLoading={isLoading}
                contentProps={{
                    style: {
                        background: bgColor ? bgColor : mode === 'dark' ? "#3e3e36" : '#fff',
                        padding: '0',
                        boxShadow: 'unset'
                    },
                }}
                headerButtons={[]}
                headerProps={{
                    title: <MuiTypography
                        sx={{
                            fontSize: '18px',
                            color: mode === 'dark' ? '#fcfcfc' : '#000'
                        }}
                    >{headerTitle ? headerTitle : translate('buttons.create')}</MuiTypography>,
                    style: {
                        color: mode === 'dark' ? '#fcfcfc' : '#000',
                        padding: '10px',
                        maxWidth: maxWidth ? maxWidth : '1100px',
                        margin: '0 auto'
                    },
                    backIcon: <ArrowBackOutlined sx={{
                        color: mode === 'dark' ? '#fcfcfc' : '#000'
                    }}/>
                }}
                footerButtons={({saveButtonProps}) => (
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        "& button": {
                            flex: '1 1 150px'
                        }
                    }}>
                        <Button
                            size={'large'}
                            style={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={() => navigate(-1)}
                            icon={<Close/>}
                        >
                            {translate('buttons.cancel')}
                        </Button>
                        {saveButtonProps && (
                            <SaveButton size={"large"} style={{
                                background: '#2874CB'
                            }} {...saveButtonProps} onClick={onClick}>{saveButtonText && saveButtonText}</SaveButton>
                        )}
                    </Box>
                )}
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
                        "& nav ol li.ant-breadcrumb-separator": {
                            color: mode === 'dark' ? '#fcfcfc' : '#000'
                        },
                    }}>
                        <Breadcrumb
                            items={breadCrumbItems}
                        />
                    </Box>
                }
            >
                {children}
            </Create>
        </Box>
    );
};
export default CustomCreate
