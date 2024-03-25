import React, {useEffect, useState} from "react";
import {Box, FormControl, InputAdornment, TextField} from "@mui/material";
import {useInfiniteList, useTranslate} from "@refinedev/core";
import {SearchRounded} from "@mui/icons-material";
import {useDebounce} from "use-debounce";

import {ChatTabs} from "@/components/chats/list/chat-tabs";
import MoreButton from "@/components/buttons/MoreButton";
import {IConversation} from "@/interfaces/common";
import {useMobile, useUserInfo} from "@/hook";
import ListChatCard from "./list-chat-card";
import {scrollBarStyle} from "@/styles";
import {useChats, useMessages} from "@/indexedDB";
import {CreateChatBtn} from "./createChatBtn";
import {socket} from "@/socketClient";
import {HeadSetupList} from "@/components/chats/list/headSetupList";
import {useParams} from "react-router-dom";
import {AnimatePresence, Reorder} from "framer-motion";
import {useStore} from "@/store";


const ListChats = () => {

        const {user} = useUserInfo();
        const translate = useTranslate();
        const {device} = useMobile();
        const {chatEditMode} = useStore();
        const {clearMessages} = useMessages();
        const {conversationId} = useParams();
        const {chats: dbChats, addManyChats, clearChats} = useChats();

        const [updatedChat, setUpdatedChat] = useState<IConversation | null>(null);

        const [currentTab, setCurrentTab] = useState<string>("");
        const [chats, setChats] = useState<IConversation[]>([] as IConversation[]);
        const [ids, setIds] = useState<string[]>(chats?.map((chat) => chat?._id));
        const [title, setTitle] = useState<string>('');
        const [debouncedSearchText] = useDebounce(title, 500);

        const resFromDb = async (tab: string) => {
            const c = await dbChats(tab);
            if (c) {
                setChats(c?.map((chat, index) => ({...chat, id: index})));
            }
        }
        useEffect(() => {
            if (chats) {
                setIds(chats?.map((chat) => chat?._id))
            }
        }, [chats]);
        useEffect(() => {
            resFromDb(currentTab);
        }, [currentTab]);
        const {
            data,
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
                {field: "dependItem", value: currentTab || "", operator: 'eq'},
                {field: 'title', value: debouncedSearchText, operator: 'contains'},
            ],
            pagination: {
                pageSize: 50
            }
        });

        useEffect(() => {
            if (data?.pages) {
                const res = async () => {
                    let list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                        data: IConversation[],
                        total: number
                    }) => page?.data ?? [])));
                    if (list?.length <= 0) {
                        await clearChats();
                        await clearMessages();
                    } else {
                        await addManyChats(list as IConversation[]);
                    }
                    await resFromDb(currentTab)
                }
                res();
            }
        }, [data?.pages, currentTab]);

        const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

        const scrollBar = !device ? scrollBarStyle : {};

        useEffect(() => {
            socket?.on("getLastMessage", (data: any) => {
                setUpdatedChat({
                    _id: data?.conversationId,
                    lastMessage: {
                        sender: data?.sender,
                        text: data?.text,
                        updatedAt: data?.updatedAt,
                        status: data?.status
                    },
                    updatedAt: data?.updatedAt
                } as IConversation)
            })
            return () => {
                socket.off('getLastMessage');
            };
        }, [socket]);

        useEffect(() => {
            if (updatedChat) {
                const update = async () => {
                    const newChats = chats?.map((chat) => {
                            if (chat?._id === updatedChat?._id) {
                                return {
                                    ...chat,
                                    ...updatedChat,
                                }
                            }
                            return chat;
                        }
                    )
                    if (newChats) {
                        await addManyChats(newChats);
                        setChats(newChats)
                    }
                    setUpdatedChat(null);
                }
                update();
            }
        }, [updatedChat]);
        const sortedChats = chats?.sort((a: IConversation, b: IConversation) => {
            const dateA = new Date(a?.lastMessage?.updatedAt as Date || a?.createdAt)?.getTime();
            const dateB = new Date(b?.lastMessage?.updatedAt as Date || b?.createdAt)?.getTime();

            return dateA >= dateB ? -1 : 1;
        });

        const handleDeleteChat = (chat: IConversation) => {
            setChats((prevState) => prevState?.filter((item) => item?._id !== chat?._id));
        }

        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                height: '100%',
                width: '100%',
                "@media screen and (min-width: 768px)": {
                    position: 'relative'
                },
            }}>
                <HeadSetupList/>
                <FormControl
                    fullWidth
                    sx={{
                        p: 1
                    }}
                >
                    <TextField
                        fullWidth
                        variant={"outlined"}
                        color={"secondary"}
                        disabled={chatEditMode}
                        sx={{
                            borderRadius: '12px',
                            bgcolor: 'modern.modern_4.main',
                            fontSize: {xs: '10px', sm: '16px'},
                            "> div": {
                                borderRadius: '30px',
                            },
                            "& div input": {
                                "&::placeholder": {
                                    color: 'common.white'
                                }
                                // pr: '30px'
                            },
                            "& fieldset": {
                                border: 'none !important'
                            },
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position={'start'}>
                                <SearchRounded
                                    sx={{
                                        color: 'common.white'
                                    }}
                                />
                            </InputAdornment>
                        }}
                        size="small"
                        placeholder={translate('buttons.search')}
                        value={title ? title : ""}
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}/>
                </FormControl>
                <ChatTabs
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                />
                {
                    chats?.length >= 0 &&
                    <Box sx={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        px: 1,
                        mt: '-10px',
                        WebkitOverflowScrolling: 'touch',
                        height: 'fit-content',
                        "@media screen and (min-width: 1200px)": {
                            height: '100%',
                            maxHeight: 'calc(100vh - 225px)',
                        },
                        ...scrollBar,
                        "& ul": {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                        }
                    }}>
                        <Reorder.Group
                            axis="y"
                            values={ids}
                            onReorder={setIds}
                            style={{
                                paddingLeft: 0
                            }}
                        >
                            <AnimatePresence
                                initial={false}
                            >
                                {
                                    ids?.length > 0 && ids?.map((newOrderChat, i) => {
                                            const item = chats?.find((chat) => chat?._id === newOrderChat);
                                            if (!item) {
                                                return;
                                            }
                                            return (
                                                <ListChatCard
                                                    index={i}
                                                    key={item?._id}
                                                    handleDeleteChat={handleDeleteChat}
                                                    conversation={item}
                                                    isSelectedChat={conversationId === item?._id}
                                                />
                                            )
                                        }
                                    )
                                }
                            </AnimatePresence>
                        </Reorder.Group>
                    </Box>
                }
                <MoreButton
                    total={total}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage && total !== dbChats?.length}
                />
                <CreateChatBtn/>
            </Box>
        )
            ;
    }
;
export default ListChats;