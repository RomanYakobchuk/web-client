import {
    CrudFilters,
    getDefaultFilter,
    HttpError,
    useDelete,
    useGetIdentity,
    useLink,
    useTable,
    useTranslate
} from "@refinedev/core";
import {useLocation, useNavigate} from "react-router-dom";
import React, {ComponentProps, useContext, useEffect, useMemo, useState} from "react";
import {useDebounce} from "use-debounce";
import {CreateButton, List, TagField, useAutocomplete, useDataGrid} from "@refinedev/mui";
import {DataGrid, GridColumns} from "@mui/x-data-grid";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent, Chip,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip
} from "@mui/material";
import {Check, Clear, Close, Delete, Edit, OpenInNew, Person, SearchOutlined, Visibility} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";

import {
    IGetIdentity,
    INews,
    INewsFilterVariables,
    IPropertyPropsFilterVariables,
    ProfileProps,
    PropertyProps
} from "../../interfaces/common";
import {CustomAccordion} from "../index";
import dayjs from "dayjs";
import {useMobile} from "../../hook";

const AdminList = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const Link = useLink();
    const {width} = useMobile();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;

    const [value, setValue] = useState('');
    const [debouncedSearchText] = useDebounce(value, 500);
    const [byTag, setByTag] = useState(false);
    const [dateEventGte, setDateEventGte] = useState<Date | null>(null);
    const [dateEventLte, setDateEventLte] = useState<Date | null>(null);

    const options = [
        {
            value: "published",
            title: translate('posts.fields.status.published')
        },
        {
            value: "draft",
            title: translate('capl.status.draft')
        },
        {
            value: "rejected",
            title: translate('capl.status.rejected')
        }
    ];
    const categoryOptions = [
        {
            value: 'general',
            title: translate('news.sortByCategory.general')
        },
        {
            value: 'event',
            title: translate('news.sortByCategory.events')
        },
        {
            value: 'promotions',
            title: translate('news.sortByCategory.promotions')
        },
    ]

    const {dataGridProps, filters, setFilters, search} = useDataGrid<
        INews, HttpError, INewsFilterVariables
    >({
        resource: `news/all`,
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const {title, category, date_event_lte, date_event_gte, institution, status} = params;

            filters.push(
                {
                    field: "date_event",
                    operator: 'gte',
                    value: dateEventGte ? dateEventGte : undefined
                },
                {
                    field: "date_event",
                    operator: 'lte',
                    value: dateEventLte ? dateEventLte : undefined
                },
                {
                    field: "institution",
                    operator: "eq",
                    value: institution ? institution : undefined
                },
                {
                    field: "category",
                    operator: "eq",
                    value: category ? category : undefined
                },
                {
                    field: "title",
                    operator: "contains",
                    value: title ? title : undefined
                },
                {
                    field: 'status',
                    operator: 'eq',
                    value: status ? status : undefined
                }
            )
            return filters;
        }
    });
    const institutionsIds = dataGridProps.rows.map((item) => item._id);
    const {tableQueryResult: {data: institutionsData, isLoading}} = useTable<PropertyProps>({
        resource: 'institution/userInstitutions',
        queryOptions: {
            enabled: institutionsIds.length > 0
        }
    });

    const columns = useMemo<GridColumns<INews>>(
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
                                onClick={() => navigate(`/news/show/${row?._id}`)}
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
                                onClick={() => navigate(`/news/edit/${row?._id}`)}
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
                field: "title",
                headerName: translate("home.create.name"),
                type: "string",
                width: 120
            },
            {
                field: "category",
                headerName: translate("posts.fields.category.title"),
                renderCell: function render({row}) {
                    return <TagField value={translate(`news.sortByCategory.${row.category}`)}/>
                },
                width: 120,
                minWidth: 120
            },
            {
                field: "status",
                headerName: translate("posts.fields.status.title"),
                renderCell: function render({row}) {
                    let color: ComponentProps<typeof TagField>["color"];
                    switch (row.status) {
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
                    return <TagField value={translate(`posts.fields.status.${row.status}`)} color={color}/>
                },
                minWidth: 130,
                flex: 0.3
            },
            {
                field: "dateEvent",
                headerName: translate("news.dateEvent.title"),
                renderCell: function render({row}) {
                    return <Box>{dayjs(row.dateEvent[0]!.schedule?.from).format('DD-MM-YYYY')}</Box>
                },
                width: 130
            },
            {
                field: 'institution._id',
                headerName: translate('home.one'),
                renderCell: function render({row}) {
                    return <IconButton onClick={() => navigate(`/all_institutions/show/${row.institutionId}`)}>
                        <OpenInNew/>
                    </IconButton>
                },
                sortable: false
            },
            {
                field: 'owner',
                headerName: translate('home.owner'),
                renderCell: function render({row}) {
                    return <IconButton
                        onClick={() => {
                            if (user?._id === row.createdBy) {
                                navigate(`/profile`)
                                return;
                            } else {
                                navigate(`/profile/show/${row.createdBy}`)
                                return;
                            }
                        }}
                    >
                        <Person/>
                    </IconButton>
                },
                sortable: false,
                width: 100
            }
        ], [institutionsData, isLoading]
    );


    const {control, register, handleSubmit} = useForm<INews, HttpError, INewsFilterVariables>({
        refineCoreProps: {
            resource: 'news/all'
        },
        defaultValues: {
            title: getDefaultFilter("title", filters, "contains"),
        }
    });

    const {autocompleteProps} = useAutocomplete({
        resource: "institution/userInstitutions",
        defaultValue: getDefaultFilter("institution._id", filters, "eq")
    })

    useEffect(() => {
        setFilters(
            [
                {
                    field: 'title',
                    operator: 'contains',
                    value: debouncedSearchText
                },
            ]
        )
    }, [debouncedSearchText]);

    const {state: locationState} = useLocation();
    const [state, setState] = useState<any>(locationState ?? "");

    useEffect(() => {
        if (state.value && state.isTag) {
            setByTag(true)
            setValue(state.value)
        }
    }, [state]);

    const handleClearDateLte = () => {
        setDateEventLte(null);
    };

    const handleClearDateGte = () => {
        setDateEventGte(null);
    };


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
                                    name="institution"
                                    render={({field}) => (
                                        <Autocomplete
                                            {...autocompleteProps}
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value?._id ?? value);
                                            }}
                                            color={'secondary'}
                                            value={field?.value || null}
                                            getOptionLabel={(item) => {
                                                return item.title
                                                    ? item.title
                                                    : autocompleteProps?.options?.find(
                                                    (p) =>
                                                        p._id.toString() ===
                                                        item.toString(),
                                                )?.title ?? "";
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                value === undefined ||
                                                option?._id?.toString() ===
                                                (value?._id ?? value)?.toString()
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    color={'secondary'}
                                                    label={translate("home.one")}
                                                    placeholder="Search institution"
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
                                    name={"status"}
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
                                    name={"category"}
                                    render={({field}) => (
                                        <Autocomplete
                                            options={categoryOptions as any}
                                            {...field}
                                            color={'secondary'}
                                            onChange={(_, value: any) => {
                                                field.onChange(value?.value ?? value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.title
                                                    ? item.title
                                                    : categoryOptions?.find(
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
                                                    label={translate("posts.fields.category.title")}
                                                    placeholder={translate("posts.fields.category.title")}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                {/*<Controller*/}
                                {/*    control={control}*/}
                                {/*    name="user"*/}
                                {/*    render={({field}) => (*/}
                                {/*        <Autocomplete*/}
                                {/*            {...autocompleteProps}*/}
                                {/*            {...field}*/}
                                {/*            onChange={(_, value) => {*/}
                                {/*                field.onChange(value?.name ?? value);*/}
                                {/*            }}*/}
                                {/*            color={'secondary'}*/}
                                {/*            value={field?.value || null}*/}
                                {/*            getOptionLabel={(item) => {*/}
                                {/*                return item.name*/}
                                {/*                    ? item.name*/}
                                {/*                    : autocompleteProps?.options?.find(*/}
                                {/*                    (p) =>*/}
                                {/*                        p.name.toString() ===*/}
                                {/*                        item.toString(),*/}
                                {/*                )?.title ?? "";*/}
                                {/*            }}*/}
                                {/*            isOptionEqualToValue={(option, value) =>*/}
                                {/*                value === undefined ||*/}
                                {/*                option?.name?.toString() ===*/}
                                {/*                (value?.name ?? value)?.toString()*/}
                                {/*            }*/}
                                {/*            renderInput={(params) => (*/}
                                {/*                <TextField*/}
                                {/*                    {...params}*/}
                                {/*                    color={'secondary'}*/}
                                {/*                    label={translate("home.create.city")}*/}
                                {/*                    placeholder="Search city"*/}
                                {/*                    margin="normal"*/}
                                {/*                    variant="outlined"*/}
                                {/*                    size="small"*/}
                                {/*                />*/}
                                {/*            )}*/}
                                {/*        />*/}
                                {/*    )}*/}
                                {/*/>*/}

                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    width: '100%',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <TextField
                                        fullWidth
                                        value={dateEventGte ? dateEventGte.toISOString().split('T')[0] : ''}
                                        onChange={(e) => setDateEventGte(new Date(e.target.value))}
                                        color={'secondary'}
                                        label={translate("capl.create.date")}
                                        placeholder="Date"
                                        type={"date"}
                                        margin="normal"
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Clear sx={{cursor: 'pointer'}} onClick={handleClearDateGte}/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        value={dateEventLte ? dateEventLte.toISOString().split('T')[0] : ""}
                                        onChange={(e) => setDateEventLte(new Date(e.target.value))}
                                        color={'secondary'}
                                        label={translate("capl.create.date")}
                                        placeholder="Date"
                                        type={"date"}
                                        margin="normal"
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Clear sx={{cursor: 'pointer'}} onClick={handleClearDateLte}/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%'
                    }}>
                        <Chip
                            sx={{
                                width: '80px',
                                transition: '300ms linear',
                                fontSize: '18px',
                                "&:hover": {
                                    bgcolor: '#4a48a4',
                                    color: '#fff'
                                }
                            }}
                            component={Link}
                            onClick={() => setByTag(!byTag)}
                            color={byTag ? 'default' : 'info'}
                            clickable
                            variant={'filled'}
                            label={translate("home.sortByType.all")}
                        />
                        <Chip
                            sx={{
                                width: '80px',
                                transition: '300ms linear',
                                fontSize: '18px',
                                "&:hover": {
                                    bgcolor: '#4a48a4',
                                    color: '#fff'
                                }
                            }}
                            component={Link}
                            onClick={() => setByTag(!byTag)}
                            color={byTag ? 'info' : 'default'}
                            clickable
                            variant={'filled'}
                            label={translate("home.tags")}
                        />
                    </Box>
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
                    title={translate('list.news')}
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
export default AdminList
