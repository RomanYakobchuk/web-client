import {Box} from "@mui/material";

import {IConversation} from "../../../interfaces/common";
import {useRole} from "../../../utils";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {socket} from "../../../socketClient";

interface IProps {
    conversation: IConversation,
    setCurrentChat: (obj: any) => void,
    setOpenDrawer?: any
}

const ListCardChat = ({conversation, setCurrentChat, setOpenDrawer}: IProps) => {

    const {role} = useRole();

    const [searchParams, setSearchParams] = useSearchParams();
    const [bgColor, setBgColor] = useState("primary.main");
    const [color, setColor] = useState("secondary.contrastText");
    useEffect(() => {
        if (searchParams.get('conversationId') === conversation?._id) {
            setBgColor("info.main")
            setColor("secondary.contrastText")
        } else {
            setBgColor("primary.main")
            setColor("secondary.main")
        }
    }, [searchParams]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            gap: 4,
            p: '10px',
            height: '80px',
            borderRadius: '10px',
            bgcolor: bgColor,
            color: color,
            cursor: color === "secondary.contrastText" ? 'normal' : 'pointer'
        }}
             onClick={() => {
                 setCurrentChat(conversation)
                 setOpenDrawer(true)
                 setSearchParams({'conversationId': conversation?._id})
             }}
        >
            <Box sx={{
                position: 'relative',
                height: '66px'
            }}>
                <img
                    src={conversation?.institutionId?.pictures[0].url}
                    alt={conversation?.userId?.name}
                    style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
                <img
                    src={conversation?.userId?.avatar}
                    alt={conversation?.userId?.name}
                    style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '20px',
                        left: '20px'
                    }}
                />
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{
                    fontWeight: 600
                }}>
                    {
                        role === 'user'
                            ? conversation?.institutionId?.title
                            : role === 'manager'
                                ? conversation?.userId?.name
                                : `${conversation?.institutionId?.title} - ${conversation?.userId?.name}`
                    }
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {
                        conversation?.lastMessage?.sender === conversation?.userId?._id
                            ? conversation?.userId?.name : conversation?.institutionId?.title
                    }
                    <Box sx={{
                        fontSize: '14px',
                    }}>
                        {
                            conversation?.lastMessage?.text?.length > 30 ? `${conversation?.lastMessage?.text?.substring(0, 30)}...` : conversation?.lastMessage?.text
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default ListCardChat
