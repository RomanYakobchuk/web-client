import {useNavigate, useParams} from "react-router-dom";
import {useDelete, useGetIdentity, useShow, useTranslate} from "@refinedev/core";
import {
    Box,
    Button,
    CardContent,
    CardHeader,
    Grid, Tooltip, IconButton,
} from "@mui/material";
import {TagField} from "@refinedev/mui";
import dayjs from "dayjs";
import {Check, Close, Delete, EastOutlined, RateReview} from "@mui/icons-material";
import {Typography} from "antd";
import React, {useContext, useState} from "react";

import {IReserve, ProfileProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import {CustomShow, TitleTextItem as Item} from "../index";
import "./reserve_style.css";

const {Title, Text} = Typography;

interface GridItem {
    value: string | any,
    title: string
}


const DetailsReserve = () => {
    const {id} = useParams();
    const {data: user} = useGetIdentity<ProfileProps>();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const [selectedItem, setSelectedItem] = useState<number | null>(null);

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

    const handleClick = (index: number) => {
        setSelectedItem((prevSelectedItem) =>
            prevSelectedItem === index ? null : index
        );
    };
    const items: GridItem[] = [
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
                        fontSize: '16px',
                        padding: '7px'
                    }}
                    value={translate(`capl.status.${reserve?.userStatus?.value}`)}
                    color={"success"}/>
                : reserve?.userStatus?.value === 'draft'
                    ?
                    <TagField
                        style={{
                            fontSize: '16px',
                            padding: '7px'
                        }}
                        value={translate(`capl.status.${reserve?.userStatus?.value}`)}
                        color={"info"}/>
                    : reserve?.userStatus?.value === 'rejected'
                        ? <TagField
                            style={{
                                fontSize: '16px',
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
                        fontSize: '16px',
                        padding: '7px'
                    }}
                    value={translate(`capl.status.${reserve?.institutionStatus?.value}`)}
                    color={"success"}/>
                : reserve?.institutionStatus?.value === 'draft'
                    ?
                    <TagField
                        style={{
                            fontSize: '16px',
                            padding: '7px'
                        }}
                        value={translate(`capl.status.${reserve?.institutionStatus?.value}`)}
                        color={"info"}/>
                    : reserve?.institutionStatus?.value === 'rejected'
                        ? <TagField
                            style={{
                                fontSize: '16px',
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
    ];

    if (isError) return <div>Error</div>
    return (
        <CustomShow
            isLoading={isLoading}
            showButtons={(user?._id === reserve?.user || user?._id === reserve?.manager || user?.status === 'admin')}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(auto-fit, minmax(calc(100% / 3), 1fr))',
                        sm: 'repeat(auto-fit, minmax(calc(100% / 4), 1fr))',
                        md: 'repeat(auto-fit, minmax(calc(100% / 5), 1fr))',
                        lg: 'repeat(auto-fit, minmax(calc(100% / 6), 1fr))',
                        xl: 'repeat(auto-fit, minmax(calc(100% / 8), 1fr))',
                    },
                    gap: '8px',
                    gridAutoRows: 'minmax(0, 1fr)',
                }}
            >
                {
                    items.map((item, index) => (
                            <Box
                                key={index + 1}
                                onClick={() => handleClick(index)}
                                sx={{
                                    transition: 'width 1s ease-in-out, height 1s ease-in-out',
                                }}
                                className={`grid-item ${selectedItem === index ? 'selected' : 'shrink'}`}
                            >
                                <Item
                                    title={item.title} value={item.value}/>
                            </Box>
                        )
                    )
                }
            </Box>
            <Grid container spacing={2}>
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
        </CustomShow>
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
