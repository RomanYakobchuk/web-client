import {Dispatch, SetStateAction, useEffect, useState} from "react";

import {IConversation, IConvMembers} from "@/interfaces/common";
import {ChatHeader} from "@/components/chats/chatBox/chatBox";
import {CurrentChatContainer, Loading} from "@/components";
import {axiosInstance} from "@/authProvider";
import {ScaleWindow} from "@/components/window/scaleWindow";
import {useMobile, useUserInfo} from "@/hook";

type TProps = {
    chatDependItem: IConversation['depend']['item'],
    chatDependId: string,
    chatName?: string,
    members?: IConvMembers[],
    type: IConversation['type'],
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}

export const CustomChatShowContainer = ({
                                            chatDependId,
                                            type,
                                            chatName,
                                            chatDependItem,
                                            members,
                                            isOpen,
                                            setIsOpen
                                        }: TProps) => {

    const {user, access_token} = useUserInfo();
    const {device} = useMobile();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chat, setChat] = useState<IConversation | null>(null);

    useEffect(() => {
        if (chatDependId && isOpen && user?._id) {
            const findChat = async () => {
                try {
                    if (chatDependItem && chatDependId && type) {
                        setIsLoading(true)
                        const res = await axiosInstance.post(`/conversation/create`, {
                            dependItem: chatDependItem,
                            dependId: chatDependId,
                            chatName: chatName,
                            members: members,
                            type: type,
                            access: 'private'
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
            findChat();
        }
    }, [chatDependId, isOpen, user?._id]);

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

