import {Box, Button} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {GetListResponse, useGetIdentity, useTranslate} from "@refinedev/core";

import {IConversation, IMessage, ProfileProps} from "../../../interfaces/common";
import MessageCard from "./message-card";
import dayjs from "dayjs";
import ChatBoxItems from "./chat-box-items";

interface IProps {
    messages: Array<[string, IMessage[]]>,
    conversation: IConversation,
    receiver: ProfileProps,
    hasNextPage: boolean | undefined,
    fetchNextPage: any,
    isFetchingNextPage: boolean,
    setReplyTo: (item: IMessage) => void,
    isSending: boolean,
    error: string
}

const ChatBox = ({
                     conversation,
                     isSending,
                     error,
                     messages,
                     receiver,
                     isFetchingNextPage,
                     hasNextPage,
                     fetchNextPage,
                     setReplyTo
                 }: IProps) => {
    const scrollRef = useRef<any>();
    const translate = useTranslate();

    const [messagesId, setMessagesId] = useState<number>(0);

    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1][1]?.length > 0) {
            scrollRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);
    useEffect(() => {
        // Оновлюємо messagesId разом зі змінами в messages
        setMessagesId(messagesId => messagesId + 1);
    }, [messages]);
    // доробити скрол

    const currentDate = dayjs(new Date()).format("DD-M-YYYY");

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {
                hasNextPage && (
                    <Button
                        variant={"outlined"}
                        color={'secondary'}
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {translate(isFetchingNextPage ? 'loading' : 'buttons.loadMore')}
                    </Button>
                )
            }

            {
                messages[0]?.length > 0 && messages[messages?.length - 1][1]?.length > 0 ?
                    messages
                        ?.map(([day, items]: any) => (
                                <Box key={day} sx={{
                                    display: 'flex',
                                    width: '100%',
                                    margin: 'auto',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <h4 style={{
                                            textTransform: 'capitalize',
                                            width: 'fit-content',
                                            textAlign: 'center',
                                            padding: '3px 7px',
                                            borderRadius: '20px',
                                            color: '#fcfcfc',
                                            background: 'rgba(155,136,136,0.5)'
                                        }}>
                                            {
                                                day === currentDate ? translate('dates.today') :
                                                day.split('-')[0] + ' ' + translate(`dates.months.${day.split('-')[1]}`) + ' ' + day.split('-')[2]
                                            }
                                        </h4>
                                    </Box>
                                    <ChatBoxItems
                                        receiver={receiver}
                                        conversation={conversation}
                                        scrollRef={scrollRef}
                                        setReplyTo={setReplyTo}
                                        items={items}/>
                                </Box>
                            )
                        )
                    : <div>
                        Send message for start communication
                    </div>
            }
        </Box>
    );
};
export default ChatBox;
