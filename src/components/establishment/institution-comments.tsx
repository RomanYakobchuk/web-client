import {useGetIdentity, useNotification} from "@refinedev/core";
import {Box, IconButton} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {Clear} from "@mui/icons-material";

import {ColorModeContext} from "../../contexts";
import {axiosInstance} from "../../authProvider";
import ReviewInput from "./utills/review-input";
import {useMobile} from "../../hook";
import {CommentsList} from "../index";
import {IComment, IGetIdentity, ProfileProps} from "../../interfaces/common";

interface IProps {
    institutionId: string,
}

const InstitutionComments = ({institutionId}: IProps) => {
    const {mode} = useContext(ColorModeContext);
    const {device} = useMobile();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const {open} = useNotification();

    const [parent, setParent] = useState<IComment>({} as IComment);
    const [isAnswer, setIsAnswer] = useState(false);
    const [newComment, setNewComment] = useState("");

    const handleSend = async () => {
        if (newComment && newComment.length > 0) {
            const data = await axiosInstance.post(`/comment/create`, {
                institutionId,
                text: newComment,
                parentId: parent?._id ?? '',
                isAnswer: isAnswer
            });
            if (data?.data) {
                open?.({
                    type: 'success',
                    message: data?.data?.message
                })
            }
            setNewComment("")
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: 'column',
                gap: 2.5,
                flex: 1,
                position: 'relative'
            }}
        >

            <CommentsList
                id={institutionId}
                type={'allByInstitutionId'}
                setParent={setParent}
                setIsAnswer={setIsAnswer}
                isAnswer={isAnswer}
                parent={parent}
                newComment={newComment ? {_id: Date.now().toString(), createdBy: user, createdAt: Date.now(), text: newComment} as IComment : {} as IComment}
            />
            <Box sx={{
                flex: 1,
                position: 'static',
                height: '100%',
                bottom: 0,
                order: device ? 2 : 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
                {
                    isAnswer && parent?._id &&
                    <Box sx={{
                        order: device ? 1 : 2,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'start'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                        }}>
                            <Box sx={{
                                height: '50px',
                                bgcolor: 'silver',
                                borderRadius: '10px',
                                width: '2px'
                            }}/>
                            <img style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} src={parent?.createdBy?.avatar} alt={"avatar"}/>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}>
                                <Box>
                                    {parent?.createdBy?.name}
                                </Box>
                                <Box sx={{
                                    fontSize: '14px',
                                    whiteSpace: 'break-spaces'
                                }} color={"secondary"}>
                                    {parent.text}
                                </Box>
                            </Box>
                        </Box>
                        <IconButton onClick={() => {
                            setIsAnswer(false)
                            setParent({} as IComment)
                        }}>
                            <Clear/>
                        </IconButton>
                    </Box>
                }
                <ReviewInput handleSend={handleSend} value={newComment} setValue={setNewComment}/>
            </Box>
        </Box>
    )
        ;
};
export default InstitutionComments
