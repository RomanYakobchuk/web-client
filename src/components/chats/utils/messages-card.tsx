import {ContentCopy, ReplyOutlined, DoneOutlined, DoneAllOutlined, ErrorOutlined} from "@mui/icons-material";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {FC, useContext, useEffect, useRef, useState} from "react";
import {useInView} from "react-intersection-observer";
import {Box, Menu, MenuItem, Popover, SxProps} from "@mui/material";
import CryptoJS from "crypto-js";

import {IConversation, IGetIdentity, IMessage, ProfileProps} from "@/interfaces/common";
import {secretKeyCryptMessage} from "@/config/const";
import useLongPress from "@/hook/useLongPress";
import {socket} from "@/socketClient";
import dayjs from "dayjs";
import {ColorModeContext} from "@/contexts";
import MDEditor from "@uiw/react-md-editor";

interface IProps {
    item: IMessage,
    receiver: ProfileProps,
    setReplyTo: (item: IMessage) => void,
    lengthGroup: number,
    index: number,
    conversation: IConversation
}

const MessagesCard = ({item: message, receiver, setReplyTo, lengthGroup, index, conversation}: IProps) => {

        const translate = useTranslate();
        const {mode} = useContext(ColorModeContext);
        const {data: identity} = useGetIdentity<IGetIdentity>();
        const user: ProfileProps = identity?.user as ProfileProps;
        const {ref: refCard, inView: inViewCard} = useInView({
            threshold: 0.5
        })
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        const [currentMessage, setCurrentMessage] = useState<IMessage>(message);
        const [item, setItem] = useState<IMessage>(currentMessage);

        useEffect(() => {
            if (message) {
                setCurrentMessage(message)
            }
        }, [message]);
        useEffect(() => {
            if (currentMessage) {
                setItem(currentMessage)
            }
        }, [currentMessage])

        const currentDate = dayjs();
        const createdAtDate = dayjs(item?.createdAt);
        const diffInHour = currentDate.diff(createdAtDate, 'hour');

        const textRef = useRef<HTMLDivElement>(null);

        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);

        const copyText = async () => {
            if (textRef.current) {
                const textToCopy = textRef.current.innerText;
                await navigator.clipboard.writeText(textToCopy);
            }
        };
        const onClick = () => {
            // navigate((message?.sender === conversation?.managerId?._id)
            //     ? `/all_institutions/show/${conversation?.institutionId?._id}`
            //     : `/capl`
            // )
            console.log('press')
        }
        const handleClose = () => {
            setAnchorEl(null);
        };
        const onLongPress = () => {
            setAnchorEl(document.getElementById(`demo-positioned-button${item?._id}`));
        }
        const defaultOptions = {
            shouldPreventDefault: true,
            delay: 300,
        };
        const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

        const senderBorder = ({first = '3px', second = '5px', third = '7px', fourth = '10px'}: {first?: string, second?: string, third?: string, fourth?: string}) => {
            if (lengthGroup === 1) {
                return `${fourth} ${second} ${fourth} ${fourth}`
            } else if ((lengthGroup === 2 && index === 0) || (lengthGroup >= 3 && index === 0)) {
                return `${fourth} ${second} ${first} ${third}`
            } else if ((lengthGroup === 2 && index === 1) || (lengthGroup >= 3 && index === (lengthGroup - 1))) {
                return `${third} ${first} ${fourth} ${fourth}`
            } else if (lengthGroup >= 3 && index !== 0 && index !== (lengthGroup - 1)) {
                return `${third} ${first} ${first} ${third}`
            }
        }
        const receiverBorder = ({first = '3px', second = '5px', third = '7px', fourth = '10px'}: {first?: string, second?: string, third?: string, fourth?: string}) => {
            if (lengthGroup === 1) {
                return `${second} ${fourth} ${fourth} ${fourth}`
            } else if ((lengthGroup === 2 && index === 0) || (lengthGroup >= 3 && index === 0)) {
                return `${second} ${fourth} ${third} ${first}`
            } else if ((lengthGroup === 2 && index === 1) || (lengthGroup >= 3 && index === (lengthGroup - 1))) {
                return `${second} ${third} ${fourth} ${fourth}`
            } else if (lengthGroup >= 3 && index !== 0 && index !== (lengthGroup - 1)) {
                return `${fourth} ${third} ${third} ${second}`
            }
        };

        useEffect(() => {
            socket?.on('isSent', (data: any) => {
                if (data && data?.receiver === user?._id) {
                    socket?.emit('delivered', {
                        isDelivered: true,
                        sender: user?._id,
                        message: item,
                    })
                }
            })
            return () => {
                socket.off('isSent')
                socket.off('delivered')
            }
        }, []);

        useEffect(() => {
            socket?.on('isDelivered', (data: any) => {
                if (data && item?._id === data?.message?._id) {
                    setCurrentMessage((prevState) => ({
                            ...prevState,
                            isDelivered: data?.isDelivered,
                        }
                    ))
                }
            });

            return () => {
                socket.off('isDelivered')
            }
        }, []);

        const encryptedText = item?.text?.length > 5 ? JSON?.parse(CryptoJS.AES.decrypt(item?.text, secretKeyCryptMessage)?.toString(CryptoJS.enc.Utf8)) : "";

        const theSameUser = user?._id === receiver?._id;
        const chatPrev: SxProps = index === 0 ? theSameUser ? {
            "&::after": {
                content: "''",
                position: 'absolute',
                top: 0,
                right: '1px',
                bgcolor: 'info.main',
                width: '10px',
                height: '15px',
                transform: 'translateX(100%)',
                // clipPath: 'polygon(0% -3%, 100% 0%, 90% 5%, 80% 10%, 70% 15%, 60% 20%, 30% 50%, 45% 35%, 35% 45%, 50% 30%, 20% 60%, 15% 70%, 10% 80%, 5% 90%, 0% 100%)',
                clipPath: 'polygon(0% 20%, 60% 5%, 100% 0%, 90% 5%, 80% 10%, 70% 15%, 60% 20%, 30% 50%, 45% 35%, 35% 45%, 50% 30%, 20% 60%, 15% 70%, 10% 80%, 5% 90%, 0% 100%)',
            }
            // || 30% 50%, 20% 60%, 10% 70%, 0% 100%)
        } : {
            "&::before": {
                content: "''",
                position: 'absolute',
                top: 0,
                left: '1px',
                // bgcolor: 'modern.modern_1.main',
                // bgcolor: mode === 'dark' ? 'modern.modern_2.second' : 'common.black',
                bgcolor: 'success.main',
                width: '10px',
                height: '15px',
                transform: 'translateX(-100%) rotateY(-180deg)',
                // clipPath: 'polygon(0% -3%, 100% 0%, 90% 5%, 80% 10%, 70% 15%, 60% 20%, 30% 50%, 45% 35%, 35% 45%, 50% 30%, 20% 60%, 15% 70%, 10% 80%, 5% 90%, 0% 100%)'
                clipPath: 'polygon(0% 20%, 60% 5%, 100% 0%, 90% 5%, 80% 10%, 70% 15%, 60% 20%, 30% 50%, 45% 35%, 35% 45%, 50% 30%, 20% 60%, 15% 70%, 10% 80%, 5% 90%, 0% 100%)'
            }
        } : {};
        return (
            <Box sx={{
                width: 'fit-content',
                height: 'fit-content',
                pr: theSameUser ? '5px' : '0',
                pl: !theSameUser && conversation?.chatInfo?.type === 'oneByOne' ? '10px' : '0',
            }}>
                <Box
                    ref={refCard}
                    key={item?._id}
                    id={`demo-positioned-button${item?._id}`}
                    aria-controls={open ? `demo-positioned-menu${item?._id}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    {...longPressEvent}
                    sx={{
                        width: '100%',
                        // bgcolor: !theSameUser ? 'modern.modern_1.main' : 'info.main',
                        // bgcolor: !theSameUser ? (mode === 'dark' ? 'modern.modern_2.second' : 'common.black') : 'info.main',
                        bgcolor: !theSameUser ? 'success.main' : 'info.main',
                        // padding: '10px 10px 5px 15px',
                        borderRadius: !theSameUser ? receiverBorder({}) : senderBorder({}),
                        display: 'flex',
                        flexDirection: 'column',
                        // gap: 1,
                        position: 'relative',
                        textTransform: 'none',
                        cursor: 'pointer',
                        // boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.2)',
                        // boxShadow: '0px 0px 7px 0px rgba(175, 175, 175, 0.4)',
                        ...chatPrev
                    }}
                >
                    <Box sx={{
                        m: 0.5,
                        borderRadius: !theSameUser ? receiverBorder({fourth: '7px', third: '5px', second: '3px', first: '2px'}) : senderBorder({fourth: '7px', third: '5px', second: '3px', first: '2px'}),
                        bgcolor: 'common.black',
                    }}>
                        {
                            index === 0 && conversation?.chatInfo?.type === 'group' && (
                                <Box sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    m: '5px 5px 0 5px',
                                    justifyContent: theSameUser ? 'end' : 'start',
                                    color: theSameUser ? "#f9f9f9" : 'cornflowerblue'
                                }}>
                                    {
                                        receiver?.name
                                    }
                                </Box>
                            )
                        }
                        <Box
                            ref={textRef}
                            sx={{
                                whiteSpace: 'break-spaces',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'common.white',
                                // color: !theSameUser ? 'common.white' : '#f1f1f1',
                                alignItems: !theSameUser ? 'start' : 'end',
                                width: '100%',
                                textAlign: 'start',
                                p: !theSameUser ? '3px 12px 0px 7px' : '3px 7px 0px 12px',
                                "& a": {
                                    // color: !theSameUser ? 'var(--color-accent-fg)' : '#fffb00 !important',
                                    textDecoration: 'underline'
                                },
                                "& div.wmde-markdown": {
                                    // color: !theSameUser ? 'common.white' : '#f1f1f1',
                                    color: 'common.white',
                                    fontSize: {xs: "15px", sm: '17px'},
                                }
                            }}
                        >
                            {/*{encryptedText}*/}
                            <MDEditor.Markdown
                                source={encryptedText}
                                style={{
                                    whiteSpace: 'break-spaces',
                                    padding: "5px 0",
                                    background: 'transparent',
                                }}
                            />
                            {/*<TextWithLinks text={encryptedText}/>*/}
                        </Box>
                        <Box sx={{
                            fontSize: '9px',
                            // color: 'info.contrastText',
                            display: 'flex',
                            width: '100%',
                            gap: 0.5,
                            alignItems: 'flex-start',
                            p: '0px 10px 3px 10px',
                            color: theSameUser ? '#d1d1d1' : '#9c9c9c',
                            justifyContent: 'end',
                            mt: '-3px'
                        }}>
                            {
                                item?.sender === user?._id && (
                                    <Box sx={{
                                        display: 'grid',
                                        placeItems: 'center',
                                        "& svg": {
                                            fontSize: '12px'
                                        }
                                    }}>
                                        {
                                            item?.isError && !item?.isSent && !item?.isDelivered ? <ErrorOutlined/>
                                                : item?.isSent && !item?.isDelivered ? <DoneOutlined/>
                                                    : item?.isSent && item?.isDelivered ? <DoneAllOutlined color={'disabled'}/>
                                                        : item?.isRead ? <DoneAllOutlined color={'info'}/>
                                                            : <DoneOutlined/>
                                        }
                                    </Box>
                                )
                            }
                            {
                                // diffInHour < 1 ?
                                //     dayjs(item?.createdAt).fromNow()
                                //     :
                                dayjs(item?.createdAt).format('HH:mm')
                            }
                        </Box>
                    </Box>
                </Box>
                {/*<Popover>*/}

                {/*</Popover>*/}
                <Menu
                    id={`demo-positioned-menu${item?._id}`}
                    aria-labelledby={`demo-positioned-button${item?._id}`}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: theSameUser ? 'left' : 'right'
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: theSameUser ? 'left' : 'right',
                    }}
                    sx={{
                        width: '180px',
                        "& div ul li": {
                            borderBottom: '1px solid silver'
                        },
                        "& div ul li:last-child": {
                            borderBottom: 'none'
                        }
                    }}
                >
                    {
                        [
                            {
                                icon: <ReplyOutlined sx={{transform: 'rotateY(180deg)'}}/>,
                                text: translate('buttons.reply'),
                                onClick: () => setReplyTo(item as IMessage)
                            },
                            {
                                icon: <ContentCopy/>,
                                text: translate('buttons.copy'),
                                onClick: copyText
                            }
                        ].map((item, index) => (
                            <MenuItem
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    height: '30px',
                                }}
                                onClick={() => {
                                    item?.onClick()
                                    handleClose()
                                }}
                            >
                                {item?.text}
                                {item?.icon}
                            </MenuItem>
                        ))
                    }
                </Menu>
            </Box>
        );
    }
;
export default MessagesCard

interface TextWithLinksProps {
    text: string;
}

const TextWithLinks: FC<TextWithLinksProps> = ({text}) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
        <p style={{
            padding: 0,
            margin: 0,
            // width: 'min-content',
            minWidth: '60px',
            whiteSpace: 'pre-wrap'
        }}>
            {parts.map((part, index) => (
                urlRegex.test(part) ? (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: 'underline',
                            color: 'silver'
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                ) : (
                    part
                )
            ))}
        </p>
    );
};