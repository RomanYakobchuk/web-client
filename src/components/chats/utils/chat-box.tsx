import {Box, Button} from "@mui/material";
import React, {useEffect, useRef} from "react";
import {GetListResponse, useTranslate} from "@refinedev/core";

import {IConversation, IMessage, ProfileProps} from "../../../interfaces/common";
import MessageCard from "./message-card";

interface IProps {
    messages: IMessage[],
    conversation: IConversation,
    receiver: ProfileProps,
    hasNextPage: boolean | undefined,
    fetchNextPage: any,
    isFetchingNextPage: boolean,
    setReplyTo: (item: IMessage) => void
}

const ChatBox = ({conversation, messages, receiver, isFetchingNextPage, hasNextPage, fetchNextPage, setReplyTo}: IProps) => {
    const scrollRef = useRef<any>();
    const translate = useTranslate();

    useEffect(() => {
        // if (messages?.length ) {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
        // }
    }, [messages]);

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
                messages?.sort((a, b) => a?.createdAt < b?.createdAt ? -1 : 1)
                    ?.map((item, index) => (
                            <Box key={item._id ?? index * Date.now()}
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
                        )
                    )
            }
        </Box>
    );
};
export default ChatBox
