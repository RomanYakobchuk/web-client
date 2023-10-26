import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Box, Button, SxProps} from "@mui/material";
import dayjs from "dayjs";
import {useNotification, usePermissions, useTranslate} from "@refinedev/core";
import {Delete, ExpandLess, ExpandMore, ReplyOutlined} from "@mui/icons-material";

import {IComment} from "../../../interfaces/common";
import {useLeaveManagerCommentAs, useManagerEstablishment, useMobile, useUserInfo} from "../../../hook";
import CommentAnswers from "./commentAnswers";
import {ColorModeContext} from "../../../contexts";
import CommentInput from "./comment-input";
import {axiosInstance} from "../../../authProvider";

type INewComment = {
    comment: IComment,
    parentReviewsLength: number
}

interface IProps {
    comment: IComment,
    setComments?: Dispatch<SetStateAction<IComment[]>>,
    style?: SxProps,
    isShowDelete?: boolean,
    isShowAnswer?: boolean,
    isShowReply?: boolean,
    setNewComment?: Dispatch<SetStateAction<INewComment | null>>,
    handleChooseCommentForShowAnswers?: (comment: IComment) => void
}

const CommentCard = ({comment, setComments, style, isShowAnswer = true, isShowDelete = true, setNewComment, isShowReply = true, handleChooseCommentForShowAnswers}: IProps) => {
    const {user} = useUserInfo();
    const {data: dataPermissions} = usePermissions();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {width} = useMobile();
    const {open} = useNotification();
    const {selectedInfo, managerRole} = useLeaveManagerCommentAs();
    const {managerEstablishment, getData} = useManagerEstablishment();

    const [isLoadAnswers, setIsLoadAnswers] = useState<boolean>(false);
    const [currentComment, setCurrentComment] = useState<IComment>(comment);
    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [parent, setParent] = useState<IComment>({} as IComment);
    const [newCurrentComment, setNewCurrentComment] = useState<INewComment | null>(null);

    const isCanDelete = comment?.createdBy?._id === selectedInfo?._id || comment?.createdBy?._id === user?._id || dataPermissions === 'admin' || dataPermissions === 'manager' && managerEstablishment?.some((item) => item?._id === comment?.createdBy?._id);

    useEffect(() => {
        if (dataPermissions === 'manager' && managerEstablishment?.length <= 0) {
            getData();
        }
    }, [dataPermissions, managerEstablishment?.length]);

    const handleDelete = async () => {
        try {
            const {data} = await axiosInstance.delete(`/comment/delete/${currentComment?._id}`, {
                data: {
                    createdBy: selectedInfo?._id,
                    refFieldCreate: managerRole
                }
            });

            open?.({
                type: 'success',
                message: data?.message,
                description: 'Deleting'
            })
            if (setComments) {
                setComments(prevState => (prevState?.filter((value) => value?._id !== currentComment?._id)))
            }
        } catch (e: any) {
            open?.({
                type: 'error',
                description: e?.response?.data?.error ?? e?.response?.data?.message,
                message: 'Error'
            })
        }
    };

    useEffect(() => {
        if (newCurrentComment?.parentReviewsLength) {
            if (newCurrentComment?.comment?.parentId) {
                if (newCurrentComment?.comment?.parentId === currentComment?._id) {
                    setCurrentComment((prevState) => ({...prevState, repliesLength: newCurrentComment?.parentReviewsLength}))
                }
            } else {
                if (setComments) {
                    setComments((prevState) => [newCurrentComment?.comment, ...prevState])
                }
            }
            setNewCurrentComment(null)
        }
    }, [newCurrentComment]);

    const getAnswers = () => {
        if (isLoadAnswers) {
            setIsLoadAnswers(false)
            if (width < 1000 && handleChooseCommentForShowAnswers) {
                handleChooseCommentForShowAnswers(currentComment)
            }
        } else {
            setIsLoadAnswers(true);
            if (width >= 1000 && handleChooseCommentForShowAnswers) {
                handleChooseCommentForShowAnswers(currentComment)
            }
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                color: 'common.white',
                minWidth: '250px',
                ...style
            }}
        >
            <Box sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'start',
                pb: '10px'
            }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    width: '100%',
                }}>
                    <Box sx={{
                        width: 'fit-content'
                    }}>
                        <img style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} src={currentComment?.createdBy?.avatar} alt={"avatar"}/>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: '100%'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}>
                            <Box sx={{
                                fontSize: '16px',
                                fontWeight: 500,
                                color: 'cornflowerblue'
                            }}>
                                {currentComment?.createdBy?.name}
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 0.5
                            }}>
                                <Box sx={{
                                    fontSize: '12px'
                                }}>
                                    {dayjs(currentComment?.createdAt).fromNow()}
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            fontSize: '14px',
                            whiteSpace: 'break-spaces'
                        }} color={"secondary"}>
                            {currentComment?.text}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    gap: 2,
                    "& button": {
                        textTransform: 'inherit',
                        fontSize: {xs: '12px', sm: '14px'},
                        fontWeight: 400,
                        display: 'flex',
                        gap: 1,
                        borderRadius: '0',
                        p: 0,
                        "& svg": {
                            fontSize: {xs: '20px', sm: '24px'}
                        }
                    }
                }}
            >
                {
                    isShowReply && location?.pathname !== '/profile' &&
                    <Button
                        onClick={(event) => {
                            event.stopPropagation();
                            if (!isAnswer) {
                                setIsAnswer(true)
                                setParent(currentComment)
                            } else {
                                setIsAnswer(false)
                                setParent({} as IComment)
                            }
                        }}
                        sx={{
                            borderBottom: `1px dashed ${mode === 'dark' ? '#fff' : '#000'}`
                        }}
                        color={'secondary'}
                    >
                        {translate('buttons.reply')}
                        <ReplyOutlined/>
                    </Button>
                }
                {
                    isShowDelete && isCanDelete && location?.pathname !== '/profile' &&
                    <Button
                        onClick={handleDelete}
                        sx={{
                            borderBottom: `1px dashed red`
                        }}
                        color={'error'}
                    >
                        {translate('buttons.delete')}
                        <Delete/>
                    </Button>
                }
                {
                    location?.pathname !== '/profile' && currentComment?.repliesLength > 0 && isShowAnswer &&
                    <Button
                        sx={{
                            borderBottom: `1px dashed ${mode === 'dark' ? '#fff' : '#000'}`
                        }}
                        onClick={getAnswers}
                        color={'secondary'}
                        endIcon={isLoadAnswers ? <ExpandLess/> : <ExpandMore/>}
                    >
                        <span
                            style={{textTransform: 'capitalize'}}>{translate(isLoadAnswers ? 'buttons.hide' : 'buttons.answer')} ({currentComment?.repliesLength})</span>
                    </Button>
                }
            </Box>
            {
                isShowReply && isAnswer && parent?._id && (
                    <Box sx={{
                        margin: '10px 0',
                        p: 1,
                        borderRadius: '7px',
                        border: '2px solid cornflowerblue'
                    }}>
                        <CommentInput
                            parent={parent}
                            isAnswer={isAnswer}
                            setIsAnswer={setIsAnswer}
                            setParent={setParent}
                            institutionId={currentComment?.establishmentId as string}
                            setNewComment={setNewComment ?? setNewCurrentComment}
                        />
                    </Box>
                )
            }
            {
                isShowAnswer && isLoadAnswers && width < 1000 && (
                    <Box>
                        {/*{*/}
                        {/*    !device && width < 600 &&*/}
                        {/*    <Box sx={{*/}
                        {/*        width: '100%',*/}
                        {/*        display: 'flex',*/}
                        {/*        justifyContent: 'end',*/}
                        {/*        p: 1*/}
                        {/*    }}>*/}
                        {/*        <IconButton*/}
                        {/*            onClick={() => setIsLoadAnswers(false)}*/}
                        {/*        >*/}
                        {/*            <Close/>*/}
                        {/*        </IconButton>*/}
                        {/*    </Box>*/}
                        {/*}*/}
                        <CommentAnswers
                            isLoadAnswers={isLoadAnswers}
                            setIsLoadAnswers={setIsLoadAnswers}
                            setComment={setCurrentComment}
                            comment={currentComment}
                            newComment={newCurrentComment}
                        />
                    </Box>
                )
            }
        </Box>
    );
};
export default CommentCard
