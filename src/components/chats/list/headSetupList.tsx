import {BorderColorRounded} from "@mui/icons-material";
import {Box, Button, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import React from "react";

import {CHATS, CREATE} from "@/config/names";
import {useTranslate} from "@refinedev/core";
import {useStore} from "@/store";

type THeadSetupList = {
}
export const HeadSetupList = () => {
    const {chatEditMode, toggleChatEditMode} = useStore();
    const navigate = useNavigate();
    const translate = useTranslate();


    const handleSave = async () => {
        console.log('handleSave')
    }
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: '-16px',
                "& button": {
                    textTransform: 'inherit',
                    fontSize: '1rem',
                    minWidth: '30px',
                    py: 0.5,
                    px: 1
                    // fontWeight: 500
                }
            }}
        >
            <Button
                color={'info'}
                variant={'text'}
                onClick={() => toggleChatEditMode(!chatEditMode)}
            >
                {translate(chatEditMode ? 'buttons.cancel' : 'buttons.edit')}
            </Button>
            {
                chatEditMode
                    ? (
                        <Button
                            color={'info'}
                            variant={'text'}
                            onClick={handleSave}
                        >
                            {translate('buttons.save')}
                        </Button>
                    )
                        : (
                    <IconButton
                        onClick={() => {
                            navigate(`/${CHATS}/${CREATE}`)
                        }}
                        color={'secondary'}
                    >
                        <BorderColorRounded/>
                    </IconButton>
                )
            }
        </Box>
    );
};

