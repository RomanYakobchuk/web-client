import {useOne, useTranslate} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import {ErrorComponent} from "@refinedev/mui";
import {useNavigate} from "react-router-dom";
import {Box, Button} from "@mui/material";

import {CurrentChatContainer, CustomDrawer, Loading} from "@/components";
import ChatBoxInfo, {ChatBoxInfoBody} from "@/components/chats/chatBox/chatBoxInfo";
import LottieComponent from "@/lotties/LottieComponent";
import RobotHiLottie from "@/lotties/robot_hi.json";
import {IConversation, ProfileProps} from "@/interfaces/common";
import {CHATS, SHOW} from "@/config/names";
import {TruncateSingleText} from "@/utils";
import {socket} from "@/socketClient";
import {useChats} from "@/indexedDB";
import {useMobile, useUserInfo} from "@/hook";
import NoAvatar from "../.././../../public/images/chats/noAvatar.png";

type TProps = {
    conversationId: string
}
export const ChatBox = ({conversationId}: TProps) => {
    const {width} = useMobile();
    const translate = useTranslate();

    const {findChat, deleteChat} = useChats();
    const navigate = useNavigate();

    const [isUserCanJoin, setIsUserCanJoin] = useState<boolean>(false)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [currentChat, setCurrentChat] = useState<IConversation | null>(null);

    const {isError, error, isLoading, data, refetch} = useOne<IConversation>({
        resource: 'conversation/findById',
        id: conversationId as string,
        queryOptions: {
            retry: 3,
        }
    })
    useEffect(() => {
        if (conversationId) {
            const chatInfoDB = async () => {
                const chat = await findChat({_id: conversationId});
                if (chat) {
                    setCurrentChat(chat);
                    setOpenDrawer(true)
                }
            }
            const chatInfoApi = () => {
                if (data?.data) {
                    setCurrentChat(data?.data)
                    setOpenDrawer(true)
                }
            }
            //         if (e?.response?.status == 403 && e?.response?.data?.isUserCanJoin) {
            //             setIsUserCanJoin(true);
            //         } else setIsUserCanJoin(false);
            chatInfoDB();
            chatInfoApi();
        }
    }, [conversationId, data?.data]);

    useEffect(() => {
        if (error?.response?.data?.code == 404 && conversationId) {
            const removeChatFromDB = async () => {
                await deleteChat(conversationId)
                closeChat();
            }
            removeChatFromDB();
        }
    }, [error, conversationId]);
    useEffect(() => {
        if (error?.response?.status == 403 && error?.response?.data?.isUserCanJoin) {
            setIsUserCanJoin(true);
        } else setIsUserCanJoin(false);
    }, [error]);
    const closeChat = () => {
        socket.emit('leaveChat', currentChat?._id)
        setOpenDrawer(false);
        if (currentChat) {
            setCurrentChat(null);
        }
        navigate(`/${CHATS}/${SHOW}/`);
    }

    const reFetchChatInfo = () => {
        if (isUserCanJoin) {
            refetch();
        }
    }
    return (
        <>
            {
                currentChat && width < 768 && (
                    <CustomDrawer
                        contentStyle={{
                            minWidth: '100%',
                            p: 0,
                            "& > div": {
                                overflow: 'hidden',
                                "& > div": {
                                    height: '100%'
                                }
                            }
                        }}
                        bgColor={'common.black'}
                        anchor={'right'}
                        toggleDrawer={setOpenDrawer}
                        open={openDrawer}
                        maxWidth={'100%'}
                        closeWithOtherData={closeChat}
                        showDefaultHeader={false}
                        title={''}
                        button={<></>}
                    >
                        <Box sx={{
                            height: '100%',
                            width: '100%',
                        }}>
                            <CurrentChatContainer
                                setOpenDrawer={setOpenDrawer}
                                setCurrentChat={setCurrentChat}
                                conversation={currentChat}
                                closeChat={closeChat}
                                header={
                                    <Box sx={{
                                        py: 1,
                                        width: '100%',
                                        overflow: 'hidden'
                                    }}>
                                        <ChatHeader currentChat={currentChat}/>
                                    </Box>
                                }
                            />
                        </Box>
                    </CustomDrawer>
                )
            }
            {
                width >= 768 && (
                    <Box sx={{
                        overflow: 'hidden',
                        height: '100%',
                        width: '100%'
                    }}>
                        <Box sx={{
                            height: '100%',
                            width: 'auto',
                            "@media screen and (max-width: 950px && min-width: 900px)": {
                                width: '330px'
                            },
                            display: 'flex',
                            border: '1px solid transparent',
                            borderLeftColor: 'silver'
                        }}>
                            {
                                !isUserCanJoin && currentChat ? (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                        }}
                                    >
                                        <CurrentChatContainer
                                            setOpenDrawer={setOpenDrawer}
                                            setCurrentChat={setCurrentChat}
                                            conversation={currentChat}
                                            closeChat={closeChat}
                                            header={<ChatHeader currentChat={currentChat}/>}
                                        />
                                        {
                                            width >= 1350 && (
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        maxWidth: {xs: '350px', xl: '450px'},
                                                        py: 2,
                                                        px: 1,
                                                        border: '1px solid transparent',
                                                        borderLeftColor: 'silver',
                                                        "@media screen and (max-width: 1350px)": {
                                                            display: 'none'
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{
                                                        color: 'common.white',
                                                        margin: '0 auto 10px',
                                                        width: 'fit-content',
                                                        fontSize: {xs: '18px', md: '20px'},
                                                        fontWeight: 600
                                                    }}>
                                                        {translate('text.info')}
                                                    </Box>
                                                    <ChatBoxInfoBody chat={currentChat}/>
                                                </Box>
                                            )
                                        }
                                    </Box>
                                ) : isUserCanJoin && !currentChat
                                    ? (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'end',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '90%',
                                                    maxWidth: '450px',
                                                    height: '300px',
                                                    borderRadius: '10px',
                                                    bgcolor: 'common.black',
                                                    p: 2,
                                                    m: '20px auto',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {
                                                    (isLoading && !isError) ? <Loading/>
                                                        : isUserCanJoin
                                                            ? <Button
                                                                variant={'text'}
                                                                color={'info'}
                                                                sx={{
                                                                    textTransform: 'inherit'
                                                                }}
                                                            >
                                                                {translate('buttons.join')}
                                                            </Button>
                                                            : <ErrorComponent/>
                                                }
                                            </Box>
                                        </Box>
                                    )
                                    : (
                                        <ChooseConversation/>
                                    )
                            }
                        </Box>
                    </Box>
                )
            }
        </>
    );
};

