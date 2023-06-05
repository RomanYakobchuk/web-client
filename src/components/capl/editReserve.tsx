import {Box, Grid, TextareaAutosize, Typography} from "@mui/material";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {Form, Select, Input, Switch, DatePicker} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useForm, Edit, Breadcrumb} from "@refinedev/antd";
import {useParams} from "react-router-dom";
import {ListButton} from "@refinedev/mui";
import dayjs from "dayjs";


import {IReserve, ProfileProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";


const EditReserve = () => {

    const {id} = useParams();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {data: user} = useGetIdentity<ProfileProps>();

    const [writeMe, setWriteMe] = useState<boolean>();

    const {formProps, saveButtonProps, queryResult} = useForm<IReserve>({
        warnWhenUnsavedChanges: true,
        resource: 'capl/findOne',
        id: id as string,
        errorNotification: (data: any) => {
            return {
                type: 'error',
                message: data?.response?.data?.error
            }
        },
        successNotification: (data: any) => {
            return {
                type: 'success',
                message: data?.data?.message
            }
        },
    });
    const reserveData = queryResult?.data?.data;

    useEffect(() => {
        if (reserveData) {
            setWriteMe(reserveData?.writeMe)
        }
    }, [reserveData])
    const color = mode === 'dark' ? '#fff' : '#000';
    const bgColor = 'transparent';

    return (
        <Edit
            saveButtonProps={saveButtonProps}
            contentProps={{
                style: {
                    background: mode === 'dark' ? "#4d4d44" : '#fff',
                },
            }}
            headerProps={{
                title: <Typography fontSize={'18px'}>{translate('actions.edit')}</Typography>
            }}
            headerButtons={[
                <ListButton title={translate('actions.list')} key={'list_capl_button'} variant={'contained'} color={'info'}/>
            ]}
            breadcrumb={
                <Box sx={{
                    "& nav ol > li > span": {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }
                }}>
                    <Breadcrumb/>
                </Box>
            }
        >
            <Form
                {...formProps}
                initialValues={{
                    ...formProps.initialValues, date: dayjs(formProps?.initialValues?.date)
                }} layout={'vertical'}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Form.Item
                            label={<label style={{
                                color: color
                            }}>{translate('capl.create.fullName')}</label>}
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    background: bgColor,
                                    color: color,
                                }}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.create.date')}</label>
                            }
                            name={'date'}
                            rules={[
                                {
                                    required: true,
                                    type: 'date'
                                },
                            ]}
                        >
                            <DatePicker
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    width: '100%',
                                    background: '#fff'
                                }}
                                showTime={true}
                                format={'DD-MM-YYYY HH:mm'}
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.create.desiredAmount')}</label>
                            }
                            name={'desiredAmount'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    background: bgColor,
                                    color: color
                                }}
                                type={'number'}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.create.numberPeople')}</label>
                            }
                            name={'numberPeople'}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    background: bgColor,
                                    color: color
                                }}
                                type={'number'}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.create.whoPay')}</label>
                            }
                            name="whoPay"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    background: bgColor,
                                    color: color
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.create.writeMe')}</label>
                            }
                            name="writeMe"
                            rules={[
                                {
                                    type: 'boolean'
                                }
                            ]}
                        >
                            <Switch
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                checked={writeMe}
                                onChange={(checked) => setWriteMe(checked)}/>
                        </Form.Item>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.status.userStatus')}</label>
                            }
                            name="userStatus"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    color: color,
                                    background: bgColor
                                }}
                                options={[
                                    {
                                        label: translate('capl.status.accepted'),
                                        value: "accepted",
                                    },
                                    {
                                        label: translate('capl.status.draft'),
                                        value: "draft",
                                    },
                                    {
                                        label: translate('capl.status.rejected'),
                                        value: "rejected",
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.status.institutionStatus')}</label>
                            }
                            name="institutionStatus"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                disabled={!(user?.status === 'manager' || user?.status === 'admin')}
                                style={{
                                    color: color,
                                    background: bgColor
                                }}
                                options={[
                                    {
                                        label: translate('capl.status.accepted'),
                                        value: "accepted",
                                    },
                                    {
                                        label: translate('capl.status.draft'),
                                        value: "draft",
                                    },
                                    {
                                        label: translate('capl.status.rejected'),
                                        value: "rejected",
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.create.eventType')}</label>
                            }
                            name="eventType"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    color: color,
                                    background: bgColor
                                }}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{
                                    color: color
                                }}>{translate('capl.create.comment')}</label>
                            }
                            name="comment"
                        >
                            <TextareaAutosize
                                minRows={3}
                                disabled={!(user?.status === 'user' || user?.status === 'admin')}
                                style={{
                                    flex: 8,
                                    width: '100%',
                                    maxWidth: '100%',
                                    resize: 'vertical',
                                    minHeight: '70px',
                                    maxHeight: '170px',
                                    height: '70px',
                                    background: "transparent",
                                    fontSize: "16px",
                                    borderRadius: 6,
                                    padding: 10,
                                    color: mode === "dark" ? "#fcfcfc" : "#000",
                                    borderColor: mode === "dark" ? "#fcfcfc" : "#000",
                                }}
                            />
                        </Form.Item>
                    </Grid>
                </Grid>
            </Form>
        </Edit>
    );
};
export default EditReserve
