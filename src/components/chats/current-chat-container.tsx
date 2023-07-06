import {GetListResponse, useGetIdentity, useInfiniteList} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Clear} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import {useForm} from "@refinedev/antd";

import ReviewInput from "../institution/utills/review-input";
import Loading from "../loading";
import {useMobile} from "../../utils";
import {IConversation, IMessage, ProfileProps,} from "../../interfaces/common";
import {socket} from "../../socketClient";
import ChatBox from "./utils/chat-box";

interface IProps {
    conversation: IConversation,
    setCurrentChat: (value: any) => void,
    setOpenDrawer?: any,
}

const CurrentChatContainer = ({conversation, setCurrentChat, setOpenDrawer}: IProps) => {

    const {data: user} = useGetIdentity<ProfileProps>();
    const {device} = useMobile();
    const [params, setParams] = useSearchParams();

    const [receiver, setReceiver] = useState<ProfileProps>({} as ProfileProps);
    const [replyTo, setReplyTo] = useState<IMessage>({} as IMessage);
    const [messageText, setMessageText] = useState<string>('');
    const [messages, setMessages] = useState<Array<[string, IMessage[]]>>([] as Array<[string, IMessage[]]>);
    const [arivialMessages, setArivialMessages] = useState<IMessage>({} as IMessage);

    const {
        data,
        fetchNextPage,
        isLoading,
        isError,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList<IMessage>({
        resource: `message/find/${conversation?._id}`,
        pagination: {
            pageSize: 40
        },
        liveMode: 'auto',
    });
    const {onFinish, formLoading} = useForm({
        resource: 'message/create',
        action: 'create',
        successNotification: false
    })
    const sendMessage = async () => {
        if (!messageText) return;
        socket?.emit('sendMessage', {
            sender: user?._id,
            receiver: receiver?._id,
            text: messageText,
            chatId: conversation?._id
        })

        await onFinish({
            conversationId: conversation?._id,
            sender: user?._id,
            text: messageText,
            replyTo: replyTo?._id
        });

        setMessageText('')
        return () => {
            socket.off('sendMessage');
        };
    }
    useEffect(() => {
        if (user && conversation) {
            setReceiver(
                user?._id === conversation?.userId?._id ? conversation.managerId : conversation.userId as ProfileProps
            )
        }
    }, [user, conversation]);

    useEffect(() => {
        socket?.on('getMessage', (data: any) => {
            setArivialMessages((prevState) => {
                return {
                    ...prevState,
                    _id: Date.now().toString(),
                    sender: data?.sender,
                    text: data?.text,
                    replyTo: data?.replyTo,
                    createdAt: Date.now()
                }
            });
        })
        return () => {
            socket.off('getMessage');
        };
    }, []);
    useEffect(() => {
        if (data?.pages) {
            const list: Array<[string, IMessage[]]> = [].concat(...(data?.pages as any ?? [])?.map((page: GetListResponse<IMessage>) => Object.entries(page?.data))).sort(([dateA]: [string], [dateB]: [string]) => {
                const [dayA, monthA, yearA] = dateA?.split('-');
                const [dayB, monthB, yearB] = dateB?.split('-');

                const dateObjA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
                const dateObjB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));

                return dateObjA.getTime() - dateObjB.getTime();
            });
            if (list) {
                const mergedObjects = list.reduce((acc: Record<string, IMessage[]>, [key, arr]) => {
                    if (acc[key]) {
                        acc[key] = acc[key].concat(arr);
                    } else {
                        acc[key] = arr;
                    }
                    return acc;
                }, {} as Record<string, IMessage[]>);
                const mergedArray: [string, IMessage[]][] = Object.entries(mergedObjects);
                setMessages(mergedArray);
            }
        }
    }, [data?.pages]);
    useEffect(() => {
        if (arivialMessages?._id) {
            setMessages(prevState => {
                const messagesCopy = [...prevState];
                const lastObject = messagesCopy[messagesCopy.length - 1];
                if (lastObject && Array.isArray(lastObject[1]) && lastObject[1].includes(arivialMessages)) {
                    return prevState;
                }
                if (lastObject && Array.isArray(lastObject[1])) {
                    const updatedLastObject = [...lastObject[1], arivialMessages];
                    lastObject[1] = updatedLastObject;
                } else {
                    messagesCopy.push(['', [arivialMessages]]);
                }

                return messagesCopy;
            });

            setArivialMessages(prevState => ({} as IMessage));
        }
    }, [arivialMessages?._id]);

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%'
        }}>
            {
                !device &&
                <Box
                    sx={{
                        width: '100%',
                    }}
                >
                    <IconButton
                        onClick={() => {
                            setCurrentChat({} as IConversation)
                            setParams({})
                            setOpenDrawer(false)
                        }}
                    >
                        <Clear/>
                    </IconButton>
                </Box>
            }
            <Box sx={{
                flex: 8,
                borderRadius: '15px',
                p: '5px',
                bgcolor: 'background.default',
                overflowY: 'auto'
            }}>
                {
                    !isError ?
                        isLoading ? <Loading/> :
                            messages[0]?.length > 0 ?
                                <ChatBox
                                    hasNextPage={hasNextPage}
                                    fetchNextPage={fetchNextPage}
                                    isFetchingNextPage={isFetchingNextPage}
                                    messages={messages}
                                    receiver={receiver}
                                    setReplyTo={setReplyTo}
                                    conversation={conversation}
                                /> : <div>Error</div> : ''
                }
            </Box>
            {
                replyTo?._id && (
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        maxWidth: '400px',
                        m: 'auto',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderLeft: '2px solid silver',
                        pl: '10px'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{
                                fontSize: '14px',
                                fontWeight: 600
                            }}>
                                {replyTo?.sender === conversation?.managerId?._id
                                    ? conversation?.institutionId?.title
                                    : conversation?.userId?.name
                                }
                            </Box>
                            <Box sx={{
                                fontSize: '12px',
                            }}>
                                {
                                    replyTo?.text?.length > 40 ? `${replyTo?.text?.substring(0, 40)}...` : replyTo?.text
                                }
                            </Box>
                        </Box>
                        <IconButton onClick={() => setReplyTo({} as IMessage)}>
                            <Clear/>
                        </IconButton>
                    </Box>
                )
            }
            <Box>
                {
                    conversation?._id &&
                    <ReviewInput
                        value={messageText}
                        setValue={setMessageText}
                        handleSend={sendMessage}
                    />
                }
            </Box>
        </Box>
    );
};
export default CurrentChatContainer;

