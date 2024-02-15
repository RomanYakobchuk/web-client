import {Dispatch, SetStateAction, MouseEvent, useEffect, DragEvent, useState, ChangeEvent} from "react";
import {useNotification, usePermissions, useTranslate, useForm} from "@refinedev/core";
import {Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {ChangeCircleOutlined, Close, DeleteOutlined} from "@mui/icons-material";

import {HeadlessSelect} from "@/components/common/search/utils/headlessSelect";
import {SearchByTypeComponent} from "@/components/common/search";
import {IConversation, IConvMembers, ProfileProps} from "@/interfaces/common"
import {useUserInfo} from "@/hook";
import LottieComponent from "@/lotties/LottieComponent";
import SuccessArrowLottie from "@/lotties/accepted.json"
import {ImageField} from "@refinedev/antd";
import {ScaleWindow} from "@/components/window/scaleWindow";

type TProps = {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    setNewChat?: Dispatch<SetStateAction<IConversation | null>>
}
export const CreateChatBox = ({isOpen, setIsOpen, setNewChat}: TProps) => {

    const {open} = useNotification();
    const {data: role} = usePermissions();
    const {user} = useUserInfo();
    const translate = useTranslate();

    const [searchValue, setSearchValue] = useState<string>("");
    const [connectedUser, setConnectedUser] = useState<ProfileProps | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<IConversation['chatInfo']['type']>('oneByOne');
    const [status, setStatus] = useState<IConversation['chatInfo']['status']>('private');
    const [chatName, setChatName] = useState<string>("");

    const {onFinish, mutationResult: {data}} = useForm({
        resource: 'conversation/createOwnChat',
        redirect: false,
        action: 'create',
        successNotification: (data: any) => {
            return {
                type: 'success',
                message: data?.data?.message
            }
        },
        errorNotification: (data: any) => {
            return {
                type: "error",
                message: data?.response?.data?.error
            }
        }
    })

    const handleClose = () => {
        setIsOpen(false)
    };
    const handleCreate = async (event: MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const members: IConvMembers[] = [
                {
                    role: role as IConvMembers['role'],
                    user: user?._id as string,
                    connectedAt: new Date(),
                    conversationTitle: chatName
                }
            ]
            if (type === 'oneByOne') {
                if (connectedUser) {
                    members.push({
                        user: connectedUser?._id,
                        role: connectedUser?.status,
                        conversationTitle: chatName,
                        connectedAt: new Date()
                    })
                }
                if (members?.length <= 1 && !connectedUser) {
                    return alert('Find user for chat')
                }
            }
            const formData = new FormData();
            formData.append('chatName', chatName);
            formData.append('chatType', type);
            formData.append('status', type === 'oneByOne' ? "private" : status);
            formData.append('members', JSON.stringify(members));
            if (file) {
                formData.append('picture', file)
            }
            await onFinish(formData);
            if (data?.data?.chat && setNewChat) {
                setNewChat(data?.data?.chat as IConversation);
            }
            setIsOpen(false)
        } catch (e: any) {
            open?.({
                type: 'error',
                message: e?.response?.data?.message,
                description: 'Error'
            })
        }
    }

    const byType = {
        group: <CreateGroup
            chatName={chatName}
            setChatName={setChatName}
            setStatus={setStatus}
            file={file}
            setFile={setFile}
        />,
        oneByOne: <CreateOneByOne
            user={connectedUser}
            setUser={setConnectedUser}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
        />
    }

    const disabled = type === "group" ? (chatName?.length <= 0 || !status) : !connectedUser;

    return (
        <ScaleWindow isOpen={isOpen} setIsOpen={setIsOpen}>
            <Box
                component={'form'}
                onSubmit={handleCreate}
            >
                <header style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end'
                }}>
                    <IconButton onClick={handleClose}>
                        <Close/>
                    </IconButton>
                </header>
                <Box sx={{
                    width: '100%',
                    p: {xs: 2, sm: 3, md: 4},
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%'
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5
                        }}>
                            <Typography>
                                {translate('chats.create.type.title')}
                            </Typography>
                            <SearchByTypeComponent
                                type={type}
                                setType={setType}
                                styleSx={{
                                    width: 'fit-content',
                                }}
                                sortTranslatePath={'chats.create.type'}
                                arrayType={[
                                    {
                                        value: 'oneByOne',
                                        title: 'oneByOne'
                                    },
                                    {
                                        value: 'group',
                                        title: 'group'
                                    },
                                ]}
                            />
                        </Box>
                        <Box sx={{
                            p: 2,
                            borderRadius: '10px',
                            border: '2px solid cornflowerblue'
                        }}>
                            {byType[type]}
                        </Box>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'end',
                        gap: 2,
                        "& button": {
                            textTransform: 'inherit',
                            fontSize: {xs: '16px', md: '18px'}
                        }
                    }}>
                        <Button
                            color={'error'}
                            onClick={handleClose}
                        >
                            {translate('buttons.cancel')}
                        </Button>
                        <Button
                            disabled={disabled}
                            color={'info'}
                            type={'submit'}
                        >
                            {translate('actions.create')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ScaleWindow>
    )
};

