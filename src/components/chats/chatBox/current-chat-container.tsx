import React, {ReactNode, useContext} from "react";
import {ArrowBackIosNewRounded} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";

import {IConversation} from "@/interfaces/common";
import {MessagesInputContainer} from "@/components/chats/chatBox/messagesInputContainer";
import {ColorModeContext} from "@/contexts";

interface IProps {
    conversation: IConversation,
    setCurrentChat?: (value: any) => void,
    setOpenDrawer?: any,
    closeChat?: () => void,
    header?: ReactNode | Element
}


const CurrentChatContainer = ({conversation, closeChat, header, setOpenDrawer}: IProps) => {

    const {mode} = useContext(ColorModeContext);

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            // gap: 1,
            width: '100%',
            overflow: 'hidden',
            // p: 0,
            // "@media screen and (min-width: 768px)": {
            //     p: 1
            // },
            // backgroundImage: `url('/images/chats/${mode === 'dark' ? 'bg-black.png' : 'cool-background-2.png'}')`,
            backgroundPosition: 'center',
            backgroundSize: mode === 'dark' ? 'cover' : 'auto',
        }}>
            <Box sx={{
                width: '100%',
                p: 0.5,
                display: 'flex',
                // gap: 1,
                alignItems: 'center',
                maxHeight: '60px',
                // bgcolor: 'modern.modern_2.second',
                // borderRadius: '10px',
                boxShadow: `0px 0px 5px 0px ${mode === 'dark' ? 'rgba(255, 255, 255,0.45)' : 'rgba(0,0,0,0.45)'}`
            }}>
                <>
                    {
                        conversation && (
                            <IconButton
                                onClick={() => {
                                    if (closeChat) {
                                        closeChat();
                                    }
                                    if (setOpenDrawer) {
                                        setOpenDrawer(false);
                                    }
                                }}
                            >
                                <ArrowBackIosNewRounded/>
                            </IconButton>
                        )
                    }
                    {header}
                </>
            </Box>
            <Box sx={{
                height: {xs: 'calc(100% - 46px)', sm: 'calc(100% - 60px)'},
                overflow: 'hidden',
                p: 1
            }}>
                <MessagesInputContainer conversation={conversation}/>
            </Box>
        </Box>
    );
};
export default CurrentChatContainer;

