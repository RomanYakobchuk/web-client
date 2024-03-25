import {Box, IconButton, Typography} from "@mui/material";
import {InfoCircleOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useTranslate} from "@refinedev/core";
import {Image} from "antd";

import {IConversation, ProfileProps, IConvMembers} from "@/interfaces/common";
import {ESTABLISHMENT, SHOW} from "@/config/names";
import {InfoRounded, LaunchRounded} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {TruncateSingleText} from "@/utils";
import {CustomDrawer} from "@/components";
import {useMobile} from "@/hook";


type TProps = {
    conversation: IConversation
}
const ChatBoxInfo = ({conversation}: TProps) => {
    const {width} = useMobile();
    const translate = useTranslate();

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (openDrawer) {
            setIsVisible(openDrawer)
        } else {
            setTimeout(() => {
                setIsVisible(openDrawer)
            }, 1000)
        }
    }, [openDrawer]);

    return (
        <Box>
            {
                width < 1350 && (
                    <>
                        <IconButton
                            onClick={() => setOpenDrawer(true)}
                        >
                            <InfoRounded/>
                        </IconButton>
                        {
                            isVisible && (
                                <CustomDrawer
                                    isScaleRoot={true}
                                    open={openDrawer}
                                    title={
                                        <Box sx={{
                                            fontSize: {xs: '18px', md: '20px'},
                                            fontWeight: 600
                                        }}>
                                            {translate('text.info')}
                                        </Box>
                                    }
                                    maxWidth={'500px'}
                                    anchor={'right'}
                                    toggleDrawer={setOpenDrawer}
                                >
                                    <ChatBoxInfoBody chat={conversation}/>
                                </CustomDrawer>
                            )
                        }
                    </>
                )
            }

        </Box>
    );
};
type TChatBoxInfoBody = {
    chat: IConversation
}
export const ChatBoxInfoBody = ({chat}: TChatBoxInfoBody) => {
    const navigate = useNavigate();
    const translate = useTranslate();

    const users = chat?.members?.filter((member) => member?.showInfoAs?.item === 'user')?.map((member) => ({
        ...member,
        user: member?.user as ProfileProps
    }));

    const establishment = chat?.members?.filter((member) => member?.showInfoAs?.item === 'establishment')?.map((member) => ({
        ...member,
        user: member?.user as ProfileProps
    }));


    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            color: 'common.white',
            overflowX: 'hidden',
            overflowY: 'auto',
            height: '100%'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}>
                <Box
                    sx={{
                        "& .MuiTypography-root": {
                            fontSize: '1.2rem',
                            fontWeight: 600
                        }
                    }}
                >
                    {
                        establishment && establishment?.length > 0 && (
                            <>
                                <Typography>
                                    {translate('home.one')}
                                </Typography>
                                <Box
                                    sx={{
                                        width: '100%'
                                    }}
                                >
                                    {
                                        establishment?.map((item, index) => (
                                            <Box
                                                key={item?.user?._id + index}
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <ChatBoxInfoMember
                                                    member={item}
                                                />
                                                <IconButton
                                                    color={'info'}
                                                    onClick={() => {
                                                        navigate(`/${ESTABLISHMENT}/${SHOW}/${item?.user?._id}`)
                                                    }}
                                                >
                                                    <LaunchRounded/>
                                                </IconButton>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </>
                        )
                    }
                    {
                        users && users?.length > 0 && (
                            <>
                                <Typography>
                                    {translate('all-users.all-users')}
                                </Typography>
                                <Box>
                                    {
                                        users?.map((item, index) => (
                                            <ChatBoxInfoMember
                                                key={item?.user?._id + index}
                                                member={item}
                                            />
                                        ))
                                    }
                                </Box>
                            </>
                        )
                    }
                </Box>
            </Box>
        </Box>
    )
}

type TChatBoxInfoMember = {
    member: IConvMembers & { user: ProfileProps }
}
const ChatBoxInfoMember = ({member}: TChatBoxInfoMember) => {
    return (
        <Box
            sx={{
                width: '100%',
                px: 2,
                py: 1,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                overflow: 'hidden'
            }}
        >
            <Box sx={{
                width: '42px',
                height: '42px',
                overflow: 'hidden',
                "& div.ant-image": {
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                },
                borderRadius: '50%',
            }}>
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                    preview={{
                        zIndex: 1301
                    }}
                    src={member?.user?.avatar}/>
            </Box>
            <TruncateSingleText
                styles={{
                    width: 'fit-content',
                    maxWidth: 'calc(100% - 42px - 16px)'
                }}
                str={member?.user?.name}
            />
        </Box>
    )
}

export default ChatBoxInfo;