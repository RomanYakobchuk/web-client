import {Box, Button} from "@mui/material";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslate} from "@refinedev/core";

import {IConversation, IMessage} from "@/interfaces/common";
import MessagesBoxItems from "./messages-box-items";
import dayjs from "dayjs";
import MoreButton from "@/components/common/buttons/MoreButton";
import {useMobile} from "@/hook";
import {useInView} from "react-intersection-observer";
import {SouthRounded} from "@mui/icons-material";
import LottieComponent from "@/lotties/LottieComponent";
// import RobotHiLottie from "@/lotties/robot_hi.json"
import MessagesLottie from "@/lotties/properties/messages.json"
import {ColorModeContext} from "@/contexts";

interface IProps {
    messages: Array<[string, IMessage[]]>,
    conversation: IConversation,
    hasNextPage: boolean | undefined,
    fetchNextPage: any,
    isFetchingNextPage: boolean,
    setReplyTo: (item: IMessage) => void,
    isSending: boolean,
    error: string,
    total: number
}

const MessagesBox = ({
                         conversation,
                         isSending,
                         error,
                         messages,
                         isFetchingNextPage,
                         hasNextPage,
                         fetchNextPage,
                         setReplyTo,
                         total
                     }: IProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const {device} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {inView, ref: inViewRef} = useInView({
        threshold: 0.5
    });

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

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }
    useEffect(() => {
        scrollToBottom();
    }, []);
    const currentDate = dayjs(new Date()).format("DD-M-YYYY");

    const scrollBar = !device ? {
        "&::-webkit-scrollbar": {
            width: '5px',
            borderRadius: '5px',
            bgcolor: 'transparent'
        },
        "&::-webkit-scrollbar-thumb": {
            bgcolor: '#2f3ddf',
            borderRadius: '5px',
        }
    } : {};
    return (
        <Box
            sx={{
                width: '100%',
                // height: '100%',
                overflowY: 'auto',
                maxHeight: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pr: 0.6,
                pb: 0.5,
                ...scrollBar
                // justifyContent: 'end'
            }}
        >
            <MoreButton
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                total={total}
            />
            {
                messages[0]?.length > 0 && messages[messages?.length - 1][1]?.length > 0 ?
                    messages
                        ?.map(([day, items]: any) => (
                                <Box key={day}>
                                    <Box sx={{
                                        display: 'flex',
                                        width: '100%',
                                        height: 'auto',
                                        // margin: 'auto',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: 2
                                    }}>
                                        <Box sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'sticky',
                                            top: '10px',
                                            zIndex: 10
                                        }}>
                                            <div style={{
                                                textTransform: 'capitalize',
                                                width: 'fit-content',
                                                textAlign: 'center',
                                                padding: '3px 7px',
                                                borderRadius: '20px',
                                                color: '#fff',
                                                background: 'rgba(155,136,136,0.5)',
                                                backdropFilter: 'blur(4px)',
                                                fontSize: '14px'
                                            }}>
                                                {
                                                    day === currentDate ? translate('dates.today') :
                                                        day.split('-')[0] + ' ' + translate(`dates.months.${day.split('-')[1]}`) + ' ' + day.split('-')[2]
                                                }
                                            </div>
                                        </Box>
                                        <MessagesBoxItems
                                            conversation={conversation}
                                            setReplyTo={setReplyTo}
                                            items={items}
                                        />
                                    </Box>
                                    <Box sx={{
                                        mt: '-10px',
                                        mb: '10px'
                                    }}>
                                        <div ref={inViewRef}/>
                                        <div ref={scrollRef}/>
                                    </Box>
                                </Box>
                            )
                        )
                    : <Box sx={{
                        width: '80%',
                        m: '0 auto',
                        p: 3,
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        height: '100%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: 'common.black',
                        color: 'common.white',
                        textAlign: 'center',
                        boxShadow: `0px 4px 8px 0px ${mode === 'dark' ? 'rgba(200, 200, 200, 0.4)' : 'rgba(125, 125, 125, 0.4)'}`
                    }}>
                        <LottieComponent
                            size={200}
                            loop={true}
                            item={MessagesLottie}
                        />
                        Send message for start communication
                    </Box>
            }
            {
                messages?.length > 0 && !inView && (
                    <Button
                        onClick={scrollToBottom}
                        variant={'contained'}
                        color={'secondary'}
                        sx={{
                            position: 'fixed',
                            bottom: {xs: '70px', lg: '85px'},
                            right: {xs: '10px', lg: '40px'},
                            width: '36px',
                            minWidth: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            bgcolor: '#e0e3e5 !important',
                            boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.6)'
                        }}>
                        <SouthRounded sx={{
                            color: 'black'
                        }}/>
                    </Button>
                )
            }
        </Box>
    );
};
export default MessagesBox;
