import {
    CrudFilters,
    HttpError,
    useTranslate
} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import React, {ComponentProps, useEffect, useMemo, useState} from "react";
import {useDebounce} from "use-debounce";
import {CreateButton, List, TagField, useDataGrid} from "@refinedev/mui";
import {DataGrid, GridColumns} from "@mui/x-data-grid";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip
} from "@mui/material";
import { Edit, SearchOutlined, Visibility} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";

import {
    IProfilePropsFilterVariables,
    ProfileProps,
} from "../../interfaces/common";
import {CustomAccordion} from "../../components";
import {useMobile} from "../../utils";

const AllUsers = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {width} = useMobile();

    const [value, setValue] = useState('');
    const [debouncedSearchText] = useDebounce(value, 500);

    const options = [
        {
            value: "user",
            title: translate('roles.user')
        },
        {
            value: "admin",
            title: translate('roles.admin')
        },
        {
            value: "manager",
            title: translate('roles.manager')
        }
    ];
    const stateOptions = (type: string) => [
        {
            value: true,
            title: translate(`posts.fields.status.${type}.true`)
        },
        {
            value: false,
            title: translate(`posts.fields.status.${type}.false`)
        }
    ];


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
        setFilters([
            {
                field: 'title',
                operator: 'contains',
                value: debouncedSearchText
            }
        ])
    }, [debouncedSearchText])

    const columns = useMemo<GridColumns<ProfileProps>>(
        () => [
            {
                field: "show",
                headerName: "",
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
                field: "email",
                headerName: translate("profile.email"),
                type: "string",
                width: 170,
                minWidth: 170
            },
            {
                field: "phone",
                headerName: translate("profile.edit.phone"),
                type: "string",
                width: 150,
                minWidth: 150
            },
            {
                field: "status",
                headerName: translate("posts.fields.status.title"),
                renderCell: function render({row}) {
                    return <TagField value={translate(`roles.${row.status}`)}/>
                },
                width: 130,
                minWidth: 130
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
                minWidth: 150,
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
                minWidth: 150,
                flex: 0.3
            },
        ], []);

    const {control, handleSubmit} = useForm<ProfileProps, HttpError, IProfilePropsFilterVariables>({
        refineCoreProps: {
            resource: 'users/findUserByQuery'
        },
    });


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomAccordion title={translate("buttons.filter")} id={'capl-filter'}>
                    <Card sx={{
                        width: '100%',
                        paddingX: {xs: 2, md: 0}
                    }}>
                        <CardContent sx={{pt: 0}}>
                            <Box
                                component={"form"}
                                sx={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    width: '100%',
                                    maxWidth: '550px',
                                    margin: '0 auto'
                                }}
                                autoComplete="off"
                                onSubmit={handleSubmit(search)}
                            >
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({field}) => (
                                        <Autocomplete
                                            options={options as any}
                                            {...field}
                                            color={'secondary'}
                                            onChange={(_, value: any) => {
                                                field.onChange(value?.value ?? value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.title
                                                    ? item.title
                                                    : options?.find(
                                                    (p) =>
                                                        p.value === item
                                                )?.title ?? "";
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                return value === undefined ||
                                                    option?.value === value
                                            }
                                            }
                                            value={field?.value || null}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    color={'secondary'}
                                                    label={translate("posts.fields.status.title")}
                                                    placeholder={translate("posts.fields.status.title")}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="isActivated"
                                    render={({field}) => (
                                        <Autocomplete
                                            options={stateOptions('email') as any}
                                            {...field}
                                            color={'secondary'}
                                            onChange={(_, value: any) => {
                                                field.onChange(value?.value === true || value?.value === false ? value?.value : value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.title
                                                    ? item.title
                                                    : stateOptions('email')?.find(
                                                    (p) =>
                                                        p.value === item
                                                )?.title ?? "";
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                return value === undefined ||
                                                    option?.value === value
                                            }
                                            }
                                            value={field?.value === true || field?.value === false ? field?.value : null}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    color={'secondary'}
                                                    label={translate("posts.fields.status.email.title")}
                                                    placeholder={translate("posts.fields.status.email.title")}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="phoneVerify"
                                    render={({field}) => (
                                        <Autocomplete
                                            options={stateOptions('phone') as any}
                                            {...field}
                                            color={'secondary'}
                                            onChange={(_, value: any) => {
                                                field.onChange(value?.value === true || value?.value === false ? value?.value : value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.title
                                                    ? item.title
                                                    : stateOptions('phone')?.find(
                                                    (p) =>
                                                        p.value === item
                                                )?.title ?? "";
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                return value === undefined ||
                                                    option?.value === value
                                            }
                                            }
                                            value={field?.value === true || field?.value === false ? field?.value : null}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    color={'secondary'}
                                                    label={translate("posts.fields.status.phone.title")}
                                                    placeholder={translate("posts.fields.status.phone.title")}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <br/>
                                <Button type="submit" variant="contained">
                                    {translate("buttons.search")}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </CustomAccordion>
                <Box>
                    <TextField
                        value={value ?? ''}
                        onChange={(event) => {
                            setValue(event.target.value)
                        }}
                        label={translate('buttons.search')}
                        placeholder={"Id, fullName, whoPay"}
                        margin="normal"
                        fullWidth
                        autoFocus
                        color={'secondary'}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlined/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <List
                    createButtonProps={{
                        color: 'success'
                    }}
                    headerButtons={[
                        <CreateButton
                            hideText={width < 500}
                            color={'success'}
                            key={'create-button'}
                        />
                    ]}
                    title={translate('list.users')}
                >
                    <DataGrid
                        {...dataGridProps}
                        columns={columns}
                        getRowId={row => row._id}
                        disableColumnFilter={true}
                        filterModel={undefined}
                        autoHeight
                        rowsPerPageOptions={[10, 20, 50, 100]}
                    />
                </List>
            </Grid>
        </Grid>
    );
};
export default AllUsers
