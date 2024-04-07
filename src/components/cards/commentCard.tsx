import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {usePermissions, useTranslate} from "@refinedev/core";
import {Box, Button, Paper, SxProps} from "@mui/material";
import {
    ExpandLess,
    ExpandMore, QuestionAnswerRounded,
} from "@mui/icons-material";

import {ReplyCommentButton} from "@/components/comments/replyCommentButton";
import {CommentCardMenu} from "@/components/comments/commentCardMenu";
import NoAvatar from "../../../public/images/chats/noAvatar.png"
import CommentAnswers from "../comments/commentAnswers";
import {ShowTimeComponent} from "@/components/time";
import {useManagerEstablishment} from "@/hook";
import {IComment} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import parse from "html-react-parser";
import {formatText} from "@/utils";

export type INewComment = {
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
    elevation?: number
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
                         elevation = 2
                     }: IProps) => {
    const {data: dataPermissions} = usePermissions();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {managerEstablishment, getData} = useManagerEstablishment();

    const [isLoadAnswers, setIsLoadAnswers] = useState<boolean>(false);
    const [currentComment, setCurrentComment] = useState<IComment>(comment);
    const [newCurrentComment, setNewCurrentComment] = useState<INewComment | null>(null);

    useEffect(() => {
        if (dataPermissions === 'manager' && managerEstablishment?.length <= 0) {
            getData();
        }
    }, [dataPermissions, managerEstablishment?.length]);

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
        setIsLoadAnswers(prevState => !prevState)
    }

    const isAllowedReply = isShowReply && location?.pathname !== '/profile';

    const isAnswersShow = isLoadAnswers && isShowAnswer;

    const scrollToListItem = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: "center"});
            element.style.transition = '500ms linear';
            element.style.borderRadius = '10px';
            element.style.borderColor = 'cornflowerblue';
            element.style.backgroundColor = mode === 'light' ? 'white' : '#000';
            const timer = setTimeout(() => {
                element.style.borderColor = '';
                element.style.borderRadius = '';
                element.style.backgroundColor = '';
                element.style.transition = '';
            }, 2000);
            return () => {
                clearTimeout(timer);
            }
        }
    };
    return (
        <Box
            sx={{
                transition: '300ms linear',
                border: '1px solid',
                borderColor: isAnswersShow ? 'silver' : 'transparent',
                borderRadius: isAnswersShow ? "10px" : '0',
                overflow: isAnswersShow ? 'hidden' : 'unset'
            }}
        >
            <Paper
                id={currentComment?._id}
                elevation={elevation}
                sx={{
                    display: 'flex',
                    p: 1.5,
                    position: 'relative',
                    border: '3px solid',
                    borderColor: 'transparent',
                    borderRadius: isAnswersShow ? "10px 10px 0 0" : '10px',
                    bgcolor: isAnswers ? "transparent" : 'common.black',
                    flexDirection: 'column',
                    width: '100%',
                    color: 'common.white',
                    gap: 1,
                    ...style
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'start',
                }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'start'
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                width: '100%',
                                justifyContent: 'start',
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{
                                width: 'fit-content',
                                "& img": {
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }
                            }}>
                                <img src={currentComment?.createdBy?.avatar || NoAvatar} alt={"avatar"}/>
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
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    // gap: 1
                                }}>
                                    <Box sx={{
                                        // fontSize: '16px',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: currentComment?.createdBy?.name ? 'cornflowerblue' : 'silver'
                                    }}>
                                        {currentComment?.createdBy?.name || translate("chats.user.notFound")}
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 0.5
                                    }}>
                                        <ShowTimeComponent date={currentComment?.createdAt}/>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <CommentCardMenu
                                comment={currentComment}
                                setComments={setComments}
                                isShowDelete={isShowDelete}
                            />
                        </Box>
                    </Box>
                </Box>
                {
                    isAnswers && currentComment?.answerTo?.commentId && currentComment?.answerTo?.name && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    display: 'flex',
                                    gap: 0.5,
                                    alignItems: 'center',
                                    "& span:nth-of-type(1)": {
                                        textTransform: 'lowercase',
                                    }
                                }}
                            >
                                {translate('buttons.answer')}
                                <Box
                                    component="span"
                                >
                                    {translate('text.for')}:
                                </Box>
                            </Box>
                            <Box
                                onClick={() => scrollToListItem(currentComment?.answerTo?.commentId as string)}
                                sx={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'cornflowerblue'
                                }}
                            >
                                {currentComment?.answerTo?.name}
                            </Box>
                        </Box>
                    )
                }
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'end',
                    gap: 0.5
                }}>
                    <Box sx={{
                        width: '100%',
                        fontSize: '1rem',
                        whiteSpace: 'break-spaces',
                    }}>
                        {parse(formatText({text: currentComment?.text}))}
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems: 'center',
                        gap: 1,
                        "& > button": {
                            textTransform: 'inherit',
                            fontSize: {xs: '12px', sm: '14px'},
                            fontWeight: 400,
                            display: 'flex',
                            minWidth: '24px',
                            minHeight: '14px',
                            gap: 0.5,
                            "&:not(.deleteCommentBtn)": {
                                p: 0
                            }
                        }
                    }}
                >
                    {
                        isAllowedReply &&
                        <ReplyCommentButton
                            comment={currentComment}
                            isShowReply={isShowReply}
                            setNewCurrentComment={setNewCurrentComment}
                            setNewComment={setNewComment}
                        />
                    }
                    {
                        location?.pathname !== '/profile' && currentComment?.repliesLength > 0 && isShowAnswer &&
                        <Button
                            onClick={getAnswers}
                            color={'secondary'}
                            variant={'text'}
                            sx={{
                                gap: '2px !important',
                                "& span": {
                                    ml: 0
                                }
                            }}
                            endIcon={isLoadAnswers ? <ExpandLess/> : <ExpandMore/>}
                        >
                            <QuestionAnswerRounded fontSize={'medium'}/>
                            ({currentComment?.repliesLength})
                        </Button>
                    }

                </Box>
            </Paper>
            <Box sx={{
                display: isLoadAnswers ? 'block' : 'none',
                height: isLoadAnswers ? 'fit-content' : '0px',
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
    );
};
export default CommentCard;