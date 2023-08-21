import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, IconButton, Menu, MenuItem} from "@mui/material";
import dayjs from "dayjs";
import {Delete, MoreVertOutlined, ReplyOutlined} from "@mui/icons-material";
import {GetListResponse, useGetIdentity, useInfiniteList, useTranslate} from "@refinedev/core";
import {useLocation, useNavigate} from "react-router-dom";

import {axiosInstance} from "../../../authProvider";
import {IComment, IGetIdentity, ProfileProps} from "../../../interfaces/common";

interface IProps {
    comment: IComment,
    setParent: (item: IComment) => void,
    setIsAnswer: (value: boolean) => void,
}

const CommentCard = ({comment, setParent, setIsAnswer}: IProps) => {

    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const location = useLocation();
    const translate = useTranslate();
    const navigate = useNavigate();

    const [loadAnswer, setLoadAnswer] = useState(false);
    const [answers, setAnswers] = useState<IComment[]>([] as IComment[]);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteList({
        resource: `comment/allAnsweredCommentById/${comment?._id}`,
        pagination: {
            pageSize: 10
        },
        queryOptions: {
            enabled: loadAnswer
        }
    });

    const loadMore = () => {
        setLoadAnswer(!loadAnswer)
    }


    useEffect(() => {
        if (data?.pages) {
            const list: IComment[] = [].concat(...((data?.pages as any ?? [])?.map((page: GetListResponse<IComment>) => page?.data)));
            setAnswers(list)
        }
    }, [data, loadAnswer])
    const deleteComment = async (id: string, isAnswer: boolean) => {
        await axiosInstance.delete(`/comment/deleteComment/${id}`, {
            data: {
                isAnswer: isAnswer
            }
        });
        // setComments(comments.filter((item: any, i: any) => item?._id !== id));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            <Box sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'start',
                pb: '10px'
            }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                }}>
                    <img style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }} src={comment?.createdBy?.avatar} alt={"avatar"}/>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <Box>
                            {comment?.createdBy?.name}
                        </Box>
                        <Box sx={{
                            fontSize: '14px',
                            whiteSpace: 'break-spaces'
                        }} color={"secondary"}>
                            {comment.text}
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.5
                }}>
                    <Box sx={{
                        fontSize: '12px'
                    }}>
                        {dayjs(comment.createdAt).fromNow()}
                    </Box>
                </Box>
                {
                    comment?.institutionId?.title && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate(`/all_institutions/show/${comment?.institutionId?._id}`)}
                        >
                            <img
                                src={comment?.institutionId?.pictures[0].url}
                                alt={comment?.institutionId?.title}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '5px',
                                    objectFit: 'cover'
                                }}
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}>
                                <h3 style={{
                                    margin: 0
                                }}>
                                    {comment?.institutionId?.title}
                                </h3>
                                <h4 style={{
                                    margin: 0
                                }}>
                                    {comment?.institutionId?.type}
                                </h4>
                            </Box>
                        </Box>
                    )
                }
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    gap: 1
                }}
            >
                {
                    location?.pathname !== '/profile' &&
                    <IconButton
                        onClick={() => {
                            setIsAnswer(true)
                            setParent(comment)
                        }}
                        color={'success'}
                    >
                        <ReplyOutlined/>
                    </IconButton>
                }
                {
                    (user?._id === comment?.createdBy?._id || user?.status === "admin") && location?.pathname !== '/profile' &&
                    <IconButton
                        onClick={() => deleteComment(comment._id, false)}
                        color={'error'}
                    >
                        <Delete/>
                    </IconButton>
                }
            </Box>
            {
                location?.pathname !== '/profile' && comment?.replies?.length > 0 &&
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        gap: 1,
                        p: '10px',
                        mb: '10px',
                        pl: '50px',
                        maxHeight: '500px',
                        overflow: 'auto',
                        bgcolor: 'rgba(130,130,130,0.5)'
                    }}
                >
                    {
                        answers?.length < 1 ?
                            <Button
                                onClick={loadMore}
                            >
                                Load more
                            </Button> :
                            answers?.map((item) =>
                                <Box
                                    key={item?._id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        width: '100%',
                                        alignItems: 'start',
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        alignItems: 'start',
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                        }}>
                                            <img style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }} src={item?.createdBy?.avatar} alt={"avatar"}/>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}>
                                                <Box>
                                                    {item?.createdBy?.name}
                                                </Box>
                                                <Box sx={{
                                                    fontSize: '14px',
                                                    whiteSpace: 'break-spaces'
                                                }} color={"secondary"}>
                                                    {item.text}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 0.5
                                        }}>
                                            <Box sx={{
                                                fontSize: '12px'
                                            }}>
                                                {dayjs(item.createdAt).fromNow()}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'end',
                                            gap: 1
                                        }}
                                    >
                                        {
                                            (user?._id === item?.createdBy?._id || user?.status === "admin") && location?.pathname !== '/profile' &&
                                            <IconButton
                                                onClick={() => deleteComment(item._id, true)}
                                                color={'error'}
                                            >
                                                <Delete/>
                                            </IconButton>
                                        }
                                    </Box>
                                </Box>
                            )
                    }
                    {
                        hasNextPage && answers?.length > 0 && (
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
                    {
                        answers?.length > 0 && <Button
                            sx={{
                                width: '100%',

                            }}
                            variant={'text'}
                            color={'success'}
                            onClick={() => setAnswers([] as IComment[])}
                        >
                            Сховати
                        </Button>
                    }
                </Box>
            }
        </Box>
    );
};
export default CommentCard
