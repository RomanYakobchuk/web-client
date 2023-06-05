import {useNavigate, useParams} from "react-router-dom";
import {useDelete, useShow, useTranslate} from "@refinedev/core";
import {Breadcrumb, Show} from "@refinedev/antd";
import {
    Box,
    Button,
    CardContent,
    CardHeader,
    Typography as MuiTypography,
    Grid, Tooltip, IconButton,
} from "@mui/material";
import {EditButton, TagField} from "@refinedev/mui";
import dayjs from "dayjs";
import {Check, Close, Delete, EastOutlined, RateReview} from "@mui/icons-material";
import {Typography} from "antd";
import React, {useContext, useState} from "react";

import {IReserve} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import {TitleTextItem as Item} from "../index"

const {Title, Text} = Typography;

const DetailsReserve = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const {queryResult} = useShow<IReserve>({
        resource: 'capl/findOne',
        id: id as string,
        errorNotification: (data: any) => {
            return {
                type: "error",
                message: data?.response?.data?.error
            }
        }
    });
    const {data, isLoading, isError} = queryResult;

    const reserve = data?.data as IReserve;

    const textColor = mode === 'dark' ? '#fff' : '#000';

    if (isError) return <div>Error</div>
    return (
        <Show isLoading={isLoading}
              contentProps={{
                  style: {
                      background: mode === 'dark' ? "#3e3e36" : '#fff',
                  },
              }}
              headerButtons={
                  [
                      <EditButton color={'secondary'} variant={'outlined'} key={'edit'}/>
                  ]
              }
              headerProps={{
                  title: <MuiTypography fontSize={'18px'}>{translate('buttons.details')}</MuiTypography>
              }}
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CardHeader style={{
                        color: textColor
                    }} title={translate('capl.reservation')}/>
                    <Grid container spacing={2}>
                        {
                            [
                                {
                                    value: reserve?.fullName,
                                    title: translate('capl.create.fullName')
                                },
                                {
                                    value: dayjs(reserve?.date).format('DD/MM/YYYY HH:mm'),
                                    title: translate('capl.create.date')
                                },
                                {
                                    value: reserve?.desiredAmount,
                                    title: translate('capl.create.desiredAmount')
                                },
                                {
                                    value: reserve?.numberPeople,
                                    title: translate('capl.create.numberPeople')
                                },
                                {
                                    value: reserve?.whoPay,
                                    title: translate('capl.create.whoPay')
                                },
                                {
                                    value: <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        {
                                            translate(`${reserve?.writeMe ? 'text.yes' : 'text.no'}`)
                                        }
                                        <IconButton
                                            disabled={!reserve?.writeMe}
                                            sx={{
                                                m: 'auto'
                                            }}
                                            color={'inherit'}
                                            onClick={() => navigate(`/chats/show/${reserve?.user}/${reserve?.institution?._id}`)}
                                        >
                                            <RateReview/>
                                        </IconButton>
                                    </Box>,
                                    title: translate('capl.create.writeMe')
                                },
                                {
                                    value: reserve?.userStatus?.value === 'accepted'
                                        ?
                                        <TagField
                                            style={{
                                                fontSize: '20px',
                                                padding: '7px'
                                            }}
                                            value={translate(`capl.status.${reserve?.userStatus?.value}`)}
                                            color={"success"}/>
                                        : reserve?.userStatus?.value === 'draft'
                                            ?
                                            <TagField
                                                style={{
                                                    fontSize: '20px',
                                                    padding: '7px'
                                                }}
                                                value={translate(`capl.status.${reserve?.userStatus?.value}`)}
                                                color={"info"}/>
                                            : reserve?.userStatus?.value === 'rejected'
                                                ? <TagField
                                                    style={{
                                                        fontSize: '20px',
                                                        padding: '7px'
                                                    }}

                                                    value={translate(`capl.status.${reserve?.userStatus?.value}`)}
                                                    color={"error"}/>
                                                : <TagField value={""}
                                                            color={"default"}/>,
                                    title: translate('capl.status.userStatus')
                                },
                                {
                                    value: reserve?.institutionStatus?.value === 'accepted'
                                        ?
                                        <TagField
                                            style={{
                                                fontSize: '20px',
                                                padding: '7px'
                                            }}
                                            value={translate(`capl.status.${reserve?.institutionStatus?.value}`)}
                                            color={"success"}/>
                                        : reserve?.institutionStatus?.value === 'draft'
                                            ?
                                            <TagField
                                                style={{
                                                    fontSize: '20px',
                                                    padding: '7px'
                                                }}
                                                value={translate(`capl.status.${reserve?.institutionStatus?.value}`)}
                                                color={"info"}/>
                                            : reserve?.institutionStatus?.value === 'rejected'
                                                ? <TagField
                                                    style={{
                                                        fontSize: '20px',
                                                        padding: '7px'
                                                    }}

                                                    value={translate(`capl.status.${reserve?.institutionStatus?.value}`)}
                                                    color={"error"}/>
                                                : <TagField value={""}
                                                            color={"default"}/>,
                                    title: translate('capl.status.institutionStatus')
                                },
                                {
                                    value: reserve?.eventType,
                                    title: translate('capl.create.eventType')
                                },
                                {
                                    value: reserve?.comment,
                                    title: translate('capl.create.comment')
                                },
                            ].map((item, index) => (
                                <Grid
                                    key={index}
                                    item
                                    xs={6}
                                    md={4}
                                    lg={3}
                                    xl={2}
                                >
                                    <Item
                                        title={item.title}
                                        value={item.value}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
                <Grid item xs={12} p={4}>
                    <CardHeader
                        style={{
                            color: textColor
                        }}
                        title={translate('home.one')}/>
                    <CardContent>
                        <img
                            src={reserve?.institution?.mainPhoto}
                            alt={reserve?.institution?.title}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                height: '250px',
                                borderRadius: '10px',
                                objectFit: 'cover'
                            }}
                        />
                        <Title style={{
                            color: textColor
                        }} level={4}>{reserve?.institution?.title}</Title>
                        <Text style={{
                            color: textColor
                        }}>{translate(`home.sortByType.${reserve?.institution?.type}`)}</Text>
                        <Title
                            level={5}
                            style={{
                                color: textColor,
                                fontSize: '14px'
                            }}
                        >
                            {reserve?.institution?.place?.address}
                        </Title>
                        <Button
                            sx={{
                                fontSize: {xs: '12px', sm: '14px'},
                                width: '100%',
                                maxWidth: '400px'
                            }}
                            onClick={() => navigate(`/all_institutions/show/${reserve?.institution?._id}`)}
                            color={"secondary"}
                            endIcon={<EastOutlined/>}
                            variant={"outlined"}>
                            {translate("buttons.details")}
                        </Button>
                    </CardContent>
                </Grid>
            </Grid>
        </Show>
    );
};