export const ChooseConversation = () => {
    const {width} = useMobile();
    return (
        <Box sx={{
            width: '100%',
            // height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: {xs: '20px', md: '24px'},
            fontWeight: 600,
            // flex: 8
        }}>
            <Box sx={{
                p: 2,
                bgcolor: 'common.black',
                borderRadius: '15px',
                boxShadow: '0px 0px 5px 0px silver',
                textAlign: 'center'
            }}>
                <LottieComponent
                    item={RobotHiLottie}
                    loop={true}
                    size={width < 600 ? 300 : 400}
                />
                CHOOSE CHAT
            </Box>
        </Box>
    )
}

type TChatHeaderProps = {
    currentChat: IConversation | null
}
export const ChatHeader = ({currentChat}: TChatHeaderProps) => {
    const {width} = useMobile();
    const {user} = useUserInfo();
    const translate = useTranslate();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            flex: 2,
            justifyContent: 'space-between',
        }}>
            {
                currentChat?._id ?
                    <Box sx={{
                        width: 'fit-content',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            width: '46px',
                            height: '46px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%',
                        }}>
                            <img
                                src={currentChat?.picture || NoAvatar}
                                alt={currentChat?.chatName}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                color: 'common.white',
                                width: '100%',
                                maxWidth: 'calc(100% - 62px)',
                                display: 'flex',
                                flexDirection: 'column',
                                // gap: 1,
                                alignItems: 'start',
                                justifyContent: 'start'
                            }}
                        >
                            <TruncateSingleText
                                styles={{
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    width: 'fit-content',
                                    maxWidth: '100%'
                                }}
                                str={currentChat?.chatName || translate("chats.user.notFound")}
                            />
                            <TypingIndicator
                                chat={currentChat}
                                userId={user?._id}
                            />
                        </Box>
                    </Box> : <Box sx={{
                        fontSize: '23px'
                    }}>
                        Choose chat
                    </Box>
            }
            {
                currentChat?._id && width < 1500 && (
                    <>
                        <ChatBoxInfo conversation={currentChat}/>
                    </>
                )
            }
        </Box>
    )
};

interface TypingIndicatorProps {
    chat: IConversation;
    userId: string
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({chat, userId}) => {
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        const handleUserTyping = (data: any) => {
            if (data.chatId === chat?._id && !typingUsers.includes(data.userId) && data?.userId !== userId) {
                setTypingUsers(prevTypingUsers => [...prevTypingUsers, data.userId]);
            }
        };

        const handleStopTyping = (data: any) => {
            if (data.chatId === chat?._id && typingUsers.includes(data.userId) && data?.userId !== userId) {
                setTypingUsers(prevTypingUsers => prevTypingUsers.filter(user => user !== data.userId));
            }
        };

        socket.on('userTyping', handleUserTyping);
        socket.on('stopUserTyping', handleStopTyping);

        return () => {
            socket.off('userTyping', handleUserTyping);
            socket.off('stopUserTyping', handleStopTyping);
        };
    }, [chat?._id, typingUsers, socket, userId]);

    return (
        <Box
            sx={{
                fontSize: '13px',
                height: '13px',
                color: 'info.main'
            }}
        >
            {
                typingUsers?.length > 0 && (
                    <>
                        {
                            typingUsers?.map((typingUser) => {
                                const user = chat?.members?.find((member) => member?.userId === typingUser);
                                if (!user) return null;
                                const u = user?.user as ProfileProps;
                                return (
                                    <span
                                        key={typingUser}
                                    >
                            {u?.name}
                        </span>
                                )
                            })
                        }
                        {
                            ' ' + 'is typing...'
                        }
                    </>
                )
            }
        </Box>
    );
};