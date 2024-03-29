import {Box, SxProps, Typography} from "@mui/material";
import {Breadcrumb, DeleteButton, Edit, SaveButton, SaveButtonProps} from "@refinedev/antd";
import React, {ReactNode, useContext} from "react";
import {Button} from "antd";
import {useBack, useTranslate} from "@refinedev/core";
import {ArrowBackOutlined, Close} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {ItemType} from "antd/es/breadcrumb/Breadcrumb";

import {ColorModeContext} from "@/contexts";

type TProps = {
    children: ReactNode,
    isLoading: boolean,
    bgColor?: string,
    onClick?: () => void,
    style?: SxProps,
    maxWidth?: string,
    breadCrumbItems?: ItemType[],
    // currentSaveButtonsProps?: SaveButtonProps
}

const CustomEdit = ({children, isLoading, bgColor, onClick, style, maxWidth = '1100px', breadCrumbItems}: TProps) => {

    const back = useBack();

    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const translate = useTranslate();

    const currentBreadCrumbItems = breadCrumbItems && breadCrumbItems?.length > 0 ? {items: breadCrumbItems} : null
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
                headerButtons={[]}
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
                        maxWidth: maxWidth,
                        margin: '0 auto'
                    },
                    backIcon: <ArrowBackOutlined sx={{
                        color: mode === 'dark' ? '#fcfcfc' : '#000'
                    }}/>,
                    onBack: back
                }}
                footerButtons={({saveButtonProps, deleteButtonProps}) => (
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
                        {(saveButtonProps) && (
                            <SaveButton style={{
                                background: '#2874CB'
                            }} size={"large"} {...saveButtonProps} onClick={onClick}/>
                        )}
                    </Box>
                )}
                goBack={<Button>
                    <ArrowBackOutlined sx={{
                        color: mode === 'dark' ? '#fcfcfc' : '#000'
                    }}/>
                </Button>}
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
                        <Breadcrumb
                            breadcrumbProps={{
                                style: {
                                    color: mode === 'dark' ? '#fcfcfc' : '#000'
                                },
                                ...currentBreadCrumbItems
                            }}
                        />
                    </Box>
                }
            >
                {children}
            </Edit>
        </Box>
    );
};
export default CustomEdit
