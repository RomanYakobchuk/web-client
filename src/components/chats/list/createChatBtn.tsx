import {Box, Button} from "@mui/material";
import {Add} from "@mui/icons-material";
import {CreateChatBox} from "@/components/chats/create/createChatBox";
import React, {useEffect, useState} from "react";

export const CreateChatBtn = () => {

    const [__, setIsVisible] = useState<boolean>(false);
    const [isOpenCreateNewChat, setIsOpenCreateNewChat] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(isOpenCreateNewChat)
        }, 500);
        return () => {
            clearTimeout(timer)
        }
    }, [isOpenCreateNewChat]);
    return (
        <Box sx={{
            position: {xs: 'fixed'},
            bottom: '20px',
            right: '20px',
            "@media screen and (min-width: 768px)": {
                position: 'absolute',
                bottom: 0,
                right: 0,
            },
            zIndex: 1,
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
            <CreateChatBox isOpen={isOpenCreateNewChat}
                           setIsOpen={setIsOpenCreateNewChat}/>
        </Box>
    );
};

