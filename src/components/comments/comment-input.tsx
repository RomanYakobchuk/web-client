import {Box, Button, CircularProgress, TextField,} from "@mui/material";
import {SendOutlined} from "@mui/icons-material";
import React, {Dispatch, SetStateAction, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";

import {useLeaveManagerCommentAs, useMobile} from "@/hook";
import {IComment} from "@/interfaces/common";
import {axiosInstance} from "@/authProvider";
import {INewComment} from "./commentAnswers";
import {handleKeyDownBlockEnter} from "@/keys";
import {EmojiPicker} from "@/components/picker/emojiPicker";


interface IProps {
    establishmentId: string,
    setNewComment?: Dispatch<SetStateAction<INewComment | null>>,
    isAnswer?: boolean,
    setIsAnswer?: Dispatch<SetStateAction<boolean>>,
    parent?: IComment | null,
    setParent?: Dispatch<SetStateAction<IComment | null>>,
    maxTextLength?: number,
    textButton?: string
}

const CommentInput = ({
                          establishmentId,
                          setNewComment,
                          parent = null,
                          isAnswer = false,
                          setParent,
                          setIsAnswer,
                          maxTextLength = 300,
                          textButton
                      }: IProps) => {
    const {device} = useMobile();
    const translate = useTranslate();
    const {open} = useNotification();
    const {managerRole, selectedInfo} = useLeaveManagerCommentAs();

    const [value, setValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleSendComment = async () => {
        if (value && value.length > 0) {
            try {
                setIsLoading(true)
                const parentId = isAnswer && parent?.parentId ? parent?.parentId : parent?._id ? parent?._id : null;
                const data = await axiosInstance.post(`/comment/create`, {
                    establishmentId: establishmentId,
                    text: value?.trim(),
                    refFieldCreate: managerRole,
                    createdBy: selectedInfo?._id,
                    parentId: parentId,
                    answerTo: isAnswer && parentId !== parent?._id ? parent?._id : null,
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
                    setParent(null)
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

    const bgColor = 'modern.modern_4.main';
    return (
        <Box
            component="form"
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                alignItems: "end",
                flex: 1,
                order: device ? 2 : 1
            }}>
            <Box sx={{
                borderRadius: '15px 15px 3px 3px',
                bgcolor: bgColor,
                p: 2,
                width: '100%',
                display: 'flex',
                gap: 1,
                flexDirection: 'column'
            }}>
                <TextField
                    placeholder="Type something here…"
                    multiline
                    fullWidth={true}
                    variant={'standard'}
                    value={value || ''}
                    minRows={3}
                    maxRows={10}
                    inputProps={{
                        maxLength: maxTextLength,
                    }}
                    color={'secondary'}
                    onChange={(event) => {
                        setValue(event.target.value)
                    }}
                    onKeyDown={(event) => handleKeyDownBlockEnter(event, value)}
                    sx={{
                        width: '100%',
                        "& textarea": {
                            color: 'common.white',
                            "&::placeholder": {
                                color: 'common.white',
                            }
                        }
                    }}
                />
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end',
                    color: 'common.white'
                }}>
                    {value?.length}/{maxTextLength}
                </Box>
            </Box>
            <Box sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'space-between',
                gap: 0.5
            }}>
                <Box sx={{
                    display: 'flex',
                    height: '60px',
                    width: '60px',
                    borderRadius: '3px 3px 3px 15px',
                    bgcolor: bgColor,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <EmojiPicker setValue={setValue}/>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        height: '60px',
                        borderRadius: '3px 3px 15px 3px',
                        bgcolor: bgColor,
                        alignItems: 'center',
                        width: 'calc(100% - 64px)',
                        p: 1,
                        justifyContent: value?.length > 0 ? 'space-between' : 'end'
                    }}
                >
                    {
                        value?.length > 0 && (
                            <Button
                                variant={'text'}
                                color={'error'}
                                sx={{
                                    textTransform: 'inherit'
                                }}
                                onClick={() => setValue('')}
                            >
                                {translate('buttons.clear')}
                            </Button>
                        )
                    }
                    <Button
                        onClick={handleSendComment}
                        sx={{
                            minWidth: '30px',
                            width: 'fit-content',
                            textTransform: 'inherit',
                            fontSize: {xs: '14px', lg: '16px'},
                            height: {xs: '36px'},
                            borderRadius: '7px',
                            bgcolor: '#1e36e8',
                            "&:hover": {
                                bgcolor: "#4f5cc3"
                            }
                        }}
                        variant={"contained"}
                        endIcon={
                            isLoading
                                ? <CircularProgress
                                    sx={{
                                        width: '28px !important',
                                        height: '28px !important',
                                    }}
                                />
                                : <SendOutlined sx={{color: '#fcfcfc'}}/>
                        }
                    >
                        {textButton || translate('home.show.comments.leave')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
export default CommentInput
