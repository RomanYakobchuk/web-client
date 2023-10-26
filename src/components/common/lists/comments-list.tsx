import {Box} from "@mui/material";
import React, {Dispatch, SetStateAction, useEffect} from "react";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

import CommentCard from "../../establishment/utills/commentCard";
import {IComment} from "../../../interfaces/common";
import { useMobile } from "../../../hook";
interface IProps {
    comments: IComment[],
    setComments?: Dispatch<SetStateAction<IComment[]>>,
    setCommentForShowAnswers: Dispatch<SetStateAction<IComment>>
}

export interface IDataList {
    items: IComment[],
    currentSize: number,
    count: number
}

export type IForDelete = {
    id: string,
    refFieldCreate: "user" | "establishment",
    createdBy: string,
}

const CommentsList = ({comments, setComments, setCommentForShowAnswers}: IProps) => {
    const {i18n} = useTranslation();
    const {width} = useMobile();

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language]);


    const handleChooseCommentForShowAnswers = (comment: IComment) => {
        if (width > 1000 && comment?._id && comment?.repliesLength > 0) {
            setCommentForShowAnswers(comment)
        }
    }
    return (
        <Box sx={{
            flex: 8,
            height: '100%',
            borderRadius: '10px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            {
                comments?.map((comment, index) => (
                        <Box key={comment?._id + index}
                             sx={{
                                 width: '100%',
                                 p: 1.5,
                                 borderRadius: '7px',
                                 bgcolor: 'modern.modern_2.second',
                             }}
                        >
                            <CommentCard
                                handleChooseCommentForShowAnswers={handleChooseCommentForShowAnswers}
                                setComments={setComments}
                                comment={comment}
                            />
                        </Box>
                    )
                )
            }
        </Box>
    );
};
export default CommentsList
