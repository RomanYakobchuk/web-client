import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {Box, Button, IconButton, SxProps} from "@mui/material";
import {useNotification, usePermissions, useTranslate} from "@refinedev/core";
import {
    Close,
    Delete,
    ExpandLess,
    ExpandMore,
    ReplyOutlined,
    SwipeLeftRounded, SwipeRightRounded,
    SwipeRounded
} from "@mui/icons-material";

import {IComment} from "@/interfaces/common";
import {useLeaveManagerCommentAs, useManagerEstablishment, useMobile, useUserInfo} from "@/hook";
import CommentAnswers from "./commentAnswers";
import CommentInput from "./comment-input";
import {axiosInstance} from "@/authProvider";
import SwipeComponent, {CountdownHandle} from "@/components/swipe/swipeComponent";
import {ShowTimeComponent} from "@/components/time";

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
    isAnswers?: boolean,
    isSwipe?: boolean,
    setNewComment?: Dispatch<SetStateAction<INewComment | null>>,
}

const CommentCard = ({
                         comment,
                         setComments,
                         style,
                         isShowAnswer = true,
                         isShowDelete = true,
                         setNewComment,
                         isShowReply = true,
                         isAnswers = false,
                         isSwipe = true
                     }: IProps) => {
    const {user} = useUserInfo();
    const {data: dataPermissions} = usePermissions();
    const {width, device} = useMobile();
    const translate = useTranslate();
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
                    setCurrentComment((prevState) => ({
                        ...prevState,
                        repliesLength: newCurrentComment?.parentReviewsLength
                    }))
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
        if (width <= 600 && device) {
            setIsLoadAnswers(true)
        } else {
            setIsLoadAnswers(prevState => !prevState)
        }
    }
    const handleCloseIsAnswer = () => {
        setIsAnswer(false)
        setParent({} as IComment)
    }

    const isAllowedDelete = isShowDelete && isCanDelete && location?.pathname !== '/profile';
    const isAllowedReply = isShowReply && location?.pathname !== '/profile';

    const swipeRef = useRef<CountdownHandle>(null);

    const handleCenter = () => {
        if (swipeRef.current) {
            swipeRef.current.currentHandleCenter();
        }
    }

    return (
        <SwipeComponent
            isSwipeLeft={isAllowedDelete}
            isSwipeRight={isAllowedReply && !isAnswers}
            rightItemWidth={70}
            ref={swipeRef}
            rightItem={
                isAllowedDelete && (
                    <Box sx={{
                        width: 'fit-content',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Button
                            onClick={handleDelete}
                            color={'error'}
                            variant={'contained'}
                            sx={{
                                p: 2,
                                display: 'flex',
                                width: '50px',
                                height: '50px',
                                minWidth: '40px',
                                borderRadius: '50%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 'auto 10px'
                            }}
                        >
                            <Delete sx={{color: '#fff'}}/>
                        </Button>
                    </Box>
                )
            }
            leftItemWidth={70}
            leftItem={
                isAllowedReply && (
                    <Box sx={{
                        width: 'fit-content',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                if (!isAnswer) {
                                    setIsAnswer(true)
                                    setParent(currentComment)
                                } else {
                                    handleCloseIsAnswer()
                                }
                                handleCenter();
                            }}
                            color={'info'}
                            variant={'contained'}
                            sx={{
                                p: 2,
                                display: 'flex',
                                width: '50px',
                                height: '50px',
                                boxShadow: 'unset',
                                minWidth: '40px',
                                borderRadius: '50%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 'auto 10px'
                            }}
                        >
                            <ReplyOutlined sx={{color: '#fff'}}/>
                        </Button>
                    </Box>
                )
            }
        >
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
                                    <ShowTimeComponent date={currentComment?.createdAt}/>
                                </Box>
                            </Box>
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'start',
                                justifyContent: 'end',
                                gap: 2
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    fontSize: '14px',
                                    whiteSpace: 'break-spaces',
                                    bgcolor: 'modern.modern_1.second',
                                    p: 1,
                                    borderRadius: '5px'
                                }}>
                                    {currentComment?.text}
                                </Box>
                                {
                                    isSwipe && (
                                        <Box sx={{
                                            width: 'fit-content'
                                        }}>
                                            {
                                                (isAllowedDelete && isAllowedReply)
                                                    ? <SwipeRounded/>
                                                    : (isAllowedDelete && !isAllowedReply)
                                                        ? <SwipeLeftRounded/>
                                                        : (!isAllowedDelete && isAllowedReply)
                                                            ? <SwipeRightRounded/> : ''
                                            }
                                        </Box>
                                    )
                                }
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
                        isAllowedReply && (isAnswers || (width > 900 || !device)) &&
                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                if (!isAnswer) {
                                    setIsAnswer(true)
                                    setParent(currentComment)
                                } else {
                                    handleCloseIsAnswer()
                                }
                            }}
                            color={'secondary'}
                        >
                            {translate('buttons.reply')}
                            <ReplyOutlined/>
                        </Button>
                    }
                    {
                        isAllowedDelete && (width > 900 || !device) &&
                        <Button
                            onClick={handleDelete}
                            color={'error'}
                        >
                            {translate('buttons.delete')}
                            <Delete/>
                        </Button>
                    }
                    {
                        location?.pathname !== '/profile' && currentComment?.repliesLength > 0 && isShowAnswer &&
                        <Button
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
                            border: '2px solid cornflowerblue',
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'column',
                            alignItems: 'end'
                        }}>
                            <IconButton
                                onClick={handleCloseIsAnswer}
                            >
                                <Close/>
                            </IconButton>
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
                <Box>
                    <CommentAnswers
                        isShowAnswers={isShowAnswer}
                        isLoadAnswers={isLoadAnswers}
                        setIsLoadAnswers={setIsLoadAnswers}
                        setComment={setCurrentComment}
                        comment={currentComment}
                        newComment={newCurrentComment}
                    />
                </Box>
            </Box>
        </SwipeComponent>
    );
};
export default CommentCard
