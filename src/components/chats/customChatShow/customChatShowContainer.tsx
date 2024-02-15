import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Box} from "@mui/material";

import {IConversation, IConvMembers} from "@/interfaces/common";
import {ChatHeader} from "@/components/chats/chatBox/chatBox";
import {CurrentChatContainer, Loading} from "@/components";
import {ACCESS_TOKEN_KEY} from "@/config/const";
import {axiosInstance} from "@/authProvider";
import {ScaleWindow} from "@/components/window/scaleWindow";
import {useMobile, useUserInfo} from "@/hook";

type TProps = {
    chatFieldName: IConversation['chatInfo']['field']['name'],
    chatFieldId: string,
    chatName?: string,
    members?: IConvMembers[],
    chatType: IConversation['chatInfo']['type'],
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}

const ACCESS = localStorage.getItem(ACCESS_TOKEN_KEY);
export const CustomChatShowContainer = ({
                                            chatFieldId,
                                            chatType,
                                            chatName,
                                            chatFieldName,
                                            members,
                                            isOpen,
                                            setIsOpen
                                        }: TProps) => {

    const {user} = useUserInfo();
    const {device} = useMobile();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chat, setChat] = useState<IConversation | null>(null);
    const findChat = async () => {
        try {
            if (chatFieldName && chatFieldId && chatType && ACCESS) {
                setIsLoading(true)
                const res = await axiosInstance.post(`/conversation/create`, {
                    chatFieldName: chatFieldName,
                    chatFieldId: chatFieldId,
                    chatName: chatName,
                    members: members,
                    chatType: chatType
                }, {
                    headers: {
                        Authorization: ACCESS
                    }
                });
                if (res?.data?.chat?._id) {
                    setChat(res?.data?.chat);
                }
            }
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (chatFieldId && isOpen && user?._id) {
            findChat();
        }
    }, [chatFieldId, isOpen, user?._id]);

    return (
        <ScaleWindow
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            contentSx={{
                top: '50%',
                maxWidth: {xs: '90%', sm: '80%', md: '800px'},
                p: 2,
                height: device ? '90%' : '80%'
            }}
        >
            {
                isLoading
                    ? <Loading height={'200px'}/> :
                    chat?._id && (
                        <CurrentChatContainer
                            setOpenDrawer={setIsOpen}
                            conversation={chat}
                            closeChat={() => {
                                setChat(null)
                            }}
                            header={<ChatHeader currentChat={chat}/>}
                        />
                    )
            }
        </ScaleWindow>
    );
};