type TCreateGroup = {
    chatName: string,
    setChatName: Dispatch<SetStateAction<string>>,
    setStatus: Dispatch<SetStateAction<IConversation['chatInfo']['status']>>,
    file: File | null,
    setFile: Dispatch<SetStateAction<TCreateGroup['file']>>
}
const CreateGroup = ({chatName, setChatName, setStatus, setFile, file}: TCreateGroup) => {

    const translate = useTranslate();


    const handleDragOver = (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    const handleDragLeave = () => {
    };
    const handleDrop = (event: DragEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];

        if (file) {
            setFile(file)
        }
    }

    const handlePicturesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files?.[0]);
        }
    }
    const loadText = translate('chats.create.load.uploadFile');
    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: 2
        }}>
            <TextField
                size={"small"}
                label={translate('posts.fields.title') + '*'}
                value={chatName || ""}
                type={'text'}
                onChange={(event) => setChatName(event.target.value)}
            />
            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                gap: 2,
                width: '100%'
            }}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                }}>
                    <Typography>
                        {translate('chats.create.status.title')}*
                    </Typography>
                    <HeadlessSelect
                        btnWidth={'50%'}
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
                        setSortBy={setStatus as Dispatch<SetStateAction<string>>}
                    />
                </Box>
            </Box>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5
            }}>
                <Typography>
                    {translate('home.create.pictures.title')}
                </Typography>
                <div className="flex items-center justify-center w-full">

                    {
                        file ? (
                            <Box sx={{
                                width: '100%',
                                height: '160px',
                                position: 'relative'
                            }}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={'chat image'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '10px'
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    "& button, & label": {
                                        minWidth: '30px',
                                        p: 0.5,
                                        borderRadius: '7px',
                                        cursor: 'pointer'
                                    },
                                    display: 'flex',
                                    gap: 1
                                }}>
                                    <Box
                                        component="label"
                                        htmlFor="dropzone-file-change"
                                        sx={{
                                            bgcolor: 'green',
                                        }}
                                    >
                                        <ChangeCircleOutlined/>
                                        <input
                                            id="dropzone-file-change"
                                            type="file"
                                            className="hidden"
                                            onChange={handlePicturesChange}
                                        />
                                    </Box>
                                    <Button
                                        color={'error'}
                                        variant={'contained'}
                                        onClick={() => setFile(null)}
                                    >
                                        <DeleteOutlined/>
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <label htmlFor="dropzone-file"
                                   className="flex flex-col items-center
                                   justify-center w-full h-40 border-2 border-gray-300
                                    border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800
                                    dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600
                                    dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                         aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 p-1 text-center text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                            {loadText?.split(' ')?.slice(0, 3)?.join(' ')}
                                        </span>
                                        {/*{' '}*/}
                                        {/*<span className="font-normal">*/}
                                        {/*{loadText?.split(' ')?.slice(3, 10)?.join(' ')}*/}
                                        {/*</span>*/}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, JPAG</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handlePicturesChange}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                />
                            </label>
                        )
                    }
                </div>
            </Box>
        </Box>
    )
}

type TCreateOneByOne = {
    user: ProfileProps | null,
    setUser: Dispatch<SetStateAction<TCreateOneByOne['user']>>,
    searchValue: string,
    setSearchValue: Dispatch<SetStateAction<string>>
}
const CreateOneByOne = ({setUser, user, setSearchValue, searchValue}: TCreateOneByOne) => {

    const translate = useTranslate();

    const {onFinish, mutationResult: {data, isLoading, isError}} = useForm({
        resource: `users/findUserByIndicator/${user?._id}`,
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
            await onFinish({
                indicator: "@" + searchValue
            })
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