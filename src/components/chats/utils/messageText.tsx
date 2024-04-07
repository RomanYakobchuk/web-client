import parse from "html-react-parser";
import {formatText} from "@/utils";
import {Box} from "@mui/material";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {socket} from "@/socketClient";
import {useUserInfo} from "@/hook";
import {useInView} from "react-intersection-observer";
import {IMessage} from "@/interfaces/common";
import {DoneAllRounded, DoneRounded} from "@mui/icons-material";
import {useChats} from "@/indexedDB";

type TProps = {
    text: string,
    theSameUser: boolean,
    createdAt: Date,
    message: IMessage
}
const messageStatus = {
    sent: <DoneRounded/>,
    read: <DoneAllRounded/>
}

export const MessageText = ({text, theSameUser, createdAt, message}: TProps) => {

    const {user} = useUserInfo();
    const {updateChat, findChat} = useChats();
    const {ref: refCard, inView: inViewCard} = useInView({
        threshold: 0.5,
        delay: 500,
        triggerOnce: true,
    });
    const [isShowSpoiler, setIsShowSpoiler] = useState(true);

    useEffect(() => {
        setIsShowSpoiler(true);
    }, [text]);

    const handleShowSpoiler = () => {
        setIsShowSpoiler(false)
    }

    useEffect(() => {
        if (!theSameUser && user?._id && inViewCard && message?.status !== 'read') {
            findChat({_id: message?.conversationId}).then(async (c) => {
                if (c) {
                    const receivers = c?.members?.map((member) => member?.userId);
                    socket?.emit('newMessageStatus', {
                        status: "read",
                        receivers: receivers,
                        chatId: message?.conversationId,
                        userId: message?.sender,
                        message: message,
                    });
                    await updateChat(c?._id, {...c, lastMessage: {...c?.lastMessage, status: 'read'}})
                }
            });
        }
        return () => {
            socket.off('newMessageStatus')
        }
    }, [socket, theSameUser, user?._id, message, inViewCard]);

    return (
        <Box
            ref={refCard}
            className={'message'}
            dir={'auto'}
            sx={{
                "& .spoiler-message": {
                    overflow: 'hidden',
                    background: isShowSpoiler ? 'silver' : 'transparent',
                    color: isShowSpoiler ? 'transparent' : '#fff',
                },
            }}
            onClick={handleShowSpoiler}
        >
            {parse(formatText({text: text}))}
            <Box
                component="span"
                className={'time'}
                sx={{
                    paddingInlineEnd: !theSameUser ? '8px' : '6px',
                    marginInlineStart: !theSameUser ? '-3px' : '10px'
                }}
            >
                <Box
                    component="span"
                    className={'time-sending-status tgico'}
                />
                <Box
                    component={'span'}
                    className={'i18n'}
                    dir={'auto'}
                    style={{
                        visibility: 'hidden'
                    }}
                >
                    {
                        dayjs(createdAt).format('HH:mm')
                    }
                </Box>
                <Box
                    title={dayjs(createdAt).format('DD/MM/YYYY HH:mm')}
                    className={'time-inner'}
                >
                    <Box
                        component={'span'}
                        className={'time-sending-status tgico'}
                        sx={{
                            "& svg": {
                                width: '14px',
                                height: '14px'
                            }
                        }}
                    >
                        {theSameUser && (messageStatus[message?.status] || messageStatus['sent'])}
                    </Box>
                    {/*<Box*/}
                    {/*    component={'i'}*/}
                    {/*    className={'time-edited'}*/}
                    {/*/>*/}
                    <Box
                        component={'span'}
                        className={'i18n'}
                        dir={'auto'}
                    >
                        {
                            dayjs(createdAt).format('HH:mm')
                        }
                    </Box>
                </Box>
            </Box>
        </Box>);
};

