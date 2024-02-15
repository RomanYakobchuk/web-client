import {Box} from "@mui/material";

import {IConversation, IUser, ProfileProps} from "@/interfaces/common";
import {useSearchParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {useUserInfo} from "@/hook";
import CryptoJS from "crypto-js";
import {secretKeyCryptMessage} from "@/config/const";
import {ColorModeContext} from "@/contexts";
import dayjs from "dayjs";
import {useTranslate} from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";

interface IProps {
    conversation: IConversation,
}

const ListChatCard = ({conversation}: IProps) => {

    const {user} = useUserInfo();
    const translate = useTranslate();
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

    const chatType = {
        establishment: translate('home.one'),
        user: translate('roles.user'),
        capl: translate('capl.reservation')
    }
    // const memberConvUserInfo = conversation?.members?.find((member) => {
    //     const userMember = member?.user as IUser;
    //     return userMember?._id === user?._id;
    // });
    // const memberConvUserInfoTitle = memberConvUserInfo?.conversationTitle || '';

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            // gap: 2,
            // p: '10px',
            // height: 'fit-content',
            borderRadius: '10px',
            bgcolor: searchId === conversation?._id ? "info.main" : (mode === 'dark' ? "modern.modern_2.main" : 'common.black'),
            color: searchId === conversation?._id ? "secondary.contrastText" : 'common.white',
            cursor: searchId === conversation?._id ? 'normal' : 'pointer',
            boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.2)',
            transition: '200ms linear',
            "&:hover": {
                bgcolor: "info.main",
                color: "secondary.contrastText",
                boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.6)',
            },
            // maxHeight: '70px',
            p: 1
        }}
        >
            <Box sx={{
                position: 'relative',
                height: '100%',
            }}>
                <Box sx={{
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    "& img": {
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }
                }}>
                    {
                        conversation?.chatInfo?.picture
                            ? <img
                                src={conversation?.chatInfo?.picture}
                                alt={conversation?.chatInfo?.chatName}
                            />
                            : <Box sx={{
                                textTransform: 'capitalize',
                                fontSize: '20px',
                                height: '100%',
                                width: '100%',
                                display: 'grid',
                                color: 'common.black',
                                borderRadius: '50%',
                                bgcolor: 'common.white',
                                placeItems: 'center'
                            }}>
                                {conversation?.chatInfo?.chatName?.substring(0, 1)}
                            </Box>
                    }
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                px: 1
                // gap: 1
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'normal',
                    gap: 2,
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <Box sx={{
                        fontWeight: 600
                    }}>
                        {conversation?.chatInfo?.chatName?.substring(0, 24)}
                    </Box>
                    <Box sx={{
                        fontSize: '14px'
                    }}>
                        [{chatType[conversation?.chatInfo?.field?.name]}]
                    </Box>
                    {/*{*/}
                    {/*    memberConvUserInfoTitle && (*/}
                    {/*        <Box sx={{*/}
                    {/*            fontSize: '14px',*/}
                    {/*            fontWeight: 'bold'*/}
                    {/*        }}>*/}
                    {/*            {memberConvUserInfoTitle?.substring(0, 16)}*/}
                    {/*        </Box>*/}
                    {/*    )*/}
                    {/*}*/}
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'end',
                    // justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        // alignItems: 'center',
                        // gap: 1
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            // gap: 2,
                            justifyContent: 'space-between',
                            // width: '100%'
                        }}>
                            {
                                conversation?.chatInfo?.type === 'group' && (
                                    <Box sx={{
                                        fontSize: {xs: '14px', sm: '16px'},
                                        fontWeight: 500,
                                        color: mode === "dark" ? "#fcfcfc" : '#000'
                                    }}>
                                        {
                                            sender?._id === user?._id
                                                ? user?.name : sender?.name
                                        }
                                    </Box>
                                )
                            }
                        </Box>
                        <Box sx={{
                            "& a": {
                                color: 'var(--color-accent-fg)',
                                textDecoration: 'underline'
                            },
                            "& div.wmde-markdown": {
                                color: 'common.white',
                                fontSize: {xs: "13px", sm: '15px'},
                            }
                        }}>
                            <MDEditor.Markdown
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    background: 'transparent',
                                    color: 'silver'
                                }}
                                source={encryptedLastMessage.length > 30 ? `${encryptedLastMessage?.substring(0, 30)}...` : encryptedLastMessage}
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        fontSize: '13px'
                    }}>
                        {conversation?.lastMessage?.updatedAt && dayjs(conversation?.lastMessage?.updatedAt)?.format('HH:mm')}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default ListChatCard
