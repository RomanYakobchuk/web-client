import {GetListResponse, useInfiniteList, useTranslate} from "@refinedev/core";
import React, {
    ChangeEvent,
    MutableRefObject,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import dayjs from "dayjs";
import CryptoJS from "crypto-js";
import {Box, Button, CircularProgress, IconButton, TextField} from "@mui/material";
import {
    AddRounded,
    Clear,
    NorthRounded,
    CachedOutlined
} from "@mui/icons-material";
import {FileWordOutlined, FilePdfOutlined, FileJpgOutlined, FileImageOutlined} from "@ant-design/icons";


import {IConversation, IMessage, ProfileProps} from "@/interfaces/common";
import {socket} from "@/socketClient";
import {useUserInfo} from "@/hook";
import {Loading, ModalShowContent} from "@/components";
import MessagesBox from "@/components/chats/chatBox/messages-box";
import {handleKeyDownBlockEnter} from "@/keys";
import {ColorModeContext} from "@/contexts";
import {secretKeyCryptMessage} from "@/config/const";
import {axiosInstance} from "@/authProvider";


type TProps = {
    conversation: IConversation
}
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
export const MessagesInputContainer = ({conversation}: TProps) => {

    const {user} = useUserInfo();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const [openModalForSendFile, setOpenModalForSendFile] = useState<boolean>(false);
    const [fileInfo, setFileInfo] = useState<TInfoFile | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [updatedMessageStatus, setUpdatedMessageStatus] = useState<IMessage | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const [replyTo, setReplyTo] = useState<IMessage>({} as IMessage);
    const [messageText, setMessageText] = useState<string>('');
    const [messages, setMessages] = useState<Array<[string, IMessage[]]>>([] as Array<[string, IMessage[]]>);
    const [arivialMessages, setArivialMessages] = useState<IMessage | null>(null);

    const {
        data,
        fetchNextPage,
        isLoading,
        isError,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList<IMessage>({
        resource: `message/find/${conversation?._id}`,
        pagination: {
            pageSize: 40
        },
        liveMode: 'auto',
    });

    const receiversIds = conversation?.members?.filter((member) => {
        const memberUser = member?.user as ProfileProps;
        return memberUser?._id !== user?._id
    })?.map((member) => {
        const memberUser = member?.user as ProfileProps;
        return memberUser?._id
    });
    const sendMessage = async (text: string) => {
        try {
            if (!text && !file) return;
            setIsSending(true)
            const currentDate = dayjs.utc().format('');
            const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(text), secretKeyCryptMessage).toString();

            if (file) {
                const formData = new FormData();
                formData.append('file', file)
                // socket?.emit('sendFile', formData)
                await axiosInstance.post(`${SOCKET_API}/socket/api/v1/message/file`, formData)
            } else {

                const messageData = {
                    sender: user?._id,
                    receiver: [...receiversIds],
                    text: encryptedMessage,
                    chatId: conversation?._id,
                    createdAt: currentDate,
                    replyTo: replyTo?._id && replyTo?._id
                };
                socket?.emit('sendMessage', messageData)
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
            setIsSending(false)
            setError('Error')
        } finally {
            setIsSending(false)
        }
    }
    useEffect(() => {
        socket?.emit('joinChat', conversation?._id);
    }, []);

    useEffect(() => {
        socket?.on('isSent', (data: any) => {
            setUpdatedMessageStatus(prevState => {
                return {
                    ...prevState,
                    ...data,
                    conversationId: data?.chatId
                }
            })
        });
        socket?.on('getMessage', (data: any) => {
            setArivialMessages((prevState) => {
                return {
                    ...prevState,
                    ...data,
                    _id: data?._id,
                    sender: data?.sender,
                    text: data?.text,
                    replyTo: data?.replyTo,
                    createdAt: data?.createdAt
                }
            });
        })

        return () => {
            socket.off('getMessage')
            socket.off('isSent')
        }
    }, [socket]);
    useEffect(() => {
        const updateMessages = async () => {
            try {
                if (data?.pages) {
                    const list: Array<[string, IMessage[]]> = [].concat(...(data?.pages as any ?? [])?.map((page: GetListResponse<IMessage>) => Object.entries(page?.data))).sort(([dateA]: [string], [dateB]: [string]) => {
                        const [dayA, monthA, yearA] = dateA?.split('-');
                        const [dayB, monthB, yearB] = dateB?.split('-');

                        const dateObjA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
                        const dateObjB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));

                        return dateObjA.getTime() - dateObjB.getTime();
                    });
                    if (list) {
                        const mergedObjects = list.reduce((acc: Record<string, IMessage[]>, [key, arr]) => {
                            if (acc[key]) {
                                acc[key] = acc[key].concat(arr);
                            } else {
                                acc[key] = arr;
                            }
                            return acc;
                        }, {} as Record<string, IMessage[]>);
                        const mergedArray: [string, IMessage[]][] = Object.entries(mergedObjects);
                        setMessages(mergedArray);
                    }
                }
            } catch (e) {
                setError('Error')
            }
        }
        updateMessages();
    }, [data?.pages]);
    useEffect(() => {
        if (arivialMessages?._id) {
            setMessages(prevState => {
                const messagesCopy = [...prevState];
                const lastObject = messagesCopy[messagesCopy.length - 1];
                const currentDate = dayjs(arivialMessages.createdAt).format('DD-M-YYYY');

                if (lastObject && Array.isArray(lastObject[1]) && lastObject[1].includes(arivialMessages)) {
                    return prevState;
                }
                if (lastObject && Array.isArray(lastObject[1]) && currentDate === lastObject[0]) {
                    lastObject[1] = [...lastObject[1], arivialMessages];
                } else {
                    messagesCopy.push([dayjs(new Date()).format('DD-M-YYYY'), [arivialMessages]]);
                }

                return messagesCopy;
            });

            setArivialMessages(null);
        }
    }, [arivialMessages?._id]);
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

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
    const handleCloseModalForSendFile = () => {
        setFile(null);
        setOpenModalForSendFile(false);
        setFileInfo(null);
        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    }
    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: 'calc(100% - 60px)',
            height: '100%'
        }}>
            <Box sx={{
                flex: 20,
                // borderRadius: '15px',
                maxHeight: '100%',
                height: 'calc(100% - 100px)',
                bgcolor: 'background.paper',
                backgroundImage: `url('images/chats/${mode === 'dark' ? 'bg-black.png' : 'bg-white.jpg'}')`,
                backgroundPosition: 'center',
                backgroundSize: mode === 'dark' ? 'cover' : 'auto'
            }}
            >
                {
                    !isError ?
                        isLoading ? <Loading height={'300px'}/> :
                            <MessagesBox
                                error={error}
                                isSending={isSending}
                                hasNextPage={hasNextPage}
                                fetchNextPage={fetchNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                messages={messages ?? []}
                                setReplyTo={setReplyTo}
                                total={total}
                                conversation={conversation}
                            /> : <div>Error</div>
                }
            </Box>
            {
                replyTo?._id && (
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        maxWidth: '400px',
                        m: 'auto',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderLeft: '2px solid silver',
                        pl: '10px',
                        flex: 1
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{
                                fontSize: '14px',
                                fontWeight: 600
                            }}>
                                {/*{*/}
                                {/*    replyTo?.sender !== chatUser?._id*/}
                                {/*        ? chatUser?.name*/}
                                {/*        : conversation?.institutionId?.title*/}
                                {/*}*/}
                            </Box>
                            <Box sx={{
                                fontSize: '12px',
                            }}>
                                {
                                    replyTo?.text?.length > 40 ? `${replyTo?.text?.substring(0, 40)}...` : replyTo?.text
                                }
                            </Box>
                        </Box>
                        <IconButton onClick={() => setReplyTo({} as IMessage)}>
                            <Clear/>
                        </IconButton>
                    </Box>
                )
            }
            <Box sx={{
                // flex: 1,
                display: 'flex',
                gap: 1,
                minHeight: '36px',
                height: 'fit-content',
                alignItems: 'end',
                width: {xs: 'calc(100% - 20px)', lg: '100%'},
                m: {xs: '10px', lg: 0},
                mt: 0,
            }}>
                <Box
                    sx={{
                        width: {xs: '30px', md: '36px'},
                        height: {xs: '30px', md: '36px'},
                        position: 'relative'
                    }}>
                    <Button
                        component="label"
                        sx={{
                            minWidth: '30px',
                            width: '100%',
                            height: '100%',
                            p: {xs: 0, md: 1},
                            border: `2px solid ${mode === 'light' ? '#151515' : '#f1f1f1'}`
                        }}
                    >
                        <AddRounded/>
                        <input
                            ref={inputFileRef}
                            hidden
                            type="file"
                            accept={".jpg, .jpeg, .png, .doc, .docx, .pdf"}
                            id={'changeFileForSend'}
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
                <Box sx={{
                    width: '100%'
                }}>
                    <TextField
                        fullWidth
                        value={!openModalForSendFile && messageText ? messageText : '' || ""}
                        variant={'standard'}
                        onChange={(event) => setMessageText(event.target.value)}
                        size={'small'}
                        multiline
                        minRows={1}
                        maxRows={3}
                        placeholder={'Type a message'}
                        onKeyDown={(event) => handleKeyDownBlockEnter(event, messageText)}
                    />
                </Box>
                <Box sx={{
                    width: {xs: '30px', md: '36px'},
                    height: {xs: '30px', md: '36px'},
                }}>
                    <Button
                        variant={'contained'}
                        color={'info'}
                        sx={{
                            width: '100%',
                            height: '100%',
                            minWidth: '30px',
                            p: {xs: 0, md: 1},
                            borderRadius: '7px',
                        }}
                        disabled={messageText?.length <= 0}
                        onClick={() => sendMessage(messageText)}
                    >
                        {
                            isSending
                                ? <CircularProgress
                                    color={'secondary'}
                                    size={'20px'}
                                />
                                : <NorthRounded/>
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
        </Box>
    );
};

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
                            boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.2)',
                            borderRadius: '7px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            "& svg": {
                                fontSize: '50px'
                            }
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
                                            value: <a href={URL.createObjectURL(file)} target="_blank">{(fileInfo ? fileInfo?.name?.split('.')?.[0]?.substring(0, 10) : '') + `${fileInfo?.name?.split('.')?.[0]?.length > 10 ? '[...]' : ''}.` + (fileInfo ? fileInfo?.name?.split('.').pop() : '')}</a>,
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
                                                {translate(`chats.show.load.file.${item?.title}`)}:
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