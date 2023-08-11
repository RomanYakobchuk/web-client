import {Box, Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {CanAccess, useTranslate} from "@refinedev/core";
import {EastOutlined} from "@mui/icons-material";

import {axiosInstance} from "../../authProvider";
import {useMobile, useRole} from "../../utils";
import {CurrentChatContainer, CustomDrawer, ListChats, SearchInstitutions} from "../../components";
import {IConversation} from "../../interfaces/common";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(utc);
dayjs.extend(timezone);
const Chat = () => {
    const {device, width} = useMobile();
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const translate = useTranslate();
    const {role} = useRole();

    const [currentPlace, setCurrentPlace] = useState<string>('');

    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentChat, setCurrentChat] = useState<IConversation>({} as IConversation);
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
            setCurrentPlace(institutionId)
        }
    }, [institutionId]);

    const closeChat = () => {
        setCurrentChat({} as IConversation)
        setParams({})
        setOpenDrawer(false)
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%',
                height: '95%'
            }}
        >
            <Box>
                Title
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    gap: 2,
                    flex: {xs: '1', sm: '1 3 1'},
                    width: '100%'
                }}
            >
                <Box sx={{
                    flex: 1,
                    minWidth: '300px'
                }}>
                    <CanAccess resource={'chats'} action={'searchChatsByPlace'}>
                        <Box>
                            <SearchInstitutions
                                searchPlace={currentPlace}
                                setSearchPlace={setCurrentPlace}
                                typeSearch={role === 'admin' ? 'all' : 'userInstitutions'}
                            />
                        </Box>
                    </CanAccess>
                    <ListChats setOpenDrawer={setOpenDrawer} setCurrentChat={setCurrentChat}/>
                </Box>
                {
                    (width < 900 || device) ?
                        <CustomDrawer
                            anchor={device ? 'bottom' : 'right'}
                            toggleDrawer={setOpenDrawer}
                            open={openDrawer}
                            closeWithOtherData={closeChat}
                            title={<Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 2,
                                m: '-10px'
                            }}>
                                {
                                    openDrawer && currentChat?._id ?
                                        <>
                                            <img
                                                src={role === 'user' ? currentChat?.institutionId?.mainPhoto : role === 'manager' ? currentChat?.userId?.avatar : currentChat?.institutionId?.mainPhoto}
                                                alt={role === 'user' ? currentChat?.institutionId?.title : role === 'manager' ? currentChat?.userId?.name : ''}
                                                style={{
                                                    width: '46px',
                                                    height: '46px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            {
                                                role === 'user' ? currentChat?.institutionId?.title : role === 'manager' ? currentChat?.userId?.name : `${currentChat?.institutionId?.title} - ${currentChat?.userId?.name}`
                                            }
                                            {
                                                role === 'admin'
                                                    ? <img
                                                        src={currentChat?.userId?.avatar}
                                                        alt={currentChat?.userId?.name}
                                                        style={{
                                                            width: '46px',
                                                            height: '46px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                    /> : ''
                                            }
                                        </> : <Box sx={{
                                            fontSize: '23px'
                                        }}>
                                            Change chat
                                        </Box>
                                }
                            </Box>
                            }
                            button={<></>}
                        >
                            {
                                openDrawer && currentChat?._id ?
                                    <CurrentChatContainer
                                        setOpenDrawer={setOpenDrawer}
                                        setCurrentChat={setCurrentChat}
                                        conversation={currentChat}
                                    /> : 'Change chat for send messages'
                            }
                        </CustomDrawer>
                        : currentChat?._id ?
                            <Box sx={{
                                flex: 2,
                                borderRadius: '10px',
                                p: '15px',
                                bgcolor: "primary.main",
                                maxHeight: '80vh',
                                width: (900 < width && width < 950) ? '330px' : 'auto'
                            }}>
                                <CurrentChatContainer
                                    setOpenDrawer={setOpenDrawer}
                                    setCurrentChat={setCurrentChat}
                                    conversation={currentChat}
                                />
                            </Box>
                            : <Box
                                sx={{
                                    flex: 2,
                                    width: '100%',
                                    p: '20px'
                                }}
                            >
                                Change chat for send message
                            </Box>
                }
                {
                    width > 1200 ? currentChat?._id ?
                            <Box sx={{
                                flex: 1,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <img
                                    src={currentChat?.institutionId?.mainPhoto}
                                    alt={currentChat?.institutionId?.title}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {currentChat?.institutionId?.title}
                                <Button
                                    sx={{
                                        fontSize: {xs: '12px', sm: '14px'},
                                        width: '100%',
                                        minWidth: '100px',
                                        mt: 1
                                    }}
                                    onClick={() => navigate(`/all_institutions/show/${currentChat?.institutionId?._id}`)}
                                    color={"secondary"}
                                    endIcon={<EastOutlined/>}
                                    variant={"outlined"}>
                                    {translate("buttons.details")}
                                </Button>
                            </Box>
                            : <Box sx={{
                                p: '20px'
                            }}>
                                Institution details
                            </Box>
                        : ''
                }
            </Box>
        </Box>
    );
};
export default Chat
