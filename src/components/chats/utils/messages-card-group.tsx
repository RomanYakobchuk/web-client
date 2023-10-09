import {Box, Menu, MenuItem} from "@mui/material";
import {ContentCopy, ReplyOutlined, DoneOutlined, DoneAllOutlined, ErrorOutlined} from "@mui/icons-material";
import {MouseEvent, useEffect, useRef, useState} from "react";
import {useGetIdentity, useTranslate} from "@refinedev/core";


import {IGetIdentity, IMessage, ProfileProps} from "../../../interfaces/common";
import dayjs from "dayjs";
import useLongPress from "../../../hook/useLongPress";
import {socket} from "../../../socketClient";

interface IProps {
    item: IMessage,
    receiver: ProfileProps,
    setReplyTo: (item: IMessage) => void,
    lengthGroup: number,
    index: number
}

const MessagesCardGroup = ({item: message, receiver, setReplyTo, lengthGroup, index}: IProps) => {

        const translate = useTranslate();
        const {data: identity} = useGetIdentity<IGetIdentity>();
        const user: ProfileProps = identity?.user as ProfileProps;

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

        const senderBorder = () => {
            if (lengthGroup === 1) {
                return `20px 0px 20px 20px`
            } else if ((lengthGroup === 2 && index === 0) || (lengthGroup >= 3 && index === 0)) {
                return `20px 0px 5px 15px`
            } else if ((lengthGroup === 2 && index === 1) || (lengthGroup >= 3 && index === (lengthGroup - 1))) {
                return `15px 5px 15px 20px`
            } else if (lengthGroup >= 3 && index !== 0 && index !== (lengthGroup - 1)) {
                return '15px 5px 5px 15px'
            }
        }
        const receiverBorder = () => {
            if (lengthGroup === 1) {
                return `0px 20px 20px 20px`
            } else if ((lengthGroup === 2 && index === 0) || (lengthGroup >= 3 && index === 0)) {
                return `0px 20px 15px 5px`
            } else if ((lengthGroup === 2 && index === 1) || (lengthGroup >= 3 && index === (lengthGroup - 1))) {
                return `5px 15px 20px 15px`
            } else if (lengthGroup >= 3 && index !== 0 && index !== (lengthGroup - 1)) {
                return '5px 15px 15px 5px'
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
        return (
            <>
                <Box
                    key={item?._id}
                    id={`demo-positioned-button${item?._id}`}
                    aria-controls={open ? `demo-positioned-menu${item?._id}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    {...longPressEvent}
                    sx={{
                        bgcolor: item?.sender === receiver?._id ? '#FF842B' : 'info.main',
                        padding: '10px',
                        borderRadius: item?.sender === receiver?._id ? receiverBorder : senderBorder,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        position: 'relative',
                        textTransform: 'none',
                    }}
                >
                    <Box
                        ref={textRef}
                        sx={{
                            whiteSpace: 'break-spaces',
                            fontSize: '14px',
                            color: item?.sender === receiver?._id ? '#2a2a2a' : '#D0E7FE',
                            textAlign: 'start',
                            width: '100%'
                        }}
                    >
                        {item?.text}
                    </Box>
                    <Box sx={{
                        fontSize: '10px',
                        color: 'info.contrastText',
                        display: 'flex',
                        width: '100%',
                        gap: 0.5,
                        alignItems: 'center',
                        justifyContent: item?.sender === receiver?._id ? 'end' : 'start'
                    }}>
                        {
                            diffInHour < 1 ?
                                dayjs(item?.createdAt).fromNow()
                                : dayjs(item?.createdAt).format('HH:mm')
                        }
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
                    </Box>
                </Box>
                <Menu
                    id={`demo-positioned-menu${item?._id}`}
                    aria-labelledby={`demo-positioned-button${item?._id}`}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: item?.sender === receiver?._id ? 'left' : 'right'
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: item?.sender === receiver?._id ? 'left' : 'right',
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
            </>
        );
    }
;
export default MessagesCardGroup
