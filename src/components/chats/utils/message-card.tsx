import {Box, Menu, MenuItem} from "@mui/material";
import dayjs from "dayjs";
import {MouseEvent, useEffect} from "react";
import {useTranslation} from "react-i18next";

import {IConversation, IMessage, ProfileProps} from "../../../interfaces/common";


import relativeTime from "dayjs/plugin/relativeTime"
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import MessagesCardGroup from "./messages-card-group";
import {ContentCopy, DoneAllOutlined, DoneOutlined, ErrorOutlined, ReplyOutlined} from "@mui/icons-material";

dayjs.extend(relativeTime);

interface IProps {
    message?: IMessage,
    conversation?: IConversation,
    receiver: ProfileProps,
    setReplyTo: (item: IMessage) => void,
    group: IMessage[]
}

const MessageCard = ({conversation, receiver, setReplyTo, group, message}: IProps) => {
    const {i18n} = useTranslation();

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language]);

    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    };

    const data = group[0];

    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            gap: 1,
            alignItems: 'end',
            justifyContent: data?.sender === receiver?._id ? 'start' : 'end',
        }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: data?.sender === receiver?._id ? 'start' : 'end',
                flexDirection: data?.sender === receiver?._id ? 'row' : 'row-reverse',
                order: data?.sender === receiver?._id ? 1 : 2,
                gap: 1,
                width: '100%'
            }}
                 onContextMenu={onContextMenu}
            >
                <img
                    src={
                        (data?.sender === conversation?.managerId?._id)
                            ? conversation?.institutionId?.mainPhoto
                            : conversation?.userId?.avatar
                    }
                    alt={data?._id}
                    style={{
                        width: '38px',
                        height: '38px',
                        minWidth: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%',
                    alignItems: data?.sender === receiver?._id ? 'start' : 'end',
                }}>
                    <Box sx={{
                        fontSize: '15px'
                    }}>
                        {
                            data?.sender === conversation?.managerId?._id
                                ? conversation?.institutionId?.title
                                : conversation?.userId?.name
                        }
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        maxWidth: '80%',
                        posititon: 'relative'
                    }}>
                        {
                            group?.map((item: IMessage, index: number) => (
                                <MessagesCardGroup
                                    index={index}
                                    lengthGroup={group?.length}
                                    setReplyTo={setReplyTo}
                                    receiver={receiver}
                                    item={item} key={index}/>
                            ))
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default MessageCard;
