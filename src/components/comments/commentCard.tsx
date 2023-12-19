import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {Box, Button, SxProps} from "@mui/material";
import {useNotification, usePermissions, useTranslate} from "@refinedev/core";
import {
    Delete,
    ExpandLess,
    ExpandMore,
    ReplyOutlined,
    SwipeLeftRounded, SwipeRightRounded,
    SwipeRounded
} from "@mui/icons-material";
import ReactDOM from "react-dom";
import {MouseEvent} from "react";

import {IComment, ProfileProps} from "@/interfaces/common";
import {useLeaveManagerCommentAs, useManagerEstablishment, useMobile, useUserInfo} from "@/hook";
import CommentAnswers from "./commentAnswers";
import CommentInput from "./comment-input";
import {axiosInstance} from "@/authProvider";
import SwipeComponent, {CountdownHandle} from "@/components/swipe/swipeComponent";
import {ShowTimeComponent} from "@/components/time";
import {ColorModeContext} from "@/contexts";

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
    const [isVisibleInput, setIsVisibleInput] = useState<boolean>(false);
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisibleInput(isAnswer)
        }, 500);
        return () => {
            clearTimeout(timer)
        }
    }, [isAnswer]);

    return (
        <SwipeComponent
            uniqueKey={comment?._id}
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
                            width: 'calc(100% - 58px)'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                gap: 1
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
                                gap: 0.5
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    fontSize: '14px',
                                    whiteSpace: 'break-spaces',
                                    // bgcolor: 'modern.modern_1.second',
                                    // p: 1,
                                    // borderRadius: '5px'
                                }}>
                                    {currentComment?.text}
                                </Box>
                                {
                                    isSwipe && (
                                        <Box sx={{
                                            width: 'fit-content',
                                            "& svg": {
                                                fontSize: '20px',
                                                color: 'silver'
                                            }
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
                    isShowReply && isVisibleInput && (
                        <ShowCommentInput
                            parent={parent}
                            currentComment={currentComment}
                            handleCloseIsAnswer={handleCloseIsAnswer}
                            setNewCurrentComment={setNewCurrentComment}
                            isAnswer={isAnswer}
                            setIsAnswer={setIsAnswer}
                            setParent={setParent}
                            setNewComment={setNewComment}
                        />
                    )
                }
                <Box sx={{
                    display: isLoadAnswers ? 'block' : 'none'
                }}>
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
export default CommentCard;

type TShowCommentInput = {
    handleCloseIsAnswer: () => void,
    isAnswer: boolean,
    setIsAnswer: Dispatch<SetStateAction<boolean>>,
    setParent: Dispatch<SetStateAction<IComment>>,
    parent: IComment,
    currentComment: IComment,
    setNewCurrentComment: Dispatch<SetStateAction<INewComment | null>>,
    setNewComment?: Dispatch<SetStateAction<INewComment | null>>,
}
export const ShowCommentInput = ({
                                     handleCloseIsAnswer,
                                     setIsAnswer,
                                     isAnswer,
                                     setParent,
                                     currentComment,
                                     setNewCurrentComment,
                                     setNewComment,
                                     parent
                                 }: TShowCommentInput) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const [scale, setScale] = useState<number>(0);

    const createdBy = parent?.createdBy as ProfileProps;

    useEffect(() => {
        setScale(isAnswer ? 1 : 0);
    }, [isAnswer]);
    const handleClose = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
    }

    return ReactDOM.createPortal(
        <Box sx={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: 2000,
            inset: 0,
            bgcolor: mode === 'dark' ? 'rgba(100, 100, 100, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            transform: `scale(${scale})`,
            transition: 'all 0.3s linear'
        }}
             onClick={() => setIsAnswer(false)}
        >
            <Box sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                zIndex: 1200,
                transform: `translate(-50%, -50%)`,
                width: '100%',
                p: 2,
                maxWidth: '550px',
            }}
                 onClick={handleClose}
            >
                <Box>
                    <Box sx={{
                        margin: '10px 0',
                        // p: 1,
                        // borderRadius: '7px',
                        // border: '2px solid cornflowerblue',
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        alignItems: 'end',
                        gap: 1
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                            p: 1,
                            bgcolor: 'modern.modern_1.main',
                            borderRadius: '15px',
                            border: `2px solid ${mode === 'dark' ? '#d3e930' : 'cornflowerblue'}`
                        }}>
                            {
                                parent?._id && (
                                    <Box>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            gap: 1,
                                            fontSize: {xs: '16px', md: '18px'},
                                            fontWeight: 600
                                        }}>
                                            <Box>
                                                {translate('buttons.reply')}:
                                            </Box>
                                            <Box sx={{
                                                color: 'cornflowerblue'
                                            }}>
                                                {createdBy?.name}
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            fontSize: '14px'
                                        }}>
                                            {parent?.text?.substring(0, 40)}
                                        </Box>
                                    </Box>
                                )
                            }
                            <Button
                                variant={'text'}
                                // color={'error'}
                                sx={{
                                    textTransform: 'inherit',
                                    color: 'secondary.main'
                                }}
                                onClick={handleCloseIsAnswer}
                            >
                                {translate('buttons.close')}
                                {/*<Close/>*/}
                            </Button>
                        </Box>
                        <CommentInput
                            parent={parent}
                            isAnswer={isAnswer}
                            setIsAnswer={setIsAnswer}
                            setParent={setParent}
                            institutionId={currentComment?.establishmentId as string}
                            setNewComment={setNewComment || setNewCurrentComment}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>, document.body
    );
};


