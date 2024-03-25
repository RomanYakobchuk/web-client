import {useTranslate} from "@refinedev/core";
import {Box} from "@mui/material";

import {messagesDate} from "@/components/chats/utils/messageBorderStyle";
import {IConversation, IMessage} from "@/interfaces/common";
import MoreButton from "@/components/buttons/MoreButton";
import MessagesBoxItems from "./messages-box-items";
import {ScrollButton} from "./scrollButton";
import {For} from "million/react";
import {useMobile} from "@/hook";
import {AnimatePresence, motion} from "framer-motion";

interface IProps {
    messages: Array<[string, IMessage[]]>,
    conversation: IConversation,
    hasNextPage: boolean | undefined,
    fetchNextPage: any,
    isFetchingNextPage: boolean,
    total: number,
    localCount: number
}

const MessagesBox = ({
                         conversation,
                         messages,
                         isFetchingNextPage,
                         hasNextPage,
                         fetchNextPage,
                         total,
                         localCount
                     }: IProps) => {

    const {device} = useMobile();
    const translate = useTranslate();

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
    } : undefined;

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column-reverse',
                pr: 0.6,
                pb: 0.5,
                ...scrollBar
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    // flexDirection: 'column',
                    flexDirection: 'column-reverse',
                    gap: 2,
                    width: '100%',
                    minHeight: '100%',
                    justifyContent: 'end',
                    position: 'relative'
                }}
            >
                {/*<MoreButton*/}
                {/*    hasNextPage={hasNextPage && localCount < total}*/}
                {/*    isFetchingNextPage={isFetchingNextPage}*/}
                {/*    fetchNextPage={fetchNextPage}*/}
                {/*    total={total}*/}
                {/*/>*/}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10px',
                        zIndex: 20
                    }}
                >
                    <ScrollButton
                        dependency={conversation?._id}
                        isShowBtn={messages?.length > 0}
                    />
                </Box>
                <AnimatePresence
                    mode={'sync'}
                    initial={false}
                >
                    {/*<For each={messages}>*/}
                    {
                        messages?.length > 0 && messages?.map(([day, items]: any) => (
                                <Box
                                    key={day}
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        height: 'auto',
                                        // margin: 'auto',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: 1
                                    }}>
                                    <Box sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'sticky',
                                        top: '10px',
                                        zIndex: 10,
                                        transition: '100ms linear'
                                    }}>
                                        <Box
                                            sx={{
                                                textTransform: 'capitalize',
                                                width: 'fit-content',
                                                textAlign: 'center',
                                                padding: '3px 8px',
                                                borderRadius: '20px',
                                                color: '#fff',
                                                background: 'rgba(155,136,136,0.8)',
                                                backdropFilter: 'blur(4px)',
                                                fontSize: '13px'
                                            }}>
                                            {messagesDate(day, translate)}
                                        </Box>
                                    </Box>
                                    <MessagesBoxItems
                                        conversation={conversation}
                                        items={items}
                                    />
                                </Box>
                                // </motion.div>
                            )
                        )
                    }
                    {/*</For>*/}
                </AnimatePresence>
                <MoreButton
                    hasNextPage={hasNextPage && localCount < total}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    total={total}
                />
                {/*<ScrollButton*/}
                {/*    dependency={conversation?._id}*/}
                {/*    isShowBtn={messages?.length > 0}*/}
                {/*/>*/}
            </Box>
        </Box>
    );
};
export default MessagesBox;
