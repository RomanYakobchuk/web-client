import {useSearchParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Add} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {Box, Button, Divider} from "@mui/material";

import {CreateChatBox} from "@/components/chats/create/createChatBox";
import {ChatBox} from "@/components/chats/chatBox/chatBox";
import {IConversation} from "@/interfaces/common";
import {axiosInstance} from "@/authProvider";
import {ColorModeContext} from "@/contexts";
import {ListChats} from "@/components";
import {useMobile} from "@/hook";

const Chat = () => {
    const {width} = useMobile();
    const {collapsed} = useContext(ColorModeContext);
    const [params, setParams] = useSearchParams();
    const translate = useTranslate();

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [isOpenCreateNewChat, setIsOpenCreateNewChat] = useState<boolean>(false);
    const [currentPlace, setCurrentPlace] = useState<{ _id: string, title: string }>({} as {
        _id: string,
        title: string
    });

    const [newChat, setNewChat] = useState<IConversation | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentChat, setCurrentChat] = useState<IConversation | null>(null);
    const [userId, setUserId] = useState<string>('');
    const [institutionId, setInstitutionId] = useState<string>('');
    const [conversationId, setConversationId] = useState<string>('');

    useEffect(() => {
        if (params.get('firstId') && params.get('secondId')) {
            setUserId(params.get('firstId') as string)
            setInstitutionId(params.get('secondId') as string)
        }
        if (params.get('conversationId')) {
            setConversationId(params.get('conversationId') as string)
        }
    }, [params]);

    useEffect(() => {
        if (userId && institutionId && !conversationId) {
            (async () => {
                const data: any = await axiosInstance.post(`/conversation/findChatByTwoId`, {
                    userId: userId,
                    institutionId: institutionId
                })
                if (data?.data) {
                    setCurrentChat(data?.data)
                } else {
                    const data: any = await axiosInstance.post(`/conversation/create`, {
                        userId: userId,
                        institutionId: institutionId
                    });
                    setCurrentChat(data?.data)
                }
            })();
        } else if (conversationId) {
            (async () => {
                const data = await axiosInstance.get(`/conversation/findById/${conversationId}`);

                if (data?.data) {
                    setCurrentChat(data?.data)
                }
            })()
        }
    }, [userId, institutionId, conversationId]);

    useEffect(() => {
        if (currentChat?._id) {
            setOpenDrawer(true)
        }
    }, [currentChat]);

    useEffect(() => {
        if (institutionId) {
            setCurrentPlace((prevState) => ({...prevState, _id: institutionId}))
        }
    }, [institutionId]);

    useEffect(() => {
        if (newChat) {
            setCurrentChat(newChat)
        }
    }, [newChat]);

    const closeChat = () => {
        setCurrentChat(null)
        setParams({})
        setOpenDrawer(false)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(isOpenCreateNewChat)
        }, 500);
        return () => {
            clearTimeout(timer)
        }
    }, [isOpenCreateNewChat]);
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
                "@media screen and (min-width: 1200px)":{
                    height: 'calc(100% - 90px)'
                },
                p: 2
            }}
        >
            <Box sx={{
                position: 'fixed',
                bottom: '20px',
                zIndex: 1,
                right: '20px',
                height: 'fit-content',
                width: 'fit-content',
                // "@media screen and (min-width: 800px)": {
                //     right: 'unset',
                //     left: '30%'
                // },
                "@media screen and (min-width: 1200px)": {
                    left: `calc(${collapsed ? '150px' : '250px'} + 20%)`
                },
            }}>
                <Button
                    color={'info'}
                    variant={'contained'}
                    sx={{
                        textTransform: 'inherit',
                        fontSize: {xs: '16px', md: '18px'},
                        display: 'flex',
                        minWidth: '30px',
                        alignItems: 'center',
                        width: {xs: '48px', sm: '56px', md: '64px'},
                        height: {xs: '48px', sm: '56px', md: '64px'},
                        borderRadius: '50%',
                        p: 0
                    }}
                    onClick={() => setIsOpenCreateNewChat(true)}
                >
                    <Add fontSize={'large'}/>
                    {/*{translate('buttons.add')}*/}
                    {/*<span style={{*/}
                    {/*    textTransform: 'lowercase',*/}
                    {/*    marginLeft: '5px'*/}
                    {/*}}>*/}
                    {/*        {translate('chats.one')}*/}
                    {/*    </span>*/}
                </Button>
                {
                    isVisible && (
                        <CreateChatBox setNewChat={setNewChat} isOpen={isOpenCreateNewChat} setIsOpen={setIsOpenCreateNewChat}/>
                    )
                }
            </Box>
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
                {/*<SearchInstitutions*/}
                {/*    searchInstitution={currentPlace}*/}
                {/*    setSearchInstitution={setCurrentPlace}*/}
                {/*    typeSearch={role === 'admin' ? 'all' : 'userInstitutions'}*/}
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
                {/*                    // onClick={() => navigate(`/all_institutions/show/${currentChat?.institutionId?._id}`)}*/}
                {/*                    color={"secondary"}*/}
                {/*                    endIcon={<EastOutlined/>}*/}
                {/*                    variant={"outlined"}>*/}
                {/*                    {translate("buttons.details")}*/}
                {/*                </Button>*/}
                {/*            </Box>*/}
                {/*            : <Box sx={{*/}
                {/*                p: '20px'*/}
                {/*            }}>*/}
                {/*                Institution details*/}
                {/*            </Box>*/}
                {/*        : ''*/}
                {/*}*/}
            </Box>
        </Box>
    );
};
export default Chat
