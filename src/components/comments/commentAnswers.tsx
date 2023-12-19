import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useInfiniteList, usePermissions, useTranslate} from "@refinedev/core";
import {Box} from "@mui/material";
import {useParams} from "react-router-dom";

import {IComment} from "@/interfaces/common";
import CommentCard from "./commentCard";
import {CustomDrawer, Loading} from "../index";
import {useMobile} from "@/hook";
import ChooseManagerRole from "../common/choose/chooseManagerRole";
import {IDataList} from "../common/lists/comments-list";
import MoreButton from "@/components/common/buttons/MoreButton";

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

    const translate = useTranslate();
    const {data: dataPermission} = usePermissions();
    const {device, width} = useMobile();

    const [newAnswer, setNewAnswer] = useState<INewComment | null>(null);
    const [currentComment, setCurrentComment] = useState<IComment>(comment);

    useEffect(() => {
        if (comment?._id) {
            setCurrentComment(comment)
        }
    }, [comment]);


    const anchor = width < 600 && device ? 'bottom' : 'right';

    return (
        <Box>
            {
                !device &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignItems: 'start',
                        justifyContent: 'start',
                        width: '100%',
                        p: '16px 0px 0px 16px'
                        // "& < div": {
                        //     width: '100%',
                        //     maxWidth: {xs: '100%', lg: '40%'}
                        // },
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
            }
            {
                device && width <= 600 &&
                <CustomDrawer
                    anchor={anchor}
                    open={isLoadAnswers}
                    maxWidth={'600px'}
                    bgColor={'common.black'}
                    contentStyle={{
                        mt: '20px',
                        mb: '20px'
                    }}
                    toggleDrawer={setIsLoadAnswers}
                    title={
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            gap: dataPermission === 'manager' ? 3 : 0
                        }}>
                            <Box sx={{
                                fontSize: {xs: '18px', md: '22px'},
                                fontWeight: 500
                            }}>
                                {translate('buttons.answer')}
                            </Box>
                            {
                                dataPermission === 'manager' && (
                                    <ChooseManagerRole
                                        currentEstablishment={currentComment?.establishmentId as string}
                                    />
                                )
                            }
                        </Box>
                    }
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'start',
                            mb: '20px'
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            p: '10px',
                            borderBottom: '2px solid silver',
                            overflow: 'hidden'
                        }}>
                            <CommentCard
                                isAnswers={true}
                                comment={currentComment}
                                isShowAnswer={false}
                                isShowDelete={false}
                                isSwipe={false}
                                setNewComment={setNewAnswer}
                            />
                        </Box>
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
                </CustomDrawer>
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
const AnswersComponent = ({comment, newComment, setComment, currentComment, newAnswer, setNewAnswer}: TAnswersComment) => {

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
        resource: `comment/allByInstitutionId/${id as string}`,
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
                pl: '20px'
            }}>
                <CommentAnswersList
                    answers={answers}
                    setAnswers={setAnswers}
                    setNewComment={setNewAnswer}
                    isLoading={isLoading}
                />
            </Box>
            <MoreButton
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                total={total}
            />
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
            gap: {xs: 1, md: 2},
        }}>
            {
                isLoading ? <Loading height={'200px'}/> :
                    answers?.length > 0 &&
                    answers?.map((answer, index) => (
                        <Box
                            key={answer?._id + index}
                            sx={{
                                position: 'relative',
                                // "&:not(:last-child)::after": {
                                //     position: 'absolute',
                                //     content: "''",
                                //     width: '100%',
                                //     height: '1px',
                                //     bgcolor: 'silver',
                                //     bottom: 0,
                                // }
                            }}
                        >
                            <CommentCard
                                style={{
                                    p: 1,
                                    bgcolor: 'common.black',
                                    borderRadius: '10px',
                                }}
                                setNewComment={setNewComment}
                                comment={answer}
                                isShowAnswer={false}
                                isShowReply={false}
                                setComments={setAnswers}
                            />
                        </Box>
                    ))
            }
        </Box>
    );
};
export default CommentAnswers;
