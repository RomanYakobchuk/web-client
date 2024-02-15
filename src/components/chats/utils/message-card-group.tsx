import {Box} from "@mui/material";
import dayjs from "dayjs";
import {MouseEvent, useEffect} from "react";
import {useTranslation} from "react-i18next";


import {IConversation, IMessage, ProfileProps} from "@/interfaces/common";
import relativeTime from "dayjs/plugin/relativeTime"
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import MessagesCard from "./messages-card";
import {useUserInfo} from "@/hook";

dayjs.extend(relativeTime);

interface IProps {
    message?: IMessage,
    conversation?: IConversation,
    setReplyTo: (item: IMessage) => void,
    group: IMessage[]
}

const MessageCardGroup = ({conversation, setReplyTo, group, message}: IProps) => {
    const {i18n} = useTranslation();
    const {user} = useUserInfo();

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language]);

    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    };

    const data = group[0];
    const receiver = conversation?.members?.find((member) => {
        const memberUser = member?.user as ProfileProps;
        return memberUser?._id === data?.sender as string
    })?.user as ProfileProps;
    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            gap: 1,
            alignItems: 'end',
            height: 'fit-content',
            justifyContent: user?._id === receiver?._id ? 'end' : 'start',
        }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: user?._id !== receiver?._id ? 'start' : 'end',
                flexDirection: user?._id !== receiver?._id ? 'row' : 'row-reverse',
                order: user?._id !== receiver?._id ? 1 : 2,
                gap: 1,
                width: '100%'
            }}
                 onContextMenu={onContextMenu}
            >
                {
                    user?._id !== receiver?._id && conversation?.chatInfo?.type === 'group' && (
                        <Box sx={{
                            width: {xs: '32px', sm: '38px', lg: '42px'},
                            height: {xs: '32px', sm: '38px', lg: '42px'},
                        }}>
                            <img
                                src={receiver?.avatar}
                                alt={data?._id}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minWidth: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    )
                }
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%',
                    alignItems: user?._id !== receiver?._id ? 'start' : 'end',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.3,
                        maxWidth: '80%',
                        position: 'relative',
                        alignItems: user?._id === receiver?._id ? 'end' : 'start'

                    }}>
                        {
                            group?.map((item: IMessage, index: number) => (
                                <MessagesCard
                                    index={index}
                                    lengthGroup={group?.length}
                                    setReplyTo={setReplyTo}
                                    receiver={receiver}
                                    item={item} key={index}
                                    conversation={conversation as IConversation}
                                />
                            ))
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default MessageCardGroup;
