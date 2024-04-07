import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useInfiniteList} from "@refinedev/core";
import {Box} from "@mui/material";
import {useParams} from "react-router-dom";

import {IComment} from "@/interfaces/common";
import CommentCard from "../cards/commentCard";
import {Loading} from "../index";
import {IDataList} from "../common/lists/comments-list";
import MoreButton from "@/components/buttons/MoreButton";

export type INewComment = {
    comment: IComment,
    parentReviewsLength: number
}
type TProps = {
    comment: IComment,
    setComment: Dispatch<SetStateAction<IComment>>,
    isLoadAnswers: boolean,
    setIsLoadAnswers: Dispatch<SetStateAction<boolean>>,
    newComment?: INewComment | null,
    isShowAnswers: boolean
}
const CommentAnswers = ({comment, setComment, isLoadAnswers, setIsLoadAnswers, newComment, isShowAnswers}: TProps) => {

    const [newAnswer, setNewAnswer] = useState<INewComment | null>(null);
    const [currentComment, setCurrentComment] = useState<IComment>(comment);

    useEffect(() => {
        if (comment?._id) {
            setCurrentComment(comment)
        }
    }, [comment]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: 'start',
                justifyContent: 'start',
                width: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.03)',
            }}>
            {
                isShowAnswers && isLoadAnswers && (
                    <AnswersComponent
                        comment={comment}
                        setComment={setComment}
                        currentComment={currentComment}
                        newAnswer={newAnswer}
                        newComment={newComment}
                        setNewAnswer={setNewAnswer}
                    />
                )
            }
        </Box>
    );
};

type TAnswersComment = {
    newComment?: INewComment | null,
    comment: IComment,
    setComment: Dispatch<SetStateAction<IComment>>,
    currentComment: IComment,
    newAnswer: INewComment | null,
    setNewAnswer: Dispatch<SetStateAction<INewComment | null>>
}
const AnswersComponent = ({
                              comment,
                              newComment,
                              setComment,
                              currentComment,
                              newAnswer,
                              setNewAnswer
                          }: TAnswersComment) => {

    const {id} = useParams();

    const [answers, setAnswers] = useState<IComment[]>([]);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList<IComment>({
        resource: `comment/allByEstablishmentId/${id as string}`,
        pagination: {
            pageSize: 10
        },
        filters: [
            {
                value: comment?._id,
                field: 'parentId',
                operator: 'eq'
            }
        ]
    });
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    useEffect(() => {
        if (newAnswer?.comment?._id) {
            setComment((prevState) => ({...prevState, repliesLength: newAnswer?.parentReviewsLength}))
            setAnswers((prevState) => ([newAnswer?.comment, ...prevState]))
        }
    }, [newAnswer]);

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: IDataList,
                total: number
            }) => page?.data?.items ?? [])));
            setAnswers(list);
        }
    }, [data]);


    useEffect(() => {
        if (newAnswer?.comment?._id && newAnswer?.comment?.parentId === currentComment?._id) {
            if (newAnswer?.parentReviewsLength) {
                setComment((prevState) => ({...prevState, repliesLength: newAnswer?.parentReviewsLength}))
            }
            setNewAnswer({} as INewComment);
        }
    }, [newAnswer, currentComment?._id]);

    useEffect(() => {
        if (newComment?.comment?._id && newComment?.comment?.parentId === currentComment?._id) {
            setAnswers((prevState) => [newComment?.comment, ...prevState])
        }
    }, [newComment]);


    if (isError) {
        return <div>Something went wrong (((</div>
    }
    return (
        <>
            <Box sx={{
                width: '100%',
            }}>
                <CommentAnswersList
                    answers={answers}
                    setAnswers={setAnswers}
                    setNewComment={setNewAnswer}
                    isLoading={isLoading}
                />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center'
                }}
            >
                <MoreButton
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    total={total}
                />
            </Box>
        </>
    )
}
type TCommentAnswerList = {
    answers: IComment[],
    setAnswers: Dispatch<SetStateAction<IComment[]>>,
    setNewComment: Dispatch<SetStateAction<INewComment | null>>,
    isLoading: boolean
}
const CommentAnswersList = ({answers, setAnswers, setNewComment, isLoading}: TCommentAnswerList) => {
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            // gap: 2,
        }}>
            {
                isLoading ? <Loading height={'200px'}/> :
                    answers?.length > 0 &&
                    answers?.map((answer, index) => (
                        <Box
                            key={answer?._id + index}
                            sx={{
                                borderBottom: '1px solid silver',
                                pl: 3
                            }}
                        >
                            <CommentCard
                                elevation={0}
                                setNewComment={setNewComment}
                                comment={answer}
                                isAnswers={true}
                                // isShowAnswer={false}
                                // isShowReply={false}
                                setComments={setAnswers}
                            />
                        </Box>
                    ))
            }
        </Box>
    );
};
export default CommentAnswers;
