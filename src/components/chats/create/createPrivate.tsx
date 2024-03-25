import {Box, Button, CircularProgress, InputAdornment, TextField} from "@mui/material";
import {Dispatch, SetStateAction, useEffect} from "react";
import {useForm, useTranslate} from "@refinedev/core";
import {ImageField} from "@refinedev/antd";

import SuccessArrowLottie from "@/lotties/accepted.json";
import LottieComponent from "@/lotties/LottieComponent";
import {ProfileProps} from "@/interfaces/common";

type TCreatePrivate = {
    user: ProfileProps | null,
    setUser: Dispatch<SetStateAction<TCreatePrivate['user']>>,
    searchValue: string,
    setSearchValue: Dispatch<SetStateAction<string>>
}
const CreatePrivate = ({setUser, user, setSearchValue, searchValue}: TCreatePrivate) => {

    const translate = useTranslate();

    const {onFinish, mutationResult: {data, isLoading, isError}} = useForm({
        resource: `users/findUserByIndicator/@${searchValue}`,
        action: 'create',
        errorNotification: false,
        successNotification: false
    });

    useEffect(() => {
        if (data?.data) {
            setUser(data?.data?.user)
        }
    }, [data]);

    const search = async () => {
        try {
            await onFinish({})
        } catch (e) {

        }
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: user ? 4 : 0
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <TextField
                    label={translate('')}
                    size={'small'}
                    sx={{
                        "& div.MuiInputBase-root": {
                            borderRadius: '30px !important',
                            p: '0px 15px'
                        }
                    }}
                    value={searchValue || ''}
                    onChange={(event) => setSearchValue(event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">@</InputAdornment>,
                    }}
                />
                <Button
                    color={'secondary'}
                    variant={'outlined'}
                    sx={{
                        textTransform: 'inherit',
                        borderRadius: '30px',
                        borderWidth: '2px'
                    }}
                    onClick={search}
                >
                    {
                        isLoading
                            ? <CircularProgress color={'secondary'} size={24}/>
                            : translate('buttons.search')
                    }
                </Button>
            </Box>
            {
                isLoading
                    ? ''
                    : isError
                        ? <Box>
                            {translate('text.notResult')}
                        </Box>
                        : user
                            ? <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                justifyContent: 'space-between',
                                p: 1,
                                borderRadius: '10px',
                                bgcolor: 'modern.modern_2.second'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}>
                                    <Box sx={{
                                        width: '64px',
                                        height: '64px',
                                        "& div.ant-image": {
                                            width: '100%',
                                            height: '100%',
                                        }
                                    }}>
                                        <ImageField
                                            value={user?.avatar}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                zIndex: 200
                                            }}
                                        />
                                    </Box>
                                    {user?.name}
                                </Box>
                                <LottieComponent
                                    item={SuccessArrowLottie}
                                    size={50}
                                    style={{
                                        margin: 0,
                                    }}
                                />
                            </Box>
                            :
                            ''
            }
        </Box>
    )
}

export default CreatePrivate;