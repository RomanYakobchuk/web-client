import {useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Box, Divider} from "@mui/material";

import {ChatBox} from "@/components/chats/chatBox/chatBox";
import {IConversation} from "@/interfaces/common";
import {axiosInstance} from "@/authProvider";
import {ListChats} from "@/components";
import {useMobile} from "@/hook";
import {useNotification} from "@refinedev/core";

const Chat = () => {
    const {width} = useMobile();
    const [params, setParams] = useSearchParams();
    const {open} = useNotification();

    const [currentPlace, setCurrentPlace] = useState<{ _id: string, title: string }>({} as {
        _id: string,
        title: string
    });

    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentChat, setCurrentChat] = useState<IConversation | null>(null);
    const [userId, setUserId] = useState<string>('');
    const [establishmentId, setestablishmentId] = useState<string>('');
    const [conversationId, setConversationId] = useState<string>('');

    useEffect(() => {
        if (params.get('firstId') && params.get('secondId')) {
            setUserId(params.get('firstId') as string)
            setestablishmentId(params.get('secondId') as string)
        }
        if (params.get('conversationId')) {
            setConversationId(params.get('conversationId') as string)
        }
    }, [params]);

    useEffect(() => {
        if (conversationId) {
            (async () => {
                try {
                    const data = await axiosInstance.get(`/conversation/findById/${conversationId}`);

                    if (data?.data) {
                        setCurrentChat(data?.data)
                    }
                } catch (e: any) {
                    open?.({
                        type: 'error',
                        message: 'Error',
                        description: e?.response?.data?.error
                    })
                }
            })()
        }
    }, [conversationId]);
    // useEffect(() => {
    //     if (userId && establishmentId && !conversationId) {
    //         (async () => {
    //             const data: any = await axiosInstance.post(`/conversation/findChatByTwoId`, {
    //                 userId: userId,
    //                 establishmentId: establishmentId
    //             })
    //             if (data?.data) {
    //                 setCurrentChat(data?.data)
    //             } else {
    //                 const data: any = await axiosInstance.post(`/conversation/create`, {
    //                     userId: userId,
    //                     establishmentId: establishmentId
    //                 });
    //                 setCurrentChat(data?.data)
    //             }
    //         })();
    //     } else if (conversationId) {
    //         (async () => {
    //             try {
    //                 const data = await axiosInstance.get(`/conversation/findById/${conversationId}`);
    //
    //                 if (data?.data) {
    //                     setCurrentChat(data?.data)
    //                 }
    //             } catch (e: any) {
    //                 open?.({
    //                     type: 'error',
    //                     message: 'Error',
    //                     description: e?.response?.data?.error
    //                 })
    //             }
    //         })()
    //     }
    // }, [userId, establishmentId, conversationId]);

    useEffect(() => {
        if (currentChat?._id) {
            setOpenDrawer(true)
        }
    }, [currentChat]);

    useEffect(() => {
        if (establishmentId) {
            setCurrentPlace((prevState) => ({...prevState, _id: establishmentId}))
        }
    }, [establishmentId]);

    const closeChat = () => {
        setCurrentChat(null)
        setParams({})
        setOpenDrawer(false)
    }
    return (
        <Box
            sx={{
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                gap: 1,
                width: '100%',
                minHeight: 'calc(100% - 90px)',
                height: 'fit-content',
                "@media screen and (min-width: 1200px)": {
                    height: 'calc(100% - 90px)'
                },
                p: 2
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: width <= 800 ? 0 : 2,
                    flex: 1,
                    width: '100%'
                }}
            >
                <Box sx={{
                    flex: 1,
                    minWidth: '275px',
                    height: '100%',
                    // borderRight: width > 800 ? `2px solid ${mode === 'dark' ? 'silver' : 'black'}` : 'unset',
                    // px: 1,
                }}>
                    <ListChats setOpenDrawer={setOpenDrawer} setCurrentChat={setCurrentChat}/>
                </Box>
                <Divider
                    orientation={'horizontal'}
                    sx={{
                        height: '100%',
                        width: '2px',
                        bgcolor: 'common.white',
                        display: 'none',
                        "@media screen and (min-width: 1200px)": {
                            display: 'block'
                        }
                    }}
                />
                <ChatBox
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                    closeChat={closeChat}
                />
                {/*<Box sx={{*/}
                {/*    flex: 1,*/}
                {/*}}>*/}
                {/*<CanAccess resource={'chats'} action={'searchChatsByPlace'}>*/}
                {/*    <Box>*/}
                {/*<Searchestablishments*/}
                {/*    searchestablishment={currentPlace}*/}
                {/*    setSearchestablishment={setCurrentPlace}*/}
                {/*    typeSearch={role === 'admin' ? 'all' : 'userestablishments'}*/}
                {/*/>*/}
                {/*</Box>*/}
                {/*</CanAccess>*/}
                {/*</Box>*/}
                {/*{*/}
                {/*    width > 1200 ? currentChat?._id ?*/}
                {/*            <Box sx={{*/}
                {/*                flex: 1,*/}
                {/*                width: '100%',*/}
                {/*                display: 'flex',*/}
                {/*                flexDirection: 'column',*/}
                {/*                alignItems: 'center',*/}
                {/*                gap: 1*/}
                {/*            }}>*/}
                {/*                <img*/}
                {/*                    src={currentChat?.chatInfo?.field?.id?.avatar}*/}
                {/*                    alt={currentChat?.chatInfo?.field?.id?.name}*/}
                {/*                    style={{*/}
                {/*                        width: '100px',*/}
                {/*                        height: '100px',*/}
                {/*                        borderRadius: '50%',*/}
                {/*                        objectFit: 'cover'*/}
                {/*                    }}*/}
                {/*                />*/}
                {/*                {currentChat?.chatInfo?.field?.id?.name}*/}
                {/*                <Button*/}
                {/*                    sx={{*/}
                {/*                        fontSize: {xs: '12px', sm: '14px'},*/}
                {/*                        width: '100%',*/}
                {/*                        minWidth: '100px',*/}
                {/*                        mt: 1*/}
                {/*                    }}*/}
                {/*                    // onClick={() => navigate(`/all_establishments/show/${currentChat?.establishmentId?._id}`)}*/}
                {/*                    color={"secondary"}*/}
                {/*                    endIcon={<EastOutlined/>}*/}
                {/*                    variant={"outlined"}>*/}
                {/*                    {translate("buttons.details")}*/}
                {/*                </Button>*/}
                {/*            </Box>*/}
                {/*            : <Box sx={{*/}
                {/*                p: '20px'*/}
                {/*            }}>*/}
                {/*                establishment details*/}
                {/*            </Box>*/}
                {/*        : ''*/}
                {/*}*/}
            </Box>
        </Box>
    );
};
export default Chat
