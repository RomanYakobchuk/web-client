import {Box, InputAdornment, TextField, Typography} from "@mui/material";
import {useForm, useTranslate} from "@refinedev/core";
import React, {Dispatch, SetStateAction, useState} from "react";

import {useUserInfo, useUserProperties} from "@/hook";
import {ProfileProps} from "@/interfaces/common";
import {ModalShowContent} from "@/components";
import {HeadlessSelect} from "@/components/headlessUI/headlessSelect";

type TProps = {
    isShow?: boolean,
    setIsShow?: Dispatch<SetStateAction<boolean>>
}
export const CreateUniqueIndicator = ({isShow = false, setIsShow}: TProps) => {
    const {user} = useUserInfo();
    const translate = useTranslate();
    const {properties, setProperties} = useUserProperties();

    const [isShowModal, setIsShowModal] = useState<boolean>(isShow || properties?.isShowUserDontHaveUniqueIndicator);
    const [type, setType] = useState<ProfileProps['uniqueIndicator']['type']>("private");
    const [indicator, setIndicator] = useState<string>('');
    const {
        onFinish,
        mutationResult: {data, isError}
    } = useForm({
        resource: `users/createUniqueIndicator/${user?._id}`,
        action: 'create',
        errorNotification: false,
        successNotification: false,
        redirect: false
    });
    const handleCloseShowUserUniqueIndicator = (value: boolean) => {
        setProperties({...properties, isShowUserDontHaveUniqueIndicator: value});
        setIsShowModal(false);
        if (setIsShow) {
            setIsShow(false);
        }
    }

    const onClose = () => {
        handleCloseShowUserUniqueIndicator(false)
        setIsShowModal(false);
        if (setIsShow) {
            setIsShow(false);
        }
    }
    const handleCreate = async () => {
        try {
            if (!indicator || !type) return;

            await onFinish({
                indicator: "@" + indicator,
                type: type
            });

            if (data?.data?.user) {
                localStorage.setItem("user", data?.data?.user);
                onClose();
            }
        } catch (e) {
            console.log(e);
        }
    }
    console.log(user)
    return (
        <>
            {
                isShowModal && (
                    <ModalShowContent
                        isOpen={isShowModal}
                        setIsOpen={handleCloseShowUserUniqueIndicator}
                        onClick={handleCreate}
                        onSuccessText={translate('buttons.create')}
                        onCancelText={translate('buttons.close')}
                        headerStyle={{
                            marginBottom: '0'
                        }}
                        onClose={onClose}
                        disabledSuccess={!indicator || !type}
                        modalStyle={{
                            maxWidth: {xs: '90%', sm: '500px'},
                            '& label': {
                                color: 'secondary.main',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'common.white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'common.white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'common.white',
                                },
                            },
                            "& label, & label.Mui-focused": {
                                color: 'common.white'
                            },
                            color: 'common.white'
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            p: 2,
                            color: 'common.white',
                            fontSize: '16px',
                        }}>
                            {translate('chats.create.uniqueIndicator.create')}
                        </Box>
                        <Box sx={{
                            width: '100%',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                            gap: 1
                        }}>
                            {/*<Typography>*/}
                            {/*    {translate('chats.create.uniqueIndicator.type.title')}*/}
                            {/*</Typography>*/}
                            <TextField
                                fullWidth
                                label={translate('chats.create.uniqueIndicator.title')}
                                size={'small'}
                                sx={{
                                    color: 'common.black',
                                    "& div.MuiInputBase-root": {
                                        borderRadius: '30px !important',
                                        p: '0px 15px',
                                        // borderWidth: '2px !important',
                                        borderColor: 'common.white',
                                        // borderStyle: 'solid !important'
                                    }
                                }}
                                value={indicator || ''}
                                onChange={(event) => setIndicator(event.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment sx={{
                                        "& p": {
                                            color: 'common.white'
                                        }
                                    }} position="start">@</InputAdornment>,
                                }}
                            />
                            <Typography>
                                {translate('chats.create.uniqueIndicator.type.title')}
                            </Typography>
                            <HeadlessSelect
                                options={[
                                    {
                                        value: 'private',
                                        title: translate('chats.create.status.private')
                                    },
                                    {
                                        value: 'public',
                                        title: translate('chats.create.status.public')
                                    },
                                ]}
                                setSortBy={setType as Dispatch<SetStateAction<string>>}
                            />
                            {
                                isError && (
                                    <span style={{
                                        color: 'red'
                                    }}>
                                        {translate('chats.create.uniqueIndicator.isExist')}
                                    </span>
                                )
                            }
                        </Box>
                    </ModalShowContent>
                )
            }
        </>
    );
};

