import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Box, Button, FormControl, TextField} from "@mui/material";
import {useInfiniteList, useTranslate} from "@refinedev/core";
import {useSearchParams} from "react-router-dom";
import {useDebounce} from "use-debounce";
import {Add} from "@mui/icons-material";

import {CreateChatBox} from "@/components/chats/create/createChatBox";
import MoreButton from "@/components/common/buttons/MoreButton";
import SwipeComponent from "@/components/swipe/swipeComponent";
import {IConversation} from "@/interfaces/common";
import {useMobile, useUserInfo} from "@/hook";
import Loading from "../../loading/loading";
import ListChatCard from "./list-chat-card";
import {scrollBarStyle} from "@/styles";
import {socket} from "@/socketClient";
import {useChats} from "@/indexedDB";

interface IProps {
    setCurrentChat: Dispatch<SetStateAction<IConversation | null>>,
    setOpenDrawer: Dispatch<SetStateAction<boolean>>
}

const ListChats = ({setCurrentChat, setOpenDrawer}: IProps) => {
    const {user} = useUserInfo();
    const translate = useTranslate();
    const {device} = useMobile();

    const [_, setSearchParams] = useSearchParams();
    const {chats: dbChats, addManyChats} = useChats();

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isOpenCreateNewChat, setIsOpenCreateNewChat] = useState<boolean>(false);
    const [chats, setChats] = useState<IConversation[]>(dbChats || [] as IConversation[]);
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
            pageSize: 50
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
    }, [socket]);

    useEffect(() => {
        (async () => {
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
                    await addManyChats(newChats)
                }
            }
        })()
    }, [updatedChat]);

    useEffect(() => {
        (async () => {
            if (data?.pages) {
                const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                    data: IConversation[],
                    total: number
                }) => page?.data ?? [])));
                // setChats(list);
                await addManyChats(list as IConversation[])
            }
        })();
    }, [data]);
    useEffect(() => {
        if (dbChats && dbChats?.length > 0) {
            setChats(dbChats);
        }
    }, [dbChats]);
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(isOpenCreateNewChat)
        }, 500);
        return () => {
            clearTimeout(timer)
        }
    }, [isOpenCreateNewChat]);

    const scrollBar = !device ? scrollBarStyle : {};

    const sortedChats = chats?.sort((a: IConversation, b: IConversation) => {
        const dateA = new Date(a?.lastMessage?.updatedAt as Date || a?.createdAt)?.getTime();
        const dateB = new Date(b?.lastMessage?.updatedAt as Date || b?.createdAt)?.getTime();

        return dateA >= dateB ? -1 : 1;
    });

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%',
            position: {lg: 'relative'}
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
                isLoading && chats?.length <= 0 ?
                    <Loading height={'200px'}/>
                    : isError ? <div>Error</div> :
                        <Box sx={{
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            height: 'fit-content',
                            "@media screen and (min-width: 1200px)": {
                                height: 'calc(100vh - 175px)',
                            },
                            ...scrollBar
                        }}>
                            <Box sx={{
                                position: {xs: 'fixed', lg: 'absolute'},
                                bottom: {xs: '20px', lg: '0'},
                                zIndex: 1,
                                right: {xs: '20px', lg: '0'},
                                height: 'fit-content',
                                width: 'fit-content',
                            }}>
                                <Button
                                    color={'info'}
                                    variant={'contained'}
                                    sx={{
                                        textTransform: 'inherit',
                                        fontSize: {xs: '16px', md: '18px'},
                                        display: 'flex',
                                        minWidth: '30px',
                                        alignItems: 'center',
                                        width: {xs: '48px', sm: '56px', md: '64px'},
                                        height: {xs: '48px', sm: '56px', md: '64px'},
                                        borderRadius: '50%',
                                        p: 0
                                    }}
                                    onClick={() => setIsOpenCreateNewChat(true)}
                                >
                                    <Add fontSize={'large'}/>
                                </Button>
                                <CreateChatBox setNewChat={setCurrentChat} isOpen={isOpenCreateNewChat}
                                               setIsOpen={setIsOpenCreateNewChat}/>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                            }}>
                                {
                                    sortedChats?.map((item: IConversation) => (
                                            <SwipeComponent
                                                uniqueKey={item?._id}
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
                                <MoreButton
                                    total={total}
                                    fetchNextPage={fetchNextPage}
                                    isFetchingNextPage={isFetchingNextPage}
                                    hasNextPage={hasNextPage && total !== dbChats?.length}
                                />
                            </Box>
                        </Box>
            }
        </Box>
    );
};
export default ListChats;