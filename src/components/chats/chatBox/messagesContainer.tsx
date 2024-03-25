import {GetListResponse, useInfiniteList} from "@refinedev/core";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";

import {getMessages} from "@/components/chats/utils/messageBorderStyle";
import MessagesBox from "@/components/chats/chatBox/messages-box";
import {IConversation, IMessage} from "@/interfaces/common";
import {useMessages} from "@/indexedDB";
import {socket} from "@/socketClient";
import {useStore} from "@/store";

type TProps = {
    conversation: IConversation,
}
export const MessagesContainer = ({conversation}: TProps) => {

    const {messages: messagesDB, addManyMessages, addMessage, updateMessage} = useMessages();
    const {handleUpdateMessages, chatMessages} = useStore();
    const length = messagesDB?.length || 0;

    const [messages, setMessages] = useState<Array<[string, IMessage[]]> | null>(null);
    // const [updatedMessageStatus, setUpdatedMessageStatus] = useState<IMessage | null>(null);
    const [arivialMessages, setArivialMessages] = useState<IMessage | null>(null);
    const [total, setTotal] = useState<number>(length || 0);

    const res = async () => {
        const m = await messagesDB(conversation?._id);
        if (m) {
            handleUpdateMessages(m);
        }
    }
    useEffect(() => {
        if (chatMessages) {
            const res = getMessages(chatMessages);
            setMessages(res);
        }
    }, [chatMessages]);
    useEffect(() => {
        res();
    }, [conversation?._id]);
    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList<IMessage>({
        resource: `message/find/${conversation?._id}`,
        pagination: {
            pageSize: 60
        },
        queryOptions: {
            retry: 3,
        }
    });

    useEffect(() => {
        const updateMessages = async () => {
            if (data?.pages) {
                setTotal(data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0)
                const list = [].concat(...(data?.pages as any ?? [])?.map((page: GetListResponse<IMessage>) => {
                    return page?.data
                }));
                // const l = getMessages(list);
                // setMessages(l);
                await addManyMessages(list as IMessage[]);
                await res();
            }
        }
        updateMessages();
    }, [data?.pages]);

    useEffect(() => {
        socket?.on('getMessage', (data: any) => {
            setArivialMessages((prevState) => {
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
        }
    }, [socket]);

    useEffect(() => {
        socket?.on('messageStatus', async (data: any) => {
            await updateMessage(data?.message?._id, data?.message);
            await res();
        })
        return () => {
            socket.off('messageStatus')
        }
    }, [socket, conversation?._id]);

    useEffect(() => {
        if (arivialMessages && arivialMessages?.conversationId === conversation?._id) {
            setMessages(prevState => {
                const currentDate1 = dayjs(arivialMessages.createdAt).format('DD-M-YYYY');
                const currentDate2 = dayjs(arivialMessages.createdAt).format('D-M-YYYY');
                if (prevState) {
                    const messagesCopy = [...prevState];
                    const lastObject = messagesCopy[0];

                    if (lastObject && Array.isArray(lastObject[1]) && lastObject[1].includes(arivialMessages)) {
                        return prevState;
                    }
                    if (lastObject && Array.isArray(lastObject[1]) && (currentDate1 === lastObject[0] || currentDate2 === lastObject[0])) {
                        lastObject[1] = [arivialMessages, ...lastObject[1]];
                    } else {
                        messagesCopy.unshift([dayjs(new Date()).format('DD-M-YYYY'), [arivialMessages]]);
                    }
                    return messagesCopy;
                } else {
                    return [[dayjs(new Date()).format('DD-M-YYYY'), [arivialMessages]]];
                }
            });
            addMessage(arivialMessages)?.then(() => {
            });
            setTotal(total + 1);
            // res()
        }
        return () => {
            setArivialMessages(null);
        }
    }, [arivialMessages, conversation?._id]);

    return (
        <>
            {
                (messages && messages?.length >= 0) ?
                    <MessagesBox
                        total={total}
                        localCount={length}
                        hasNextPage={hasNextPage}
                        messages={messages || []}
                        conversation={conversation}
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                    : (
                        <></>
                    )
            }
        </>
    )
        ;
};

