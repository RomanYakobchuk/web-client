import {useInfiniteList, usePermissions, useTranslate} from "@refinedev/core";
import {Box} from "@mui/material";
import React, {useEffect, useState} from "react";

import CommentInput from "../../comments/comment-input";
import {CommentsList, Loading} from "../../index";
import {IComment, PropertyProps} from "@/interfaces/common";
import ChooseManagerRole from "../../common/choose/chooseManagerRole";
import {useLeaveManagerCommentAs} from "@/hook";
import {IDataList} from "../../common/lists/comments-list";
import MoreButton from "../../common/buttons/MoreButton";
import {INewComment} from "../../comments/commentAnswers";

type IProps = {
    institution: PropertyProps,
}

const EstablishmentComments = ({institution}: IProps) => {
    const translate = useTranslate();
    const {data: permissionsData} = usePermissions();

    const {_id: institutionId} = institution;

    const {selectedInfo} = useLeaveManagerCommentAs();

    const [newComment, setNewComment] = useState<INewComment | null>(null);

    const [comments, setComments] = useState<IComment[]>([] as IComment[]);
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList<IComment>({
        resource: `comment/allByInstitutionId/${institutionId}`,
        pagination: {
            pageSize: 10
        },
    });
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: IDataList,
                total: number
            }) => page?.data?.items ?? [])));
            setComments(list);
        }
    }, [data]);

    useEffect(() => {
        if (newComment?.comment?._id) {
            setComments((prevState) => ([newComment?.comment, ...prevState]))
            setNewComment(null);
        }
    }, [newComment]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: 'column',
                gap: 2.5,
                flex: 1,
                position: 'relative',
                maxWidth: {xs: '93vw', md: '100%'},
                width: '100%',
            }}
        >
            <Box sx={{
                flex: 1,
                position: 'static',
                height: '100%',
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%',
                margin: '0 auto'
            }}>
                {
                    permissionsData === 'manager' && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Box sx={{
                                fontSize: {xs: '14px', md: '16px'},
                                "& span": {
                                    color: 'cornflowerblue',
                                    fontSize: {xs: '16px', md: '18px'},
                                    fontWeight: 500
                                },
                                color: 'common.white'
                            }}>
                                {translate('home.show.comments.leaveAs') + ' '}
                                <span>{selectedInfo?.title}</span>
                            </Box>
                            <ChooseManagerRole
                                currentEstablishment={institution?._id}
                            />
                        </Box>
                    )
                }
                <Box sx={{
                    // border: '2px solid cornflowerblue',

                    maxWidth: '800px'
                }}>
                    <CommentInput
                        setNewComment={setNewComment}
                        institutionId={institutionId}
                    />
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                width: '100%'
            }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: '800px',
                }}>

                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignItems: 'start',
                        justifyContent: 'start',
                    }}>
                        {
                            isLoading
                                ? <Loading height={'200px'}/>
                                : isError
                                    ? <Box>
                                        Something went wrong (((
                                    </Box>
                                    : comments?.length > 0 && (
                                        <CommentsList
                                            comments={comments}
                                            setComments={setComments}
                                        />
                                    )
                        }
                        <MoreButton
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            total={total}
                        />
                    </Box>

                </Box>
                {/*{*/}
                {/*    width > 1000 && commentForShowAnswers?._id && commentForShowAnswers?.repliesLength > 0 && (*/}
                {/*        <Box sx={{*/}
                {/*            minWidth: '350px',*/}
                {/*            maxWidth: 'calc(40% - 8px)',*/}
                {/*            p: 1,*/}
                {/*            bgcolor: 'modern.modern_1.second',*/}
                {/*            borderRadius: '10px',*/}
                {/*            ml: 2,*/}
                {/*            display: 'flex',*/}
                {/*            flexDirection: 'column',*/}
                {/*            gap: 2,*/}
                {/*            maxHeight: '80vh',*/}
                {/*            height: 'fit-content',*/}
                {/*            overflowX: 'hidden',*/}
                {/*            overflowY: 'auto',*/}
                {/*            position: 'sticky',*/}
                {/*            top: schema === 'schema_1' ? '100px' : '30px'*/}
                {/*        }}>*/}
                {/*            <Box sx={{*/}
                {/*                display: 'flex',*/}
                {/*                flexDirection: 'column',*/}
                {/*                alignItems: 'end',*/}
                {/*                gap: 2,*/}
                {/*                pb: '15px',*/}
                {/*                borderBottom: '1px solid siver'*/}
                {/*            }}>*/}
                {/*                <Button*/}
                {/*                    onClick={() => {*/}
                {/*                        setIsLoadCommentAnswers(false)*/}
                {/*                        setCommentForShowAnswers({} as IComment)*/}
                {/*                    }}*/}
                {/*                    variant={'outlined'}*/}
                {/*                    color={'error'}*/}
                {/*                    startIcon={<Close/>}*/}
                {/*                    sx={{*/}
                {/*                        minWidth: '40px',*/}
                {/*                        textTransform: 'inherit',*/}
                {/*                        display: 'flex',*/}
                {/*                        justifyContent: 'end',*/}
                {/*                        p: '3px 16px'*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    {translate('buttons.close')}*/}
                {/*                </Button>*/}
                {/*                <CommentCard*/}
                {/*                    isShowAnswer={false}*/}
                {/*                    isShowDelete={false}*/}
                {/*                    comment={commentForShowAnswers}*/}
                {/*                    setNewComment={setNewCommentFromShowComments}*/}
                {/*                />*/}
                {/*            </Box>*/}
                {/*            <CommentAnswers*/}
                {/*                newComment={newCommentFromShowComments}*/}
                {/*                comment={commentForShowAnswers}*/}
                {/*                setComment={setCommentForShowAnswers}*/}
                {/*                isLoadAnswers={isLoadCommentAnswers}*/}
                {/*                setIsLoadAnswers={setIsLoadCommentAnswers}*/}
                {/*            />*/}
                {/*        </Box>*/}
                {/*    )*/}
                {/*}*/}
            </Box>
        </Box>
    );
};
export default EstablishmentComments