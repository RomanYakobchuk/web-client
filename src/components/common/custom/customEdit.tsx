import {Box, SxProps, Typography} from "@mui/material";
import {Breadcrumb, DeleteButton, Edit, SaveButton} from "@refinedev/antd";
import React, {ReactNode, useContext} from "react";
import {Button} from "antd";
import {useTranslate} from "@refinedev/core";
import {ArrowBackOutlined, Close} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

import {ColorModeContext} from "../../../contexts";

type TProps = {
    children: ReactNode,
    isLoading: boolean,
    bgColor?: string,
    onClick?: () => void,
    style?: SxProps
}

const CustomEdit = ({children, isLoading, bgColor, onClick, style}: TProps) => {

    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const translate = useTranslate();

    return (
        <Box sx={{
            width: '100%',
            "& .ant-card-actions": {
                bgcolor: 'transparent !important',
                borderTop: 'unset !important'
            },
            "& li span div.ant-space":{
                mr: 'unset !important',
                float: 'unset !important',
                width: '100% !important',
                "& > div":{
                    width: '100% !important',
                    p: '20px'
                }
            },
            ...style
        }}>
            <Edit
                isLoading={isLoading}
                contentProps={{
                    style: {
                        background: bgColor ? bgColor : mode === 'dark' ? "#4d4d44" : '#fff',
                        padding: '0',
                        boxShadow: 'unset'
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
                    }}/>,
                }}
                footerButtons={({saveButtonProps, deleteButtonProps}) => (
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        "& button":{
                            flex: '1 1 150px'
                        }
                    }}>
                        <Button
                            size={'large'}
                            style={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => navigate(-1)}
                            icon={<Close/>}
                        >
                            {translate('buttons.cancel')}
                        </Button>
                        {deleteButtonProps && (
                            <DeleteButton size={"large"} {...deleteButtonProps}/>
                        )}
                        {saveButtonProps && (
                            <SaveButton size={"large"} {...saveButtonProps} onClick={onClick}/>
                        )}
                    </Box>
                )}
                footerButtonProps={{
                    // onClick: onClick,
                    // color: 'transparent',
                    // style: {
                    //     color: mode === 'dark' ? '#fcfcfc' : '#000',
                    //     padding: '10px',
                    //     maxWidth: '1100px',
                    //     margin: '0 auto',
                    //     background: 'transparent'
                    // }
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
                        "& nav ol li.ant-breadcrumb-separator": {
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
        </Box>
    );
};
export default CustomEdit
