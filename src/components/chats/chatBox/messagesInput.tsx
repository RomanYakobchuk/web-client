import {Box, Button, CircularProgress, IconButton, InputAdornment, TextField} from "@mui/material";
import React, {ChangeEvent, Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState} from "react";
import {FileImageOutlined, FileJpgOutlined, FilePdfOutlined, FileWordOutlined} from "@ant-design/icons";
import {AttachFileRounded, CachedOutlined, EditRounded, SendRounded} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import CryptoJS from "crypto-js";
import dayjs from "dayjs";

import {IConversation} from "@/interfaces/common";
import {EmojiPicker} from "@/components/picker/emojiPicker";
import {secretKeyCryptMessage} from "@/config/const";
import {handleKeyDownBlockEnter} from "@/keys";
import {axiosInstance} from "@/authProvider";
import {socket} from "@/socketClient";
import {useUserInfo} from "@/hook";
import {ModalShowContent} from "@/components";
import {useStore} from "@/store";
import {IStore} from "@/store/useStore";

type TProps = {
    conversation: IConversation,
}

const sendIcon = {
    "edit": <EditRounded/>,
    "new": <SendRounded
        sx={{
            width: '90%',
            height: '90%',
            transform: 'rotateZ(-90deg)'
        }}
    />,
    "reply": <SendRounded
        sx={{
            width: '90%',
            height: '90%',
            transform: 'rotateZ(-90deg)'
        }}
    />
}
export const MessagesInput = ({conversation}: TProps) => {

    const {stateMessage, setStateMessage} = useStore(state => state);
    const isEdit = !!(stateMessage?.message && stateMessage?.typeState === 'edit' && stateMessage?.message?.conversationId === conversation?._id);
    const isReply = !!(stateMessage?.message && stateMessage?.typeState === 'reply' && stateMessage?.message?.conversationId === conversation?._id);
    const {user, access_token} = useUserInfo();

    const translate = useTranslate();
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [openModalForSendFile, setOpenModalForSendFile] = useState<boolean>(false);
    const [fileInfo, setFileInfo] = useState<TInfoFile | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const [messageText, setMessageText] = useState<string>(isEdit ? stateMessage?.message?.text as string : '');

    const receiversIds = conversation?.members?.filter((member) => {
        return member?.userId !== user?._id
    })?.map((member) => {
        return member?.userId
    });
    const sendMessage = async () => {
        try {
            if (!messageText?.trim() && !file) {
                return;
            }
            setIsSending(true)
            const currentDate = dayjs.utc().format('');
            const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(messageText?.trim()), secretKeyCryptMessage).toString();

            if (file && access_token) {
                console.log(file)
                const formData = new FormData();
                formData.append('file', file as File)
                // socket?.emit('sendFile', formData)
                await axiosInstance.post(`${SOCKET_API}/socket/api/v1/message/file`, formData, {
                    headers: {
                        Authorization: access_token,
                        'Content-Type': 'multipart/form-data'
                    }
                })
            }
            if (!file) {
                const messageData = {
                    sender: user?._id,
                    receivers: [...receiversIds],
                    text: encryptedMessage,
                    chatId: conversation?._id,
                    createdAt: currentDate,
                    conversationId: conversation?._id,
                    replyTo: isReply ? stateMessage?.message?._id : null
                };
                socket?.emit('sendMessage', messageData);
            }

            setIsSending(false)
            setFile(null);
            setFileInfo(null);
            setMessageText('')
            handleCloseModalForSendFile();
            return () => {
                socket.off('sendMessage');
            };
        } catch (error) {
            console.log(error)
            setIsSending(false)
        } finally {
            setIsSending(false)
        }
    }
    const handleCloseModalForSendFile = () => {
        setFile(null);
        setOpenModalForSendFile(false);
        setFileInfo(null);
        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    }
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                handleCloseModalForSendFile();
                return alert(translate('chats.show.load.file.sizeError'))
            }
            setFile(file);
            const info = {
                size: `${Math.round(file.size / (1024 * 1024) * 1000) / 1000}MB`,
                type: file.name.split('.').pop() as string || '',
                name: file.name
            }
            setFileInfo(info)
            setOpenModalForSendFile(true);
        }
    }

    useEffect(() => {
        if (isEdit && stateMessage?.message) {
            const t = setTimeout(() => {
                setStateMessage({
                    typeState: 'edit',
                    message: {
                        ...stateMessage.message,
                        newText: messageText as string,
                        _id: conversation?._id as string
                    } as IStore['stateMessage']['message']
                })
            }, 1000);
            return () => {
                clearTimeout(t);
            }
        }
    }, [messageText, isEdit]);

    useEffect(() => {
        if (!stateMessage?.message && stateMessage?.typeState === 'new') {
            setMessageText("")
        }
    }, [stateMessage]);

    useEffect(() => {
        if (isEdit) {
            setMessageText(stateMessage?.message?.newText || '')
        }
    }, [isEdit, stateMessage?.message?.newText]);

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMessageText(value);
        setIsTyping(true);
    }

    useEffect(() => {
        let typingTimer: NodeJS.Timeout;

        const handleTyping = () => {
            socket.emit('isTyping', {chatId: conversation?._id, userId: user?._id});
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                setIsTyping(() => false);
                socket.emit('stopTyping', {chatId: conversation?._id, userId: user?._id});
            }, 1000);
        };

        if (isTyping) {
            handleTyping();
        }

        return () => {
            clearTimeout(typingTimer);
        };
    }, [conversation?._id, user?._id, isTyping, socket]);

    return (
        <>
            <Box sx={{
                display: 'flex',
                height: 'fit-content',
                alignItems: 'end',
                width: '100%',
                borderRadius: '10px',
                p: 1,
                bgcolor: 'modern.modern_2.second'
            }}>
                <Box
                    sx={{
                        width: {xs: '30px', sm: '36px'},
                        height: {xs: '30px', sm: '36px'},
                    }}
                >
                    <Button
                        component="label"
                        sx={{
                            minWidth: '30px',
                            width: '100%',
                            height: '100%',
                            // p: {xs: 0, md: 1},
                            // border: `2px solid ${mode === 'light' ? '#151515' : '#f1f1f1'}`
                        }}
                    >
                        <AttachFileRounded/>
                        <input
                            ref={inputFileRef}
                            hidden
                            value={''}
                            type="file"
                            accept={".jpg, .jpeg, .png, .doc, .docx, .pdf"}
                            id={'changeFileForSend'}
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
                {/*<SpeedDeal*/}
                {/*    actions={[*/}
                {/*        {*/}
                {/*            icon: <Box*/}
                {/*                sx={{*/}
                {/*                    width: {xs: '30px', md: '36px'},*/}
                {/*                    height: {xs: '30px', md: '36px'},*/}
                {/*                    position: 'relative'*/}
                {/*                }}>*/}
                {/*               */}
                {/*            </Box>,*/}
                {/*            name: translate('buttons.add') + ' ' + translate('chats.show.load.file.file')?.toLowerCase()*/}
                {/*        },*/}
                {/*        {*/}
                {/*            icon: <Box sx={{*/}
                {/*                position: 'relative'*/}
                {/*            }}>*/}
                {/*                <EmojiPicker*/}
                {/*                    styleSx={{*/}
                {/*                        top: 'unset',*/}
                {/*                        bottom: '60px'*/}
                {/*                    }}*/}
                {/*                    emojiIconSx={{*/}
                {/*                        color: 'common.white'*/}
                {/*                    }}*/}
                {/*                    setValue={setMessageText}/>*/}
                {/*            </Box>,*/}
                {/*            name: ''*/}
                {/*        }*/}
                {/*    ]}*/}
                {/*    styleSx={{*/}
                {/*        height: 'auto',*/}
                {/*        transform: 'unset',*/}
                {/*        "& div.MuiSpeedDial-root": {*/}
                {/*            position: 'unset',*/}
                {/*            width: '36px',*/}
                {/*            "& > button": {*/}
                {/*                width: '36px',*/}
                {/*                height: '36px'*/}
                {/*            },*/}
                {/*            "& div#SpeedDialcontrolledopenexample-actions": {*/}
                {/*                position: 'absolute',*/}
                {/*                bottom: '40px',*/}
                {/*                zIndex: 10*/}
                {/*            }*/}
                {/*        }*/}
                {/*    }}*/}
                {/*/>*/}
                <Box sx={{
                    width: '100%',
                    minHeight: '30px',
                    py: {xs: '3px', sm: '6px'},
                    borderRadius: '20px',
                    bgcolor: 'common.black'
                }}>
                    <TextField
                        fullWidth
                        value={!openModalForSendFile && messageText ? messageText : '' || ""}
                        variant={'outlined'}
                        sx={{
                            "& div.MuiOutlinedInput-root": {
                                p: '0 14px',
                            },
                            "& textarea": {
                                color: 'common.white',
                            },
                            "& fieldset": {
                                border: 'none'
                            }
                        }}
                        onChange={handleMessageChange}
                        size={'small'}
                        multiline
                        minRows={1}
                        maxRows={10}
                        placeholder={'Type a message'}
                        onKeyDown={(event) => handleKeyDownBlockEnter(event, messageText)}
                        InputProps={{
                            endAdornment: <InputAdornment
                                sx={{
                                    display: {xs: 'none', sm: 'flex'}
                                }}
                                position={'end'}>
                                <Box sx={{
                                    position: 'relative',

                                }}>
                                    <EmojiPicker
                                        styleSx={{
                                            top: 'unset',
                                            bottom: '60px',
                                            right: '-30px'
                                        }}
                                        position={'right'}
                                        emojiIconSx={{
                                            color: 'common.white'
                                        }}
                                        setValue={setMessageText}/>
                                </Box>
                            </InputAdornment>
                        }}
                    />
                </Box>
                <Box sx={{
                    width: {xs: '30px', sm: '36px'},
                    height: {xs: '30px', sm: '36px'},
                }}>
                    <Button
                        variant={'text'}
                        color={'info'}
                        sx={{
                            p: 0,
                            width: '100%',
                            height: '100%',
                            minWidth: '30px',
                        }}
                        disabled={messageText?.length <= 0}
                        onClick={sendMessage}
                    >
                        {
                            isSending
                                ? <CircularProgress
                                    color={'secondary'}
                                    size={'20px'}
                                />
                                : sendIcon[stateMessage.typeState]
                        }
                    </Button>
                </Box>
            </Box>
            <SendMessageWithFile
                fileInfo={fileInfo}
                handleCloseModalForSendFile={handleCloseModalForSendFile}
                messageText={messageText}
                openModalForSendFile={openModalForSendFile}
                setMessageText={setMessageText}
                setOpenModalForSendFile={setOpenModalForSendFile}
                file={file}
                sendMessage={sendMessage}
                handleFileChange={handleFileChange}
                inputFileRef={inputFileRef}
            />
        </>
    );
};
type TInfoFile = {
    type: string,
    name: string,
    size: string
}
const iconByType = {
    doc: <FileWordOutlined/>,
    docx: <FileWordOutlined/>,
    pdf: <FilePdfOutlined/>,
    jpeg: <FileImageOutlined/>,
    jpg: <FileJpgOutlined/>,
    png: <FileImageOutlined/>,
}
const SOCKET_API = import.meta.env.VITE_APP_SOCKET_API;

