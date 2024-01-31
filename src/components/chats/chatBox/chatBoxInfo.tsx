import React, {useContext, useEffect, useState} from "react";
import {Box, IconButton} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Image} from "antd";

import {IConversation, IConvMembers, ProfileProps, PropertyProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {CustomDrawer} from "@/components";


type TProps = {
    conversation: IConversation
}
const ChatBoxInfo = ({conversation}: TProps) => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [chat, setChat] = useState<IConversation>(conversation);

    useEffect(() => {
        if (openDrawer) {
            setIsVisible(openDrawer)
        } else {
            setTimeout(() => {
                setIsVisible(openDrawer)
            }, 1000)
        }
    }, [openDrawer]);
    useEffect(() => {
        if (conversation) {
            setChat(conversation)
        }
    }, [conversation]);

    const isChatEstablishment = {
        is: conversation?.chatInfo?.field?.name === 'institution',
        id: typeof conversation?.chatInfo?.field?.id === 'object' ? conversation?.chatInfo?.field?.id?._id : conversation?.chatInfo?.field?.id
    }
    console.log(isChatEstablishment)
    return (
        <Box>
            <IconButton
                onClick={() => setOpenDrawer(true)}
            >
                <InfoCircleOutlined/>
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
                        maxWidth={'600px'}
                        anchor={'right'}
                        toggleDrawer={setOpenDrawer}
                    >
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <Box sx={{
                                width: {xs: '150px', sm: '175px', md: '200px'},
                                height: {xs: '150px', sm: '175px', md: '200px'},
                                m: '0 auto',
                                "& div.ant-image": {
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                },
                                borderRadius: '50%',
                                p: 0.5,
                                border: `3px solid ${mode === 'dark' ? '#f9f9f9' : '#151515'}`
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
                                    src={chat?.chatInfo?.picture}/>
                            </Box>
                            <Box sx={{
                                m: '0 auto',
                                fontSize: {xs: '20px', sm: '22px', md: '24px'},
                                fontWeight: 600
                            }}>
                                {chat?.chatInfo?.chatName}
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                // gap: 2,
                                width: '100%',
                                p: 2,
                                borderRadius: '10px',
                                bgcolor: 'common.black',
                                boxShadow: '0px 4px 8px rgba(125, 125, 125, 0.2)',
                            }}>
                                {
                                    chat?.members?.map((member, index) => {
                                        const memberUser = member?.user as ProfileProps;

                                        const image = memberUser?.avatar;
                                        const name = memberUser?.name;
                                        const byFieldName = {
                                            institution: () => {
                                                if (typeof chat?.chatInfo?.field?.id === 'object') {
                                                    const e = chat?.chatInfo?.field?.id as PropertyProps;
                                                    if (e?.createdBy === memberUser?._id) {
                                                        return {
                                                            picture: e?.pictures?.length > 0 && e?.pictures[0]?.url || '',
                                                            title: e?.title as string
                                                        };
                                                    }
                                                    return {
                                                        picture: image,
                                                        title: name
                                                    };
                                                }
                                                return {
                                                    picture: image,
                                                    title: name
                                                };
                                            },
                                            user: () => ({
                                                picture: image,
                                                title: name
                                            }),
                                            capl: () => ({
                                                picture: image,
                                                title: name
                                            }),
                                        }
                                        const {picture, title} = byFieldName[chat?.chatInfo?.field?.name]();


                                        return (
                                            <Box
                                                key={memberUser?._id + index}
                                                sx={{
                                                    width: '100%',
                                                    p: 2,
                                                    display: 'flex',
                                                    gap: 2,
                                                    alignItems: 'center',
                                                    "&:not(:last-of-type)": {
                                                        position: 'relative',
                                                        "&::after": {
                                                            content: "''",
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            width: '100%',
                                                            height: '2px',
                                                            bgcolor: 'silver',
                                                            right: 0
                                                        }
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    width: '42px',
                                                    height: '42px',
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
                                                        src={picture}/>
                                                </Box>
                                                <Box
                                                    className={'chatBoxInfo_userInfoCard'}
                                                >
                                                    {title}
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        </Box>
                    </CustomDrawer>
                )
            }
        </Box>
    );
};


export default ChatBoxInfo;