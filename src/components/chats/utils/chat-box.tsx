import {Box, Button} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {GetListResponse, useTranslate} from "@refinedev/core";

import {IConversation, IMessage, ProfileProps} from "../../../interfaces/common";
import MessageCard from "./message-card";

interface IProps {
    messages: Array<[string, IMessage[]]>,
    conversation: IConversation,
    receiver: ProfileProps,
    hasNextPage: boolean | undefined,
    fetchNextPage: any,
    isFetchingNextPage: boolean,
    setReplyTo: (item: IMessage) => void
}

const ChatBox = ({
                     conversation,
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
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    useEffect(() => {
        // Оновлюємо messagesId разом зі змінами в messages
        setMessagesId(messagesId => messagesId + 1);
    }, [messages]);
    // доробити скрол


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
                messages[messages?.length - 1][1]?.length > 0 &&
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
                                <h3 style={{
                                    textTransform: 'capitalize',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    {
                                        day.split('-')[0] + ' ' +  translate(`dates.months.${day.split('-')[1]}`) + ' ' + day.split('-')[2]
                                    }
                                </h3>
                                {
                                    items?.sort((a: IMessage, b: IMessage) => a?.createdAt > b?.createdAt ? 1 : -1)
                                        ?.map((item: IMessage) => (
                                            <Box key={item._id}
                                                 ref={scrollRef}
                                            >
                                                {
                                                    item?.replyTo?._id && (
                                                        <Box>

                                                        </Box>
                                                    )
                                                }
                                                <MessageCard
                                                    setReplyTo={setReplyTo}
                                                    receiver={receiver}
                                                    message={item}
                                                    conversation={conversation}
                                                />
                                            </Box>
                                        ))
                                }
                            </Box>
                        )
                    )
            }
        </Box>
    );
};
export default ChatBox
