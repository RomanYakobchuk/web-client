import {Dispatch, SetStateAction, MouseEvent, useState} from "react";
import {useNotification, useTranslate, useForm} from "@refinedev/core";
import {Box, Button, IconButton, Typography} from "@mui/material";
import { Close} from "@mui/icons-material";

import {IConversation, IConvMembers, ProfileProps} from "@/interfaces/common"
import {SearchByTypeComponent} from "@/components/common/search";
import {ScaleWindow} from "@/components/window/scaleWindow";
import CreatePrivate from "./createPrivate";
import CreateGroup from "./createGroup";
import {useUserInfo} from "@/hook";

type TProps = {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}
export const CreateChatBox = ({isOpen, setIsOpen}: TProps) => {

    const {open} = useNotification();
    const {user} = useUserInfo();
    const translate = useTranslate();

    const [searchValue, setSearchValue] = useState<string>("");
    const [connectedUser, setConnectedUser] = useState<ProfileProps | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<IConversation['type']>('private');
    const [access, setAccess] = useState<IConversation['access']>('private');
    const [chatName, setChatName] = useState<string>("");

    const {onFinish, mutationResult: {data}} = useForm({
        resource: 'conversation/createOwnChat',
        redirect: false,
        action: 'create',
        successNotification: (data: any) => {
            return {
                type: 'success',
                message: data?.data?.message
            }
        },
        errorNotification: (data: any) => {
            return {
                type: "error",
                message: data?.response?.data?.error
            }
        }
    })

    const handleClose = () => {
        setIsOpen(false)
    };
    const handleCreate = async (event: MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const members: IConvMembers[] = [
                {
                    user: user?._id as string,
                    connectedAt: new Date(),
                    showInfoAs: {
                        item: 'user',
                        id: null
                    }
                }
            ]
            if (type === 'private') {
                if (connectedUser) {
                    members.push({
                        user: connectedUser?._id,
                        connectedAt: new Date(),
                        showInfoAs: {
                            item: 'user',
                            id: null
                        }
                    })
                }
                if (members?.length <= 1 && !connectedUser) {
                    return alert('Find user for chat')
                }
            }
            const formData = new FormData();
            formData.append('chatName', chatName);
            formData.append('type', type);
            formData.append('access', type === 'private' ? "private" : access);
            formData.append('members', JSON.stringify(members));
            formData.append('userId', user?._id)
            formData.append('dependId', user?._id)
            formData.append('dependItem', "user")
            if (file) {
                formData.append('picture', file)
            }
            await onFinish(formData);
            if (data?.data?.chat) {
            }
            setIsOpen(false)
        } catch (e: any) {
            open?.({
                type: 'error',
                message: e?.response?.data?.message,
                description: 'Error'
            })
        }
    }

    const byType = {
        group: <CreateGroup
            chatName={chatName}
            setChatName={setChatName}
            setAccess={setAccess}
            file={file}
            setFile={setFile}
        />,
        private: <CreatePrivate
            user={connectedUser}
            setUser={setConnectedUser}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
        />
    }

    const disabled = type === "group" ? (chatName?.length <= 0 || !access) : !connectedUser;

    return (
        <ScaleWindow isOpen={isOpen} setIsOpen={setIsOpen}>
            <Box
                component={'form'}
                onSubmit={handleCreate}
            >
                <header style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end'
                }}>
                    <IconButton onClick={handleClose}>
                        <Close/>
                    </IconButton>
                </header>
                <Box sx={{
                    width: '100%',
                    p: {xs: 2, sm: 3, md: 4},
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%'
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5
                        }}>
                            <Typography>
                                {translate('chats.create.type.title')}
                            </Typography>
                            <SearchByTypeComponent
                                type={type}
                                setType={setType}
                                styleSx={{
                                    width: 'fit-content',
                                }}
                                sortTranslatePath={'chats.create.type'}
                                arrayType={[
                                    {
                                        value: 'private',
                                        title: 'private'
                                    },
                                    {
                                        value: 'group',
                                        title: 'group'
                                    },
                                ]}
                            />
                        </Box>
                        <Box sx={{
                            p: 2,
                            borderRadius: '10px',
                            border: '2px solid cornflowerblue'
                        }}>
                            {byType[type]}
                        </Box>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'end',
                        gap: 2,
                        "& button": {
                            textTransform: 'inherit',
                            fontSize: {xs: '16px', md: '18px'}
                        }
                    }}>
                        <Button
                            color={'error'}
                            onClick={handleClose}
                        >
                            {translate('buttons.cancel')}
                        </Button>
                        <Button
                            disabled={disabled}
                            color={'info'}
                            type={'submit'}
                        >
                            {translate('actions.create')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ScaleWindow>
    )
};