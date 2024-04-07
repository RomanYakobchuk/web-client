import {ReplyRounded} from "@mui/icons-material";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button} from "@mui/material";

import ShowCommentInput from "@/components/comments/showCommentInput";
import {IComment} from "@/interfaces/common";
import {INewComment} from "@/components/cards/commentCard";


type TProps = {
    comment: IComment,
    setNewComment?: Dispatch<SetStateAction<INewComment | null>>,
    setNewCurrentComment: Dispatch<SetStateAction<INewComment | null>>,
    isShowReply?: boolean
}
export const ReplyCommentButton = ({comment, setNewCurrentComment, isShowReply = true, setNewComment}: TProps) => {

    const [isAnswer, setIsAnswer] = useState<boolean>(false);
    const [parent, setParent] = useState<IComment | null>(null);
    const [isVisibleInput, setIsVisibleInput] = useState<boolean>(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisibleInput(isAnswer)
        }, 500);
        return () => {
            clearTimeout(timer)
        }
    }, [isAnswer]);
    const handleCloseIsAnswer = () => {
        setIsAnswer(false)
        setParent(null)
    }
    return (
        <>
            <Button
                onClick={(event) => {
                    event.stopPropagation();
                    if (!isAnswer) {
                        setIsAnswer(true)
                        setParent(comment)
                    } else {
                        handleCloseIsAnswer()
                    }
                }}
                color={'secondary'}
                variant={'text'}
            >
                <ReplyRounded
                    fontSize={'medium'}
                />
            </Button>
            {
                isShowReply && isVisibleInput && (
                    <ShowCommentInput
                        parent={parent}
                        currentComment={comment}
                        handleCloseIsAnswer={handleCloseIsAnswer}
                        setNewCurrentComment={setNewCurrentComment}
                        isAnswer={isAnswer}
                        setIsAnswer={setIsAnswer}
                        setParent={setParent}
                        setNewComment={setNewComment}
                    />
                )
            }
        </>
    );
};

