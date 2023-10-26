import {Box, Typography} from "@mui/material";
import CommentCard from "../../establishment/utills/commentCard";
import React from "react";
import {IComment} from "../../../interfaces/common";
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
                   <></>
                ))
            }
        </Box>
    );
};
export default UserComments
