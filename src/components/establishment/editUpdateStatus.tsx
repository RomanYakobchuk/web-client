import {Box, Button, FormControl, IconButton, MenuItem, Popover, Select, Typography} from "@mui/material";
import React, {ComponentProps, MouseEvent, useContext, useEffect, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";
import {Edit} from "@mui/icons-material";

import {IEstablishment} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {TagField} from "@refinedev/mui";
import {axiosInstance} from "@/authProvider";
import {ESTABLISHMENT} from "@/config/names";


type TProps = {
    establishment: IEstablishment
}
const EditUpdateStatus = ({establishment}: TProps) => {

    const translate = useTranslate();
    const {open} = useNotification();
    const {mode} = useContext(ColorModeContext);

    const [anchorElPopover, setAnchorElPopover] = useState<HTMLButtonElement | null>(null);
    const [status, setStatus] = useState<string>(establishment?.verify ?? 'draft');
    const [newStatus, setNewStatus] = useState<string>(status);
    // const {
    //     refineCore: {onFinish},
    //     handleSubmit
    // } = useForm({
    //     refineCoreProps: {
    //         action: 'edit',
    //         resource: `establishment/updateStatus`,
    //         id: establishment?._id as string,
    //         redirect: false,
    //         errorNotification: (data: any) => {
    //             return {
    //                 type: 'error',
    //                 message: data?.response?.data?.error
    //             }
    //         },
    //         successNotification: (data: any) => {
    //             return {
    //                 type: "success",
    //                 message: data?.data?.message
    //             }
    //         }
    //     }
    // });
    const handleClickPopover = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorElPopover(event.currentTarget);
    }
    const handleClosePopover = () => {
        setAnchorElPopover(null);
    }
    const openPopover = Boolean(anchorElPopover);
    const popoverId = openPopover ? 'update_status_popover_info' : undefined;

    useEffect(() => {
        if (establishment?._id) {
            setStatus(establishment?.verify as string)
        }
    }, [establishment]);

    const onFinishHandler = async () => {
        try {
            const response =  await axiosInstance.patch(`${ESTABLISHMENT}/updateStatus/${establishment?._id}`, {
                status: newStatus
            });
            if (response?.data?.message) {
                open?.({
                    type: 'success',
                    description: 'Success',
                    message: response?.data?.message
                })
            }
             setStatus(newStatus)
        } catch (e) {

        }
    }
    let color: ComponentProps<typeof TagField>["color"];
    switch (status) {
        case "published":
            color = "success";
            break;
        case "rejected":
            color = "error";
            break;
        case "draft":
            color = "info";
            break;
        default:
            color = "default";
            break;
    }
    return (
        <Box sx={{
            width: 'fit-content',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
        }}>
            <TagField value={translate(`posts.fields.status.${status}`)} color={color}/>
            <IconButton onClick={handleClickPopover}>
                <Edit/>
            </IconButton>
            <Popover
                id={popoverId}
                open={openPopover}
                anchorEl={anchorElPopover}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                sx={{
                    "& div.MuiPaper-root": {
                        backgroundColor: 'common.black',
                        boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? '#f1f1f1' : '#424242'}`,
                        borderRadius: '7px'
                    },
                }}
            >
                <Box
                    sx={{
                        width: '300px',
                        display: 'grid',
                        gridTemplateRows: '1fr',
                        gap: 2.5,
                        p: '15px',
                        borderRadius: '10px',
                        bgcolor: (theme) => theme.palette.primary.main
                    }}
                    component={'form'}
                    // onSubmit={handleSubmit(onFinishHandler)}
                >
                    <Typography
                        variant={'subtitle1'}>
                        {establishment?._id}
                    </Typography>
                    <div>
                        <Typography
                            variant={'subtitle2'}
                        >
                            {translate('posts.fields.title')}:
                        </Typography>
                        <Typography
                            variant={'subtitle1'}>
                            {establishment?.title}
                        </Typography>
                    </div>
                    {/*<Typography*/}
                    {/*    sx={{*/}
                    {/*        display: 'flex',*/}
                    {/*        alignItems: 'center',*/}
                    {/*        flexDirection: 'row',*/}
                    {/*        gap: gap*/}
                    {/*    }}*/}
                    {/*    variant={'subtitle2'}>*/}
                    {/*    <Category/>*/}
                    {/*    {translate(`home.sortByType.${establishment?.type}`)}*/}
                    {/*</Typography>*/}
                    {/*<Box sx={{*/}
                    {/*    display: 'flex',*/}
                    {/*    alignItems: 'center',*/}
                    {/*    flexDirection: 'row',*/}
                    {/*    gap: gap*/}
                    {/*}}>*/}
                    {/*    <Place/>*/}
                    {/*    <Box sx={{*/}
                    {/*        display: 'flex',*/}
                    {/*        justifyContent: 'start',*/}
                    {/*        flexDirection: 'column',*/}
                    {/*        gap: 0.5*/}
                    {/*    }}>*/}
                    {/*        <Typography variant={'subtitle2'}>*/}
                    {/*            {establishment?.place?.city}*/}
                    {/*        </Typography>*/}
                    {/*        <Typography variant={'subtitle2'}>*/}
                    {/*            {establishment?.place?.address}*/}
                    {/*        </Typography>*/}
                    {/*    </Box>*/}
                    {/*</Box>*/}
                    <FormControl sx={{
                        display: 'grid',
                        gridTemplateRows: '1fr',
                        gap: 2,
                    }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={newStatus ?? ''}
                            size={"small"}
                            color={"secondary"}
                            onChange={(event) => setNewStatus(event.target.value)}
                        >
                            {
                                [
                                    {
                                        title: translate("posts.fields.status.draft"),
                                        value: 'draft',
                                        color: 'info'
                                    },
                                    {
                                        title: translate("posts.fields.status.rejected"),
                                        value: "rejected",
                                        color: 'error'
                                    },
                                    {
                                        title: translate("posts.fields.status.published"),
                                        value: 'published',
                                        color: 'success'
                                    }
                                ].map((type) => (
                                    <MenuItem key={type.value}
                                              value={type.value}>{type.title}</MenuItem>
                                ))
                            }
                        </Select>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            "& button": {
                                textTransform: 'inherit'
                            }
                        }}>
                            <Button
                                // onClick={() => navigate(-1)}
                                variant={'contained'}
                                color={'error'}
                                fullWidth
                            >
                                {translate('buttons.cancel')}
                            </Button>
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color={'info'}
                                fullWidth
                                onClick={onFinishHandler}
                            >
                                {translate('buttons.save')}
                            </Button>
                        </Box>
                    </FormControl>
                </Box>
            </Popover>
        </Box>
    );
};
export default EditUpdateStatus;