type TSendMessageWithFile = {
    openModalForSendFile: boolean,
    setOpenModalForSendFile: Dispatch<SetStateAction<boolean>>,
    handleCloseModalForSendFile: () => void,
    fileInfo: TInfoFile | null,
    messageText: string,
    setMessageText: Dispatch<SetStateAction<string>>,
    file: File | null,
    sendMessage: (text: string) => Promise<undefined | (() => void)>,
    inputFileRef: MutableRefObject<HTMLInputElement | null>,
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}
const SendMessageWithFile = ({
                                 setOpenModalForSendFile,
                                 openModalForSendFile,
                                 handleCloseModalForSendFile,
                                 fileInfo,
                                 messageText,
                                 setMessageText,
                                 file,
                                 sendMessage,
                                 inputFileRef,
                                 handleFileChange
                             }: TSendMessageWithFile) => {
    const translate = useTranslate();
    return (
        <ModalShowContent
            isOpen={openModalForSendFile}
            setIsOpen={setOpenModalForSendFile}
            onClick={() => sendMessage(messageText)}
            onSuccessText={translate('buttons.send')}
            modalStyle={{
                bgcolor: 'common.black'
            }}
            headerStyle={{
                marginBottom: 0
            }}
            onClose={handleCloseModalForSendFile}
        >
            {
                file && fileInfo && (
                    <Box sx={{
                        width: '100%',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Box sx={{
                            p: 1,
                            // bgcolor: '',
                            boxShadow: '0px 0px 8px 0px rgba(200, 200, 200, 0.4)',
                            borderRadius: '7px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            "& svg": {
                                fontSize: '50px'
                            },
                            justifyContent: 'space-between'
                        }}>
                            {iconByType[fileInfo?.type as keyof typeof iconByType]}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                // gap: 0.5
                            }}>
                                {
                                    [
                                        {
                                            value: <Box>
                                                <a href={URL.createObjectURL(file)}
                                                   target="_blank">{(fileInfo ? fileInfo?.name?.split('.')?.[0]?.substring(0, 10) : '') + `${fileInfo?.name?.split('.')?.[0]?.length > 10 ? '[...]' : ''}.` + (fileInfo ? fileInfo?.name?.split('.').pop() : '')}
                                                </a>
                                            </Box>,
                                            title: "name"
                                        },
                                        {
                                            value: fileInfo?.size,
                                            title: "size"
                                        },
                                        {
                                            value: fileInfo?.type,
                                            title: "type"
                                        },
                                    ]?.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 2fr',
                                                gap: 2
                                            }}
                                        >
                                            <Box sx={{
                                                fontSize: '14px'
                                            }}>
                                                {translate(`chats.show.load.file.${item?.title}`) + ':'}
                                            </Box>
                                            <Box sx={{
                                                fontSize: '13px'
                                            }}>
                                                {item?.value}
                                            </Box>
                                        </Box>
                                    ))
                                }
                            </Box>
                            <IconButton
                                sx={{
                                    p: 0,
                                    "& svg": {
                                        fontSize: '30px'
                                    }
                                }}
                                component="label"
                            >
                                <CachedOutlined/>
                                <input
                                    ref={inputFileRef}
                                    hidden
                                    value={''}
                                    type="file"
                                    accept={".jpg, .jpeg, .png, .doc, .docx, .pdf"}
                                    id={'changeFileForSend'}
                                    onChange={handleFileChange}
                                />
                            </IconButton>
                        </Box>
                        <Box sx={{
                            width: '100%'
                        }}>
                            <TextField
                                fullWidth
                                value={messageText || ''}
                                variant={'standard'}
                                onChange={(event) => setMessageText(event.target.value)}
                                size={'small'}
                                multiline
                                minRows={1}
                                maxRows={5}
                                placeholder={'Type a message'}
                                onKeyDown={(event) => handleKeyDownBlockEnter(event, messageText)}
                            />
                        </Box>
                    </Box>
                )
            }
        </ModalShowContent>
    )
}