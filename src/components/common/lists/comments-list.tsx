import {Box} from "@mui/material";
import React, {Dispatch, SetStateAction, useContext} from "react";


import CommentCard from "../../comments/commentCard";
import {IComment} from "@/interfaces/common";
import { ColorModeContext } from "@/contexts";

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
    const {mode} = useContext(ColorModeContext);

    return (
        <Box sx={{
            flex: 8,
            height: '100%',
            borderRadius: '10px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden'
        }}>
            {
                comments?.map((comment, index) => (
                        <Box key={comment?._id + index}
                             sx={{
                                 width: '100%',
                             }}
                        >
                            <CommentCard
                                style={{
                                    width: '100%',
                                    p: 1.5,
                                    borderRadius: '7px',
                                    bgcolor: mode === 'dark' ? '#53565b' : 'common.black',
                                }}
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
