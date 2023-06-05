import {GetListResponse, useGetIdentity, useInfiniteList, useTranslate} from "@refinedev/core";
import {Box, Button, CircularProgress, FormControl, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";

import {IConversation, ProfileProps} from "../../interfaces/common";
import Loading from "../loading";
import ListCardChat from "./utils/list-card-chat";
import {useDebounce} from "use-debounce";
import {socket} from "../../socketClient";

interface IProps {
    setCurrentChat: (obj: any) => void,
    setOpenDrawer?: any
}


const ListChats = ({setCurrentChat, setOpenDrawer}: IProps) => {
    const {data: user} = useGetIdentity<ProfileProps>();
    const translate = useTranslate();

    const [chats, setChats] = useState<any>();

    const [title, setTitle] = useState<string>('');
    const [debouncedSearchText] = useDebounce(title, 500);
    const [updatedChat, setUpdatedChat] = useState<IConversation>({} as IConversation)
    const [userId, setUserId] = useState<string>('');
    const [managerId, setManagerId] = useState<string>('');
    const [institutionId, setInstitutionId] = useState<string>('');

    const {
        data,
        isLoading,
        isFetching,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteList<IConversation>({
        resource: `conversation/findChat`,
        filters: [
            {field: 'userId', value: userId, operator: 'eq'},
            {field: 'managerId', value: managerId, operator: 'eq'},
            {field: 'institutionId', value: institutionId, operator: 'eq'},
            {field: 'title', value: debouncedSearchText, operator: 'contains'},
        ],
        pagination: {
            pageSize: 20
        }
    });

    useEffect(() => {
        if (data?.pages) {
            setChats(data as any)
        }
    }, [data]);

    useEffect(() => {
        if (user?.status === 'user') {
            setUserId(user?._id)
        } else if (user?.status === 'manager') {
            setManagerId(user?._id)
        }
    }, [user]);

    useEffect(() => {
        socket.on("getLastMessage", (data: any) => {
            setUpdatedChat((prevState) => {
                return {
                    ...prevState,
                    _id: data?.chatId,
                    lastMessage: {
                        sender: data?.sender,
                        text: data?.text
                    },
                }
            })
        })
        return () => {
            socket.off('getLastMessage');
        };
    }, [data?.pages[0]?.data]);

    useEffect(() => {
        if (updatedChat) {
            const newChats = chats?.pages?.map((page: GetListResponse<IConversation>) => {
                    const newPageData = page?.data?.map((chat: IConversation) => {
                        if (chat?._id === updatedChat?._id) {
                            return {
                                ...chat,
                                ...updatedChat
                            }
                        }
                        return chat;
                    })
                    return {...page, data: newPageData};
                }
            )
            if (newChats) {
                setChats({pages: newChats})
            }
        }
    }, [updatedChat])

    if (isLoading) return <Loading/>
    if (isError) return <div>Error</div>
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%'
        }}>
            <FormControl
                fullWidth
            >
                <TextField fullWidth variant={"outlined"} color={"secondary"}
                           sx={{
                               fontSize: {xs: '10px', sm: '16px'},
                               "> div": {
                                   borderRadius: '30px',
                               },
                               "& div input": {
                                   pr: '30px'
                               }
                           }}
                           size="small"
                           placeholder={'Search'}
                           value={title ? title : ""}
                           onChange={(e) => {
                               setTitle(e.target.value)
                           }}/>
            </FormControl>
            {
                isFetching ?
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <CircularProgress color={'secondary'}/>
                    </Box>
                    :
                    <Box sx={{
                        overflow: 'auto',
                        height: '75vh'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                        }}>
                            {
                                chats?.pages?.map((page: GetListResponse<IConversation>) =>
                                    page?.data?.map((item: IConversation) => (
                                        <ListCardChat
                                            key={item?._id}
                                            conversation={item}
                                            setOpenDrawer={setOpenDrawer}
                                            setCurrentChat={setCurrentChat}
                                        />
                                    ))
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
                    </Box>
            }
        </Box>
    );
};
export default ListChats
