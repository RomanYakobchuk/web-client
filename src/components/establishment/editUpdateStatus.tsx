import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "@refinedev/react-hook-form";
import {Box, Button, FormControl, MenuItem, Select, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslate} from "@refinedev/core";
import {BrandingWatermark, Category, Place, Title} from "@mui/icons-material";

import {Loading} from "../index";
import {PropertyProps} from "../../interfaces/common";


const EditUpdateStatus = () => {

    const {id} = useParams();
    const translate = useTranslate();
    const navigate = useNavigate();

    const {
        refineCore: {onFinish, queryResult},
        handleSubmit
    } = useForm({
        refineCoreProps: {
            action: 'edit',
            resource: `institution/updateStatus`,
            id: id as string,
            redirect: false,
            errorNotification: (data: any) => {
                return {
                    type: 'error',
                    message: data?.response?.data?.error
                }
            },
            successNotification: (data: any) => {
                return {
                    type: "success",
                    message: data?.data?.message
                }
            }
        }
    });
    const {isLoading, isError} = queryResult!;

    const [institution, setInstitution] = useState<PropertyProps>({} as PropertyProps);

    useEffect(() => {
        if (queryResult?.data?.data) {
            setInstitution(queryResult?.data?.data as PropertyProps)
        }
    }, [queryResult]);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        if (institution) {
            setStatus(institution?.verify as string)
        }
    }, [institution])

    // useEffect(() => {
    //     (async () => {
    //        const data = await axiosInstance.get(`/institution/updateStatus/${id}`);
    //         console.log(data)
    //     })()
    // }, [])
    const onFinishHandler = async () => {
        await onFinish({
            status: status
        })
        navigate(-1)
    }
    const gap = 1.5;

    if (isLoading) return <Loading/>
    if (isError) return <div>Error</div>
    return (
        <Box sx={{
            width: '100%',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '330px',
                    display: 'grid',
                    gridTemplateRows: '1fr',
                    gap: 2.5,
                    p: '15px',
                    borderRadius: '10px',
                    bgcolor: (theme) => theme.palette.primary.main
                }}
                component={'form'}
                onSubmit={handleSubmit(onFinishHandler)}
            >
                <Typography
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: gap
                    }}
                    variant={'subtitle1'}>
                    <BrandingWatermark/>
                    {institution?._id}
                </Typography>
                <Typography
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: gap
                    }}
                    variant={'subtitle1'}>
                    <Title/>
                    {institution?.title}
                </Typography>
                <Typography
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: gap
                    }}
                    variant={'subtitle2'}>
                    <Category/>
                    {translate(`home.sortByType.${institution?.type}`)}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: gap
                }}>
                    <Place/>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        flexDirection: 'column',
                        gap: 0.5
                    }}>
                        <Typography variant={'subtitle2'}>
                            {institution?.place?.city}
                        </Typography>
                        <Typography variant={'subtitle2'}>
                            {institution?.place?.address}
                        </Typography>
                    </Box>
                </Box>
                <FormControl sx={{
                    display: 'grid',
                    gridTemplateRows: '1fr',
                    gap: 2
                }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status ?? ''}
                        size={"small"}
                        color={"secondary"}
                        onChange={(event) => setStatus(event.target.value)}
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
                                <MenuItem  key={type.value}
                                          value={type.value}>{type.title}</MenuItem>
                            ))
                        }
                    </Select>
                    <Button
                        onClick={() => navigate(-1)}
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
                    >
                        {translate('buttons.save')}
                    </Button>
                </FormControl>
            </Box>
        </Box>
    );
};
export default EditUpdateStatus;
