import {Box, IconButton} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {useGetIdentity} from "@refinedev/core";
import {useTranslation} from "react-i18next";
import 'dayjs/locale/uk';
import 'dayjs/locale/en';

import {IConversation, IMessage, ProfileProps} from "../../../interfaces/common";
import {useEffect} from "react";
import {useMobile} from "../../../utils";
import {ReplyOutlined} from "@mui/icons-material";

dayjs.extend(relativeTime);

interface IProps {
    message: IMessage,
    conversation?: IConversation,
    receiver: ProfileProps,
    setReplyTo: (item: IMessage) => void
}

const MessageCard = ({message, conversation, receiver, setReplyTo}: IProps) => {
    const {data: user} = useGetIdentity<ProfileProps>();
    const {i18n} = useTranslation();
    const {device, width} = useMobile();

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language]);

    const currentDate = dayjs();
    const createdAtDate = dayjs(message?.createdAt);

    const diffInHour = currentDate.diff(createdAtDate, 'hour');
    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            gap: 1,
            alignItems: 'end',
            justifyContent: message?.sender === receiver?._id ? 'start' : 'end',
        }}>
            <IconButton
                sx={{
                    order: message?.sender === receiver?._id ? 2 : 1
                }}
                onClick={() => setReplyTo(message)}
            >
                <ReplyOutlined sx={{
                    transform: `scaleX(${message?.sender === receiver?._id ? -1 : 1})`
                }}/>
            </IconButton>
            <Box sx={{
                display: 'flex',
                justifyContent: message?.sender === receiver?._id ? 'start' : 'end',
                flexDirection: message?.sender === receiver?._id ? 'row' : 'row-reverse',
                order: message?.sender === receiver?._id ? 1 : 2,
                gap: 1
            }}>
                <img
                    src={
                        (message?.sender === conversation?.managerId?._id)
                            ? conversation?.institutionId?.mainPhoto
                            : conversation?.userId?.avatar
                    }
                    alt={message?._id}
                    style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    <Box>
                        {
                            message?.sender === conversation?.managerId?._id
                                ? conversation?.institutionId?.title
                                : conversation?.userId?.name
                        }
                    </Box>
                    <Box sx={{
                        bgcolor: 'info.main',
                        p: '10px',
                        borderRadius: message?.sender === receiver?._id ? '0px 10px 10px 10px' : '10px 0px 10px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <Box
                            sx={{
                                whiteSpace: 'break-spaces',
                                fontSize: device || width < 600 ? '14px' : '16px',
                                color: 'info.contrastText'
                            }}
                        >
                            {message?.text}
                        </Box>
                        <Box sx={{
                            fontSize: '12px',
                            color: 'info.contrastText'
                        }}>
                            {
                                diffInHour < 1 ?
                                    dayjs(message?.createdAt).fromNow()
                                    : dayjs(message?.createdAt).format(user?._id === message?.sender?._id ? 'DD-MM-YYYY HH:mm' : 'HH:mm DD-MM-YYYY')
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default MessageCard;
