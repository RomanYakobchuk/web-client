import {Box} from "@mui/material";

import {IConversation, IUser, ProfileProps} from "@/interfaces/common";
import {useSearchParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {useUserInfo} from "@/hook";
import CryptoJS from "crypto-js";
import {secretKeyCryptMessage} from "@/config/const";
import {ColorModeContext} from "@/contexts";

interface IProps {
    conversation: IConversation,
}

const ListChatCard = ({conversation}: IProps) => {

    const {user} = useUserInfo();
    const {mode} = useContext(ColorModeContext);
    const [searchParams] = useSearchParams();
    const [searchId, setSearchId] = useState<string | null>(null);
    useEffect(() => {

    }, [searchParams, conversation?._id]);

    useEffect(() => {
        const id = searchParams.get('conversationId');
        if (id) {
            setSearchId(id);
        } else {
            setSearchId(null)
        }
    }, [searchParams.get('conversationId')]);

    const sender = conversation?.members?.find((member) => {
        const memberSender = member?.user as ProfileProps;
        return memberSender?._id === conversation?.lastMessage?.sender;
    })?.user as IUser;

    const bytes = conversation?.lastMessage?.text?.length > 5 ? CryptoJS.AES.decrypt(conversation?.lastMessage?.text, secretKeyCryptMessage) : '';
    const encryptedLastMessage = bytes ? JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) : '';
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            gap: 2,
            p: '10px',
            height: 'fit-content',
            borderRadius: '10px',
            bgcolor: searchId === conversation?._id ? "info.main" : (mode === 'dark' ? "modern.modern_2.main" : 'common.black'),
            color: searchId === conversation?._id ? "secondary.contrastText" : 'common.white',
            cursor: searchId === conversation?._id ? 'normal' : 'pointer',
            boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.2)',
            transition: '200ms linear',
            "&:hover":{
                bgcolor: "info.main",
                color: "secondary.contrastText",
                boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.6)',
            }
        }}
        >
            <Box sx={{
                position: 'relative',
                height: 'fit-content'
            }}>
                <Box sx={{
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'common.white',
                    borderRadius: '50%',
                }}>
                    {
                        conversation?.chatInfo?.picture
                            ? <img
                                src={conversation?.chatInfo?.picture}
                                alt={conversation?.chatInfo?.chatName}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                            : <Box sx={{
                                textTransform: 'capitalize',
                                fontSize: '20px',
                                color: 'common.black',
                            }}>
                                {conversation?.chatInfo?.chatName?.substring(0, 1)}
                            </Box>
                    }
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{
                    fontWeight: 600
                }}>
                    {conversation?.chatInfo?.chatName}
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {
                        sender?._id === user?._id
                            ? user?.name : sender?.name
                    }
                    <Box sx={{
                        fontSize: '14px',
                    }}>
                        {
                            encryptedLastMessage.length > 30 ? `${encryptedLastMessage?.substring(0, 30)}...` : encryptedLastMessage
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default ListChatCard
