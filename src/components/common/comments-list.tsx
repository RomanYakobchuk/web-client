import {GetListResponse, useInfiniteList, useTranslate} from "@refinedev/core";
import {Box, Button, CircularProgress} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

import CommentCard from "../institution/utills/commentCard";
import {IComment} from "../../interfaces/common";
import {useMobile} from "../../utils";
import Loading from "../loading";
import {ColorModeContext} from "../../contexts";

interface IProps {
    id: string,
    type: string,
    setParent: (item: IComment) => void,
    setIsAnswer: (value: boolean) => void,
    newComment?: IComment,
    isAnswer?: boolean,
    parent?: IComment
}

const CommentsList = ({id, type, setParent, setIsAnswer, parent, isAnswer, newComment}: IProps) => {
    const {i18n} = useTranslation();
    const translate = useTranslate();
    const {device} = useMobile();
    const {mode} = useContext(ColorModeContext);

    const [comments, setComments] = useState<IComment[]>([] as IComment[]);

    const {
        data: dataComments,
        isLoading: isLoadingComments,
        isError: isErrorComments,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList<IComment>({
        resource: `comment/${type}/${id}`,
        pagination: {
            pageSize: 10
        },
    });

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language]);

    useEffect(() => {
        if (dataComments?.pages) {
            const list: IComment[] = [].concat(...((dataComments?.pages as any ?? [])?.map((page: GetListResponse<IComment>) => page?.data)));
            setComments(list);
        }
    }, [dataComments]);

    useEffect(() => {
        if (newComment?._id && !isAnswer && !parent?._id) {
            setComments(prevState => [newComment, ...prevState]);
        } else if (newComment?._id && isAnswer && parent?._id) {
            // for (const comment of comments) {
            //     if (comment?._id === parent?._id) {
            //         comment?.r
            //     }
            // }
        }
    }, [newComment])

    if (isLoadingComments) return device ? <Loading/> : <CircularProgress color={'secondary'}/>;
    if (isErrorComments) return <div>Error</div>;
    return (
        <Box sx={{
            flex: 8,
            height: '100%',
            borderRadius: '10px',
            overflowY: 'auto',
            m: 'auto',
            width: '100%',
            maxWidth: '550px',
            bgcolor: mode === 'light' ? '#e6e3e3' : "#1a4679",
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: '20px',
            order: device ? 1 : 2,
            maxHeight: {sm: '700px', lg: '1129px', xl: '854px'}
        }}>
            {
                comments?.map((comment) => (
                        <Box key={comment?._id}
                             sx={{
                                 width: '100%',
                                 borderBottom: '1px solid silver',
                             }}
                        >
                            <CommentCard
                                setIsAnswer={setIsAnswer}
                                setParent={setParent}
                                comment={comment}
                            />
                        </Box>
                    )
                )
            }
            {
                hasNextPage && (
                    <Button
                        variant={"outlined"}
                        color={'secondary'}
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {translate(isFetchingNextPage ? 'loading' : 'buttons.loadMore')}
                    </Button>
                )
            }
        </Box>
    );
};
export default CommentsList
