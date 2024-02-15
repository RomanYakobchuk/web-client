import React, {ReactNode} from "react";
import {Close} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";

import {IConversation} from "@/interfaces/common";
import {MessagesInputContainer} from "@/components/chats/chatBox/messagesInputContainer";
import LottieComponent from "@/lotties/LottieComponent";
import RobotHiLottie from "@/lotties/robot_hi.json"
import {useMobile} from "@/hook";

interface IProps {
    conversation: IConversation | null,
    setCurrentChat?: (value: any) => void,
    setOpenDrawer?: any,
    closeChat?: () => void,
    header?: ReactNode | Element
}


const CurrentChatContainer = ({conversation, closeChat, header, setOpenDrawer}: IProps) => {

    const {width} = useMobile();

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%',
            // flex: 1,
        }}>
            <Box sx={{
                width: '100%',
                // borderBottom: '1px solid silver',
                py: '5px',
                display: 'flex',
                gap: 2,
                alignItems: 'start',
                // flex: 2,
                maxHeight: '60px'
            }}>
                <>
                    {
                        conversation?._id && (
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
                                <Close/>
                            </IconButton>
                        )
                    }
                    {header}
                </>
            </Box>
            <Box sx={{
                height: 'calc(100% - 60px)'
            }}>
                {
                    conversation?._id ? (
                        <MessagesInputContainer conversation={conversation}/>
                    ) : (
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
                                borderRadius: '15px'
                            }}>
                                <LottieComponent
                                    item={RobotHiLottie}
                                    loop={true}
                                    size={width < 600 ? 300 : 400}
                                />
                            </Box>
                        </Box>
                    )
                }
            </Box>
        </Box>
    );
};
export default CurrentChatContainer;

