import {
    CrudFilters,
    HttpError, usePermissions,
    useTranslate
} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import React, {ComponentProps, useContext, useEffect, useMemo, useState} from "react";
import {TagField, useDataGrid} from "@refinedev/mui";
import {GridColDef} from "@mui/x-data-grid";
import {
    Box,
    Grid,
    IconButton,
    Tooltip
} from "@mui/material";
import {CellWifiRounded, Edit, People, Visibility} from "@mui/icons-material";

import {
    IProfilePropsFilterVariables,
    ProfileProps,
} from "@/interfaces/common";
import GridComponent from "@/components/grid/GridComponent";
import UserStat from "@/dashboard/properties/user/userStat";
import UserFiltersStat from "@/dashboard/properties/user/userFiltersStat";
import {socket} from "@/socketClient";
import {ColorModeContext} from "@/contexts";
import CountUp from "react-countup";

const AllUsers = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {data: role} = usePermissions();

    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [value, setValue] = useState('');

    const [activeUsers, setActiveUsers] = useState<string[]>([] as string[]);

    const {dataGridProps, setFilters, search} = useDataGrid<
        ProfileProps, HttpError, IProfilePropsFilterVariables
    >({
        resource: `users/findUserByQuery`,
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const {isBlocked, phoneVerify, status, isActivated} = params;

            filters.push(
                {
                    field: "status",
                    operator: "eq",
                    value: status ? status : undefined
                },
                {
                    field: "isBlocked",
                    operator: "eq",
                    value: isBlocked === true || isBlocked === false ? isBlocked : undefined
                },
                {
                    field: 'phoneVerify',
                    operator: 'eq',
                    value: phoneVerify === true || phoneVerify === false ? phoneVerify : undefined
                },
                {
                    field: 'isActivated',
                    operator: 'eq',
                    value: isActivated === true || isActivated === false ? isActivated : undefined
                }
            )
            return filters;
        }
    });

    useEffect(() => {
        socket.emit('updateListUsers', role)

        return () => {
            socket.off('updateListUsers')
        }
    }, []);
    useEffect(() => {
        socket.on('getUsers', (data: Array<{ userId: string, socketId: string }>) => {
            setActiveUsers(data?.map((item) => item?.userId));
        })
        return () => {
            socket.off('getUsers')
        };
    }, []);


    const columns = useMemo<GridColDef<ProfileProps>[]>(
        () => [
            {
                field: "show",
                headerName: translate('table.actions'),
                disableColumnMenu: true,
                disableReorder: true,
                disableExport: true,
                sortable: false,
                renderCell: function render({row}) {
                    return <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 0.5,
                        position: 'relative'
                    }}>
                        <Tooltip
                            title={translate('actions.show')}
                            arrow
                            placement={'top'}
                        >
                            <IconButton
                                color={"success"}
                                onClick={() => navigate(`/profile/show/${row?._id}`)}
                            >
                                <Visibility/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={translate('actions.edit')}
                            arrow
                            placement={'top'}
                        >
                            <IconButton
                                color={'info'}
                                onClick={() => navigate(`/profile/edit/${row?._id}`)}
                            >
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                },
                width: 100,
                minWidth: 100
            },
            {
                field: "name",
                headerName: translate("profile.edit.name"),
                type: "string",
                width: 120
            },
            {
                field: "status",
                headerName: translate("stat.users.role"),
                renderCell: function render({row}) {
                    return <TagField value={translate(`roles.${row.status}`)}/>
                },
                width: 130,
                minWidth: 130
            },
            {
                field: "onlineStatus",
                headerName: translate("posts.fields.status.title"),
                renderCell: function render({row}) {
                    const isActive = activeUsers?.length > 0 ? activeUsers?.some(aU => aU === row?._id) : false;
                    return <Box sx={{
                        p: 1,
                        border: `1px solid ${isActive ? '#67be23' : '#fa541c'}`,
                        borderRadius: '5px',
                        display: 'flex',
                        justifyContent: mode === 'dark' ? 'start' : 'center',
                        position: 'relative',
                        width: '100%',
                        color: mode === 'light' ? '#000' : (isActive ? 'success.main' : 'error.main'),
                        bgcolor: mode === 'dark' ? 'transparent' : (isActive ? 'success.main' : 'error.main')
                    }}>
                        {translate(`stat.users.status.${isActive ? 'online' : 'offline'}`)}
                        <Box sx={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            bgcolor: isActive ? 'success.main' : 'error.main'
                        }}/>
                    </Box>
                },
                width: 110,
                minWidth: 120
            },
            {
                field: "email",
                headerName: translate("profile.email"),
                type: "string",
                width: 250,
                minWidth: 250
            },
            {
                field: "phone",
                headerName: translate("profile.edit.phone"),
                type: "string",
                width: 150,
                minWidth: 150
            },
            {
                field: "isActivated",
                headerName: translate("posts.fields.status.email.title"),
                renderCell: function render({row}) {
                    let color: ComponentProps<typeof TagField>["color"];
                    switch (row.isActivated) {
                        case true:
                            color = "success";
                            break;
                        case false:
                            color = "error";
                            break;
                        default:
                            color = "default";
                            break;
                    }
                    return <TagField value={translate(`posts.fields.status.email.${row.isActivated}`)} color={color}/>

                },
                minWidth: 200,
                flex: 0.3
            },
            {
                field: "phoneVerify",
                headerName: translate("posts.fields.status.phone.title"),
                renderCell: function render({row}) {
                    let color: ComponentProps<typeof TagField>["color"];
                    switch (row.phoneVerify) {
                        case true:
                            color = "success";
                            break;
                        case false:
                            color = "error";
                            break;
                        default:
                            color = "default";
                            break;
                    }
                    return <TagField value={translate(`posts.fields.status.phone.${row.phoneVerify}`)} color={color}/>
                },
                minWidth: 210,
                flex: 0.3
            },
        ], [activeUsers, mode]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
            }}>
                <Box sx={{
                    bgcolor: 'common.black',
                    borderRadius: '10px',
                    p: {xs: '6px 16px', md: '8px 24px'},
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: 'common.white',
                    width: 'fit-content',
                }}>
                    <Box sx={{
                        fontSize: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        "& > span:nth-of-type(1)":{
                            color: 'cornflowerblue',
                            fontSize: {xs: '18px', sm: '22px'},
                            fontWeight: 600
                        },
                    }}>
                        <CountUp end={totalUsers}/>
                        <span>{translate('all-users.title')}</span>
                    </Box>
                    <Box sx={{
                        "& svg":{
                            fontSize: {xs: '2rem', md: '2.1875rem'}
                        }
                    }}>
                        <People/>
                    </Box>
                </Box>
                <Box sx={{
                    bgcolor: 'common.black',
                    borderRadius: '10px',
                    p: {xs: '6px 16px', md: '8px 24px'},
                    display: 'flex',
                    alignItems: 'center',
                    color: 'common.white',
                    gap: 2,
                    width: 'fit-content',
                }}>
                    <Box sx={{
                        fontSize: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        "& > span:nth-of-type(1)":{
                            color: 'cornflowerblue',
                            fontSize: {xs: '18px', sm: '22px'},
                            fontWeight: 600
                        }
                    }}>
                        {/*<CountUp end={activeUsers?.length || 0} style={{*/}
                        {/*    color: 'cornflowerblue',*/}
                        {/*    fontSize: '22px',*/}
                        {/*    fontWeight: 600*/}
                        {/*}}/>*/}
                        <span>{activeUsers?.length || 0}</span>
                        <span>{translate('stat.users.status.online')}</span>
                    </Box>
                    <Box sx={{
                        "& svg":{
                            fontSize: {xs: '2rem', md: '2.1875rem'}
                        }
                    }}>
                        <CellWifiRounded/>
                    </Box>
                </Box>
            </Grid>
            <GridComponent
                filtersComponent={
                    <UserFiltersStat
                        setFilters={setFilters}
                        search={search}
                        value={value}
                        setValue={setValue}
                    />
                }
                title={translate('list.users')}
                dataGridProps={dataGridProps}
                columns={columns}
                accessResource={'dashboard/user'}
                createLink={'/dashboard/user/create'}
            />
            <Grid item xs={12}>
                <UserStat setTotal={setTotalUsers}/>
            </Grid>
        </Grid>
    );
};
export default AllUsers
