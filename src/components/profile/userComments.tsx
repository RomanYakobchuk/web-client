import {Box, Typography} from "@mui/material";
import CommentCard from "../institution/utills/commentCard";
import React from "react";
import {IComment} from "../../interfaces/common";
import {useNavigate} from "react-router-dom";
import {useTranslate} from "@refinedev/core";

interface IProps {
    user_comments: IComment[]
}

const UserComments = ({user_comments}: IProps) => {

    const navigate = useNavigate();
    const translate = useTranslate();

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            {
                user_comments?.sort((a: any, b: any) => {
                    return a?.createdAt > b?.createdAt ? -1 : 1
                })?.map((comment: IComment, index: number) => (
                    <Box key={index}
                         sx={{
                             width: '100%',
                             display: 'grid',
                             gridTemplateColumns: '2fr 1fr',
                             gap: 1.5,
                             borderBottom: '1px solid silver',
                         }}
                    >
                        <CommentCard
                            comment={comment}
                            setIsAnswer={() => {
                            }}
                            setParent={() => {
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 1,
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/all_institutions/show/${comment?.institutionId?._id}`)}
                        >
                            <img
                                src={comment?.institutionId?.mainPhoto}
                                alt={comment?.institutionId?.title}
                                style={{
                                    width: '60px',
                                    height: '50px',
                                    borderRadius: '10px',
                                    objectFit: 'cover'
                                }}
                            />
                            <Box>
                                <Typography fontSize={'16px'}>
                                    {comment?.institutionId?.title}
                                </Typography>
                                <Typography fontSize={'14px'}>
                                    {translate(`home.sortByType.${comment?.institutionId?.type}`)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))
            }
        </Box>
    );
};
export default UserComments
