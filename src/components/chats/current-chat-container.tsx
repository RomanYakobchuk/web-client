import {GetListResponse, useGetIdentity, useInfiniteList} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Clear} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import dayjs from "dayjs";

import ReviewInput from "../establishment/utills/review-input";
import Loading from "../loading/loading";
import {useMobile} from "../../hook";
import {IConversation, IGetIdentity, IMessage, ProfileProps,} from "../../interfaces/common";
import {socket} from "../../socketClient";
import ChatBox from "./utils/chat-box";

interface IProps {
    conversation: IConversation,
    setCurrentChat: (value: any) => void,
    setOpenDrawer?: any,
}


const CurrentChatContainer = ({conversation, setCurrentChat, setOpenDrawer}: IProps) => {

    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const {device} = useMobile();
    const [params, setParams] = useSearchParams();

    const [updatedMessageStatus, setUpdatedMessageStatus] = useState<IMessage>({} as IMessage);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
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
    const sendMessage = async () => {
        try {
            if (!messageText) return;
            setIsSending(true)
            const currentDate = dayjs.utc().format('');
            console.log(currentDate)
            socket?.emit('sendMessage', {
                sender: user?._id,
                receiver: receiver?._id,
                text: messageText,
                chatId: conversation?._id,
                createdAt: currentDate,
                replyTo: replyTo?._id && replyTo?._id
            })

            setIsSending(false)
            setMessageText('')
            return () => {
                socket.off('sendMessage');
            };
        } catch (error) {
            setIsSending(false)
            setError('Error')
        }
    }
    useEffect(() => {
        socket?.emit('joinChat', conversation?._id);
    }, []);

    useEffect(() => {
        if (user && conversation) {
            setReceiver(
                user?._id === conversation?.userId?._id ? conversation.managerId : conversation.userId as ProfileProps
            )
        }
    }, [user, conversation]);

    useEffect(() => {
        socket?.on('isSent', (data: any) => {
            setUpdatedMessageStatus(prevState => {
                return {
                    ...prevState,
                    ...data,
                    conversationId: data?.chatId
                }
            })
        });
        socket?.on('getMessage', (data: any) => {
            setArivialMessages((prevState) => {
                console.log('message was get')
                return {
                    ...prevState,
                    ...data,
                    _id: data?._id,
                    sender: data?.sender,
                    text: data?.text,
                    replyTo: data?.replyTo,
                    createdAt: data?.createdAt
                }
            });
        })

        return () => {
            socket.off('getMessage')
            socket.off('isSent')
        }
    }, []);
    useEffect(() => {
        const updateMessages = async () => {
            try {
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
            } catch (e) {
                setError('Error')
            }
        }
        updateMessages();
    }, [data?.pages]);
    useEffect(() => {
        if (arivialMessages?._id) {
            setMessages(prevState => {
                const messagesCopy = [...prevState];
                const lastObject = messagesCopy[messagesCopy.length - 1];
                const currentDate = dayjs(arivialMessages.createdAt).format('DD-M-YYYY');

                if (lastObject && Array.isArray(lastObject[1]) && lastObject[1].includes(arivialMessages)) {
                    return prevState;
                }
                if (lastObject && Array.isArray(lastObject[1]) && currentDate === lastObject[0]) {
                    lastObject[1] = [...lastObject[1], arivialMessages];
                } else {
                    messagesCopy.push([dayjs(new Date()).format('DD-M-YYYY'), [arivialMessages]]);
                }

                return messagesCopy;
            });

            setArivialMessages(prevState => ({} as IMessage));
        }
    }, [arivialMessages?._id]);
    console.log(data)

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
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'manipulation',
                WebkitTransform: 'translate3d(0, 0, 0)',
                transform: 'translate3d(0, 0, 0)'
            }}
            >
                {/*{*/}
                {/*    !isError ?*/}
                {/*        isLoading ? <Loading/> :*/}
                {/*            <ChatBox*/}
                {/*                error={error}*/}
                {/*                isSending={isSending}*/}
                {/*                hasNextPage={hasNextPage}*/}
                {/*                fetchNextPage={fetchNextPage}*/}
                {/*                isFetchingNextPage={isFetchingNextPage}*/}
                {/*                messages={messages ?? []}*/}
                {/*                receiver={receiver}*/}
                {/*                setReplyTo={setReplyTo}*/}
                {/*                conversation={conversation}*/}
                {/*            /> : <div>Error</div>*/}
                {/*}*/}
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

