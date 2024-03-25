import {Box} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";


import CommentCard from "../../cards/commentCard";
import {IComment} from "@/interfaces/common";
import {For} from "million/react";

interface IProps {
    comments: IComment[],
    setComments?: Dispatch<SetStateAction<IComment[]>>,
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

const CommentsList = ({comments, setComments}: IProps) => {

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
            <For each={comments}>
                {
                    (comment, index) => (
                        <CommentCard
                            key={comment?._id + index}
                            setComments={setComments}
                            comment={comment}
                        />
                    )
                }
            </For>
        </Box>
    );
};
export default CommentsList
