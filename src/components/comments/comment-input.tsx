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
    parent?: IComment,
    setParent?: Dispatch<SetStateAction<IComment>>,
    maxTextLength?: number
}

const CommentInput = ({
                          establishmentId,
                          setNewComment,
                          parent = {} as IComment,
                          isAnswer = false,
                          setParent,
                          setIsAnswer,
                          maxTextLength = 300
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
                const data = await axiosInstance.post(`/comment/create`, {
                    establishmentId: establishmentId,
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

    const bgColor = 'modern.modern_2.main';
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
                // borderRadius: '3px 3px 15px 15px',
                // bgcolor: 'common.black',
                // p: 2,
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
                        width: 'calc(100% - 60px)',
                        justifyContent: value?.length > 0 ? 'space-evenly' : 'center'
                        // pt: 1,
                        // borderTop: '1px solid',
                        // borderColor: 'divider',
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
                            // width: {xs: '36px', sm: '54px'},
                            width: 'fit-content',
                            textTransform: 'inherit',
                            fontSize: {xs: '14px', lg: '16px'},
                            height: {xs: '36px'},
                            // borderRadius: {xs: '50%', sm: '7px'},
                            borderRadius: '7px',
                            // ml: 'auto',
                            // "& span": {
                            //     width: '2em !important',
                            //     height: '2em !important',
                            // },
                            // p: isLoading ? '4px' : '6px 16px',
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
                                        width: {xs: '0.8em', sm: '1em'},
                                        height: {xs: '0.8em', sm: '1em'},
                                    }}
                                />
                                : <SendOutlined sx={{color: '#fcfcfc'}}/>
                        }
                    >
                        {translate('home.show.comments.leave')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
export default CommentInput
