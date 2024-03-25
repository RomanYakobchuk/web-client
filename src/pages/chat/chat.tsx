import {Box} from "@mui/material";

import {ChatBox, ChooseConversation} from "@/components/chats/chatBox/chatBox";
import {ListChats} from "@/components";
import {useMobile} from "@/hook";
import {useParams} from "react-router-dom";

const Chat = () => {

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
                "@media screen and (min-width: 768px)": {
                    height: 'calc(100% - 70px)'
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%'
                }}
            >
                <Box sx={{
                    minWidth: '300px',
                    width: '100%',
                    "@media screen and (min-width: 1100px)": {
                        minWidth: '375px'
                    },
                    "@media screen and (min-width: 768px)": {
                        maxWidth: '40%'
                    },
                    "@media screen and (min-width: 1350px)": {
                        maxWidth: '375px'
                    },
                    height: '100%',
                }}>
                    <ListChats/>
                </Box>
                <ChatContainer/>
            </Box>
        </Box>
    );
};
export default Chat;

const ChatContainer = () => {
    const {width} = useMobile();
    const {conversationId} = useParams();

    return (
        <>
            {
                conversationId ? (
                    <ChatBox
                        conversationId={conversationId}
                    />
                ) : width > 768 && <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    "@media screen and (max-width: 768px)": {
                        display: 'none'
                    },
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid transparent',
                    borderLeftColor: 'silver'
                }}>
                    <ChooseConversation/>
                </Box>
            }
        </>
    )
}
