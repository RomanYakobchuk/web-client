import {CurrentChatContainer, CustomDrawer} from "@/components";
import {Box, IconButton} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {useMobile, useUserInfo} from "@/hook";
import {IConversation, ProfileProps} from "@/interfaces/common";
import {usePermissions} from "@refinedev/core";
import {Close} from "@mui/icons-material";

type TProps = {
    openDrawer: boolean,
    setOpenDrawer: Dispatch<SetStateAction<boolean>>,
    currentChat: IConversation | null,
    setCurrentChat: Dispatch<SetStateAction<IConversation | null>>,
    closeChat: () => void
}
export const ChatBox = ({openDrawer, setOpenDrawer, currentChat, closeChat, setCurrentChat}: TProps) => {
    const {user} = useUserInfo();
    const {width} = useMobile();
    const {data: role} = usePermissions();

    const chatUserAllInfo = currentChat?.members?.find((obj) => {
        const u = obj?.user as ProfileProps;
        if (u._id === user?._id) {
            return obj;
        }
    });
    const header = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            flex: 2
        }}>
            {
                currentChat?._id ?
                    <>
                        <Box sx={{
                            width: '46px',
                            height: '46px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'common.white',
                            borderRadius: '50%',
                        }}>
                            {
                                currentChat?.chatInfo?.picture
                                    ? <img
                                        src={currentChat?.chatInfo?.picture}
                                        alt={currentChat?.chatInfo?.chatName}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    : <Box sx={{
                                        textTransform: 'capitalize',
                                        fontSize: '20px',
                                        color: 'common.black',
                                    }}>
                                        {currentChat?.chatInfo?.chatName?.substring(0, 1)}
                                    </Box>
                            }
                        </Box>
                        {currentChat?.chatInfo?.chatName}
                    </> : <Box sx={{
                        fontSize: '23px'
                    }}>
                        Choose chat
                    </Box>
            }
        </Box>
    )
    const chatUser = chatUserAllInfo?.user as ProfileProps;
    return (
        <>
            {
                width <= 1200 && (
                    <CustomDrawer
                        contentStyle={{
                            minWidth: '100%',
                            p: 0,
                            "& > div":{
                                overflow: 'hidden',
                                "& > div":{
                                    height: '100%'
                                }
                            }
                        }}
                        bgColor={'common.black'}
                        anchor={'right'}
                        toggleDrawer={setOpenDrawer}
                        open={openDrawer}
                        maxWidth={'100%'}
                        closeWithOtherData={closeChat}
                        showDefaultHeader={false}
                        title={''}
                        button={<></>}
                    >
                        {
                            openDrawer && currentChat?._id ?
                                <Box sx={{
                                    height: '100%',
                                    width: '100%',
                                }}>
                                    <CurrentChatContainer
                                        setOpenDrawer={setOpenDrawer}
                                        setCurrentChat={setCurrentChat}
                                        conversation={currentChat}
                                        closeChat={closeChat}
                                        header={
                                            <Box sx={{
                                                py: 1,
                                                width: '100%'
                                            }}>
                                                {header}
                                            </Box>
                                        }
                                    />
                                </Box> : 'Change chat for send messages'
                        }
                    </CustomDrawer>
                )
            }
            {
                width > 1200 && (
                    <Box sx={{
                        flex: 2,
                        height: '100%',
                    }}>
                        <Box sx={{
                            borderRadius: '10px',
                            p: '15px',
                            // bgcolor: "background.paper",
                            bgcolor: "common.black",
                            maxHeight: 'calc(100vh - 100px)',
                            height: '100%',
                            width: 'auto',
                            "@media screen and (max-width: 950px && min-width: 900px)": {
                                width: '330px'
                            },
                            display: 'flex'
                        }}>
                            <CurrentChatContainer
                                setOpenDrawer={setOpenDrawer}
                                setCurrentChat={setCurrentChat}
                                conversation={currentChat}
                                closeChat={closeChat}
                                header={header}
                            />
                        </Box>
                    </Box>
                )
            }
        </>
    );
};

