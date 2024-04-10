import React, {
    useEffect,
} from "react";
import {Box} from "@mui/material";

import {MessagesContainer} from "@/components/chats/chatBox/messagesContainer";
import {ReplyContainer} from "@/components/chats/chatBox/replyContainer";
import {MessagesInput} from "@/components/chats/chatBox/messagesInput";
import {IConversation} from "@/interfaces/common";
import {socket} from "@/socketClient";


type TProps = {
    conversation: IConversation
}
export const MessagesInputContainer = ({conversation}: TProps) => {

    useEffect(() => {
        if (conversation?._id) {
            socket?.emit('joinChat', conversation?._id);
        }
    }, [conversation?._id]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            // gap: {lg: 1},
            maxHeight: 'calc(100%)',
            height: '-webkit-fill-available'
        }}>
            <Box sx={{
                width: '100%',
                // wefwe
                transform: 'translate3d(0, 0, 0)',
                position: 'relative',
                flex: '1 1 auto',
                zIndex: 1,
                //rf3f
                maxHeight: 'calc(100% - 52px)',
                height: '100%',
                px: 0.5,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
            >
                <MessagesContainer
                    conversation={conversation}
                />
            </Box>
            <Box sx={{
                display: 'flex',
                gap: 0,
                flexDirection: 'column',
                height: 'fit-content',
                alignItems: 'end',
                width: '100%',
            }}>
                <ReplyContainer
                    conversation={conversation}
                />
                <MessagesInput
                    conversation={conversation}
                />
            </Box>
        </Box>
    );
};
