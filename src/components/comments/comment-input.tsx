import {Box, Button, CircularProgress, InputAdornment, TextField,} from "@mui/material";
import {SentimentSatisfiedAltSharp, SendOutlined} from "@mui/icons-material";
import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {useNotification} from "@refinedev/core";
import Picker, {EmojiStyle} from "emoji-picker-react";

import {ColorModeContext} from "@/contexts";
import {useLeaveManagerCommentAs, useMobile} from "@/hook";
import {IComment} from "@/interfaces/common";
import {axiosInstance} from "@/authProvider";
import {INewComment} from "./commentAnswers";
import {handleKeyDownBlockEnter} from "@/keys";


interface IProps {
    institutionId: string,
    setNewComment?: Dispatch<SetStateAction<INewComment | null>>,
    isAnswer?: boolean,
    setIsAnswer?: Dispatch<SetStateAction<boolean>>,
    parent?: IComment,
    setParent?: Dispatch<SetStateAction<IComment>>,
}

const CommentInput = ({institutionId, setNewComment, parent = {} as IComment, isAnswer = false, setParent, setIsAnswer}: IProps) => {
    const {mode} = useContext(ColorModeContext);

    const showPickerRef = useRef<HTMLDivElement | null>(null)

    const [value, setValue] = useState<string>('');
    const {open} = useNotification();
    const {device} = useMobile();

    const {managerRole, selectedInfo} = useLeaveManagerCommentAs();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerHideShow = (event: React.MouseEvent) => {
        if (event.target) {
            event.stopPropagation();
            if (showPickerRef.current && showPickerRef.current?.contains(event.target as Node)) {
                return;
            }
            setShowEmojiPicker(!showEmojiPicker);
        }
    }

    const handleEmojiClick = (_: any, emoji: any) => {
        setValue((prevValue: string) => prevValue + emoji.emoji)
    }

    const handleSendComment = async () => {
        if (value && value.length > 0) {
            try {
                setIsLoading(true)
                const data = await axiosInstance.post(`/comment/create`, {
                    institutionId,
                    text: value?.trim(),
                    refFieldCreate: managerRole,
                    createdBy: selectedInfo?._id,
                    parentId: isAnswer && parent?.parentId ? parent?.parentId : parent?._id ? parent?._id : null,
                });
                if (data?.data) {
                    if (setNewComment) {
                        setNewComment({
                            parentReviewsLength: data?.data?.parentReviewsLength,
                            comment: data?.data?.comment
                        });
                    }
                    open?.({
                        type: 'success',
                        message: data?.data?.message
                    })
                }
                setValue("")
                if (setParent && setIsAnswer) {
                    setIsAnswer(false)
                    setParent({} as IComment)
                }
                setIsLoading(false)
            } catch (e: any) {
                setIsLoading(false)
                open?.({
                    type: 'error',
                    message: e?.response?.data?.error
                })
            }
        }
    }

    useEffect(() => {
        function clickOutside(event: MouseEvent) {
            if (event.target && showEmojiPicker) {
                if (showPickerRef.current && !showPickerRef.current?.contains(event.target as Node)) {
                    setShowEmojiPicker(false)
                }
            }
        }

        document.addEventListener('click', clickOutside)

        return () => {
            document.removeEventListener('click', clickOutside)
        }
    }, [showPickerRef, showEmojiPicker]);

    return (
        <Box
            component="form"
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: {xs: 1, md: 2},
                alignItems: "end",
                flex: 1,
                order: device ? 2 : 1
            }}>
            {
                !device &&
                <Box sx={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex'
                }}>
                    <SentimentSatisfiedAltSharp sx={{
                        fontSize: '30px',
                        transition: '300ms linear',
                        cursor: 'pointer',
                        color: showEmojiPicker ? 'blue' : mode === "dark" ? '#fcfcfc' : '#000',
                        "&:hover": {
                            color: 'blue'
                        }
                    }} onClick={handleEmojiPickerHideShow}/>
                    {
                        showEmojiPicker &&
                        <Box
                            ref={showPickerRef}
                            sx={{
                                position: 'absolute',
                                "@media screen and (max-width: 1260px)":{
                                    bottom: '60px',
                                    left: '0',
                                    right: 'unset'
                                },
                                bottom: 'unset',
                                left: 'unset',
                                right:  "0",
                                zIndex: 2000
                            }}>
                            <Picker
                                emojiStyle={EmojiStyle.NATIVE}
                                onEmojiClick={(emoji, event) => handleEmojiClick(event, emoji)}
                            />
                        </Box>
                    }
                </Box>
            }
            <TextField
                placeholder="Type something here…"
                multiline
                fullWidth={true}
                variant={'standard'}
                value={value || ''}
                minRows={1}
                maxRows={10}
                inputProps={{
                    maxLength: 300,
                }}
                InputProps={{
                    endAdornment: <InputAdornment position={'start'}>{value?.length}/300</InputAdornment>
                }}
                color={'secondary'}
                onChange={(event) => {
                    setValue(event.target.value)
                }}
                onKeyDown={(event) => handleKeyDownBlockEnter(event, value)}
                sx={{
                    "& textarea": {
                        color: 'common.white',
                        "&::placeholder": {
                            color: 'common.white',
                        }
                    }
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flex: 1,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Button
                    onClick={handleSendComment}
                    sx={{
                        minWidth: '30px',
                        width: {xs: '36px', sm: '54px'},
                        height: {xs: '36px'},
                        borderRadius: {xs: '50%', sm: '7px'},
                        ml: 'auto',
                        "& span": {
                            width: '2em !important',
                            height: '2em !important',
                        },
                        p: isLoading ? '4px' : '6px 16px',
                        bgcolor: '#1e36e8',
                        "&:hover": {
                            bgcolor: "#4f5cc3"
                        }
                    }}
                    variant={"contained"}>
                    {
                        isLoading
                            ? <CircularProgress
                                sx={{
                                    width: {xs: '0.8em', sm: '1em'},
                                    height: {xs: '0.8em', sm: '1em'},
                                }}
                            />
                            : <SendOutlined sx={{color: '#fcfcfc'}}/>
                    }
                </Button>
            </Box>
        </Box>
    );
};
export default CommentInput
