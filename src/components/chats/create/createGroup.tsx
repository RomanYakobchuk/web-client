import {ChangeCircleOutlined, DeleteOutlined} from "@mui/icons-material";
import {ChangeEvent, Dispatch, DragEvent, SetStateAction} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {HeadlessSelect} from "@/components/headlessUI/headlessSelect";
import {IConversation} from "@/interfaces/common";

type TCreateGroup = {
    chatName: string,
    setChatName: Dispatch<SetStateAction<string>>,
    setAccess: Dispatch<SetStateAction<IConversation['access']>>,
    file: File | null,
    setFile: Dispatch<SetStateAction<TCreateGroup['file']>>
}
const CreateGroup = ({chatName, setChatName, setAccess, setFile, file}: TCreateGroup) => {

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
                        setSortBy={setAccess as Dispatch<SetStateAction<string>>}
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
export default CreateGroup;