import {useGetIdentity, useInfiniteList, useTranslate} from "@refinedev/core";
import {Box, Button, FormControl, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";

import {IConversation, IGetIdentity, ProfileProps} from "@/interfaces/common";
import Loading from "../../loading/loading";
import ListChatCard from "../utils/list-chat-card";
import {socket} from "@/socketClient";
import {useSearchParams} from "react-router-dom";
import * as console from "console";
import SwipeComponent from "@/components/swipe/swipeComponent";

interface IProps {
    setCurrentChat: (obj: IConversation) => void,
    setOpenDrawer?: any
}


const ListChats = ({setCurrentChat, setOpenDrawer}: IProps) => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();

    const [_, setSearchParams] = useSearchParams();

    const [chats, setChats] = useState<IConversation[]>([] as IConversation[]);
    const [title, setTitle] = useState<string>('');
    const [debouncedSearchText] = useDebounce(title, 500);
    const [updatedChat, setUpdatedChat] = useState<IConversation>({} as IConversation)
    const [institutionId, setInstitutionId] = useState<string>('');

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteList<IConversation>({
        resource: `conversation/findChat/${user?._id}`,
        queryOptions: {
            retry: false,
        },
        filters: [
            {field: 'userId', value: user?._id, operator: 'eq'},
            {field: 'institutionId', value: institutionId, operator: 'eq'},
            {field: 'title', value: debouncedSearchText, operator: 'contains'},
        ],
        pagination: {
            pageSize: 20
        }
    });

    useEffect(() => {
        socket.on("getLastMessage", (data: any) => {
            setUpdatedChat((prevState) => {
                return {
                    ...prevState,
                    _id: data?.chatId,
                    lastMessage: {
                        sender: data?.sender,
                        text: data?.text,
                        updatedAt: data?.updatedAt
                    },
                    updatedAt: data?.updatedAt
                }
            })
        })
        return () => {
            socket.off('getLastMessage');
        };
    }, [data?.pages[0]?.data]);

    useEffect(() => {
        if (updatedChat) {
            const newChats = chats?.map((chat) => {
                    if (chat?._id === updatedChat?._id) {
                        return {
                            ...chat,
                            ...updatedChat
                        }
                    }
                    return chat;
                }
            )
            if (newChats) {
                setChats(newChats)
            }
        }
    }, [updatedChat]);

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: IConversation[],
                total: number
            }) => page?.data ?? [])));
            setChats(list);
        }
    }, [data]);
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

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
                isLoading ?
                    <Loading height={'200px'}/>
                    : isError ? <div>Error</div> :
                        <Box sx={{
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            height: 'fit-content',
                            "@media screen and (min-width: 1200px)": {
                                height: 'calc(100vh - 175px)',
                                pr: '10px'
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}>
                                {
                                    chats?.sort((a: IConversation, b: IConversation) => {
                                        const dateA = a?.lastMessage?.updatedAt as Date;
                                        // const dateA = a?.updatedAt as Date;
                                        const dateB = b?.lastMessage?.updatedAt as Date;
                                        // const dateB = b?.updatedAt as Date;

                                        return dateA > dateB ? -1 : 1;
                                    })?.map((item: IConversation) => (
                                            <SwipeComponent
                                                key={item?._id}
                                                isSwipeable={false}
                                                isSwipeRight={false}
                                                isSwipeLeft={false}
                                            >
                                                <Box
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        setCurrentChat(item)
                                                        setOpenDrawer(true)
                                                        setSearchParams({'conversationId': item?._id})
                                                    }}
                                                >
                                                    <ListChatCard
                                                        conversation={item}
                                                    />
                                                </Box>
                                            </SwipeComponent>
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
                        </Box>
            }
        </Box>
    );
};
export default ListChats;