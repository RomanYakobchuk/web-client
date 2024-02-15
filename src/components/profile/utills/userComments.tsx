import {Box, Button} from "@mui/material";
import CommentCard from "../../comments/commentCard";
import React, {useEffect, useState} from "react";
import {IComment} from "@/interfaces/common";
import {useNavigate} from "react-router-dom";
import {useInfiniteList, usePermissions, useTranslate} from "@refinedev/core";
import {Loading} from "@/components";
import MoreButton from "@/components/common/buttons/MoreButton";
import {useLeaveManagerCommentAs, useUserInfo} from "@/hook";
import ChooseManagerRole from "@/components/common/choose/chooseManagerRole";
import {ESTABLISHMENT, SHOW} from "@/config/names";

interface IProps {
    id: string,
}

type TRefFiled = "establishment" | "user";
const UserComments = ({id}: IProps) => {

    const navigate = useNavigate();
    const {user} = useUserInfo();
    const {data: role} = usePermissions();
    const translate = useTranslate();
    const {managerRole, selectedInfo} = useLeaveManagerCommentAs();

    const [_id, set_id] = useState<string>(role === 'manager' ? selectedInfo?._id : id);
    const [refFieldCreate, setRefFieldCreate] = useState<TRefFiled>(managerRole)

    const [comments, setComments] = useState<IComment[]>([] as IComment[]);
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList({
        resource: `comment/allByUserId/${_id}`,
        pagination: {
            pageSize: 10
        },
        filters: [
            {
                field: 'refFieldCreate',
                value: refFieldCreate,
                operator: 'eq'
            }
        ]
    });

    useEffect(() => {
        if (role === 'manager' && managerRole && selectedInfo?._id) {
            setRefFieldCreate(managerRole);
            set_id(selectedInfo?._id)
        } else if (role === 'admin') {
            set_id(id)
        } else {
            set_id(id)
        }
    }, [managerRole, selectedInfo?._id, role, id, user?._id]);
    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: {
                    items: IComment[],
                    count: number,
                    currentSize: 0
                },
                total: number
            }) => page?.data?.items ?? [])));
            setComments(list);
        }
    }, [data]);
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;


    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            {
                role === 'manager' && (
                    <Box>
                        <ChooseManagerRole currentEstablishment={selectedInfo?._id}/>
                    </Box>
                )
            }
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
                {
                    isLoading
                        ? <Loading height={'200px'}/>
                        : isError
                            ? <p>Something went wrong</p>
                            : comments?.length > 0 && comments?.map((comment, index) => (
                                <Box
                                    key={comment?._id + index}
                                    sx={{
                                        bgcolor: 'modern.modern_1.second',
                                        borderRadius: '10px',
                                        p: 1
                                    }}
                                >
                                    <CommentCard
                                        isShowAnswer={false}
                                        isShowReply={false}
                                        isShowDelete={false}
                                        comment={comment}
                                    />
                                    <Button
                                        variant={'text'}
                                        color={'info'}
                                        sx={{
                                            textTransform: 'inherit'
                                        }}
                                        onClick={() => navigate(`/${ESTABLISHMENT}/${SHOW}/${comment?.establishmentId}`)}
                                    >
                                        {translate('home.one')}
                                    </Button>
                                </Box>
                            )
                        )
                }
            </Box>
            <MoreButton
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                total={total}
            />
        </Box>
    );
};
export default UserComments