interface IDelete {
    resource: string,
    id: string,
    value?: string
}

const DeleteButton = ({resource, id, value}: IDelete) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const {mutate} = useDelete();
    const [openDelete, setOpenDelete] = useState(false);
    const deleteInstitution = async (id: string) => {
        mutate(
            {
                resource,
                id: id as string,
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
        )
        setOpenDelete(false);
    }

    return (
        <Box sx={{
            position: 'relative',
        }}>
            <Tooltip
                title={translate('actions.delete')}
                arrow
                placement={'top'}
            >
                <IconButton
                    color={'error'}
                    onClick={() => setOpenDelete(true)}
                >
                    <Delete/>
                </IconButton>
            </Tooltip>
            {
                openDelete && <Box
                    sx={{
                        position: 'fixed',
                        zIndex: 1000,
                        top: '20%',
                        left: '30%',
                        bgcolor: (theme) => theme.palette.background.default,
                        width: '250px',
                        height: '180px',
                        p: '20px',
                        borderRadius: '10px',
                        display: 'grid',
                        gridTemplateRows: '1fr 1fr',
                        gap: 2
                    }}
                >
                    <Box sx={{
                        whiteSpace: 'break-spaces',
                        fontSize: '18px'
                    }}>
                        {translate('actions.confirmDelete', {"value": value})}
                    </Box>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 1
                        }}
                    >
                        <IconButton
                            color={'error'}
                            onClick={() => setOpenDelete(false)}
                        >
                            <Close/>
                        </IconButton>
                        <IconButton
                            color={'info'}
                            onClick={() => deleteInstitution(id)}
                        >
                            <Check/>
                        </IconButton>
                    </Box>
                </Box>
            }
        </Box>
    )
}
export default DetailsReserve
