import {Dispatch, SetStateAction} from "react";
import {INotificationContext} from "@refinedev/core";

import {axiosInstance} from "@/authProvider";
import {IComment} from "@/interfaces/common";
import {IForDelete} from "@/components/common/lists/comments-list";
import {TSelectOption} from "@/contexts/CommentCreatorDataContext";

export type THandleSendData = {
    textComment: string,
    setTextComment: Dispatch<SetStateAction<string>>,
    setNewComment?: Dispatch<SetStateAction<{comment: IComment, parentReviewsLength: number}>>,
    open: INotificationContext['open'],
    establishmentId: string,
    managerRole: string,
    selectedInfo: TSelectOption,
    isAnswer?: boolean,
    setIsAnswer?: Dispatch<SetStateAction<boolean>>,
    parent?: IComment,
    setParent?: Dispatch<SetStateAction<IComment>>,
}

export type THandleDeleteData = IForDelete & {
    setComments?: Dispatch<SetStateAction<IComment[]>>,
    open: INotificationContext['open'],
}
const handleSend = async ({establishmentId, managerRole, setNewComment, textComment, setTextComment, open, isAnswer = false, selectedInfo, parent = {} as IComment, setParent, setIsAnswer}: THandleSendData) => {
    if (textComment && textComment.length > 0) {
        try {
            console.log(parent)
            const data = await axiosInstance.post(`/comment/all_comments`, {
                establishmentId,
                text: textComment?.trim(),
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
            setTextComment("")
            if (setParent && setIsAnswer) {
                setIsAnswer(false)
                setParent({} as IComment)
            }
        } catch (e: any) {
            open?.({
                type: 'error',
                message: e?.response?.data?.error
            })
        }
    }
}
const deleteComment = async ({id, refFieldCreate, createdBy, setComments, open}: THandleDeleteData) => {
    try {
        const {data} = await axiosInstance.delete(`/comment/all_comments/${id}`, {
            data: {
                createdBy: createdBy,
                refFieldCreate: refFieldCreate
            }
        });

        open?.({
            type: 'success',
            message: data?.message,
            description: 'Deleting'
        })
        if (setComments) {
            setComments(prevState => (prevState?.filter((value) => value?._id !== id)))
        }
    } catch (e: any) {
        open?.({
            type: 'error',
            description: e?.response?.data?.error ?? e?.response?.data?.message,
            message: 'Error'
        })
    }
};

export {
    handleSend,
    deleteComment
}