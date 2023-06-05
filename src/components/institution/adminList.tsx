import {
    CrudFilters,
    getDefaultFilter,
    HttpError,
    useDelete, useGetIdentity,
    useLink,
    useTable,
    useTranslate
} from "@refinedev/core";
import {useLocation, useNavigate} from "react-router-dom";
import React, {ComponentProps, useContext, useEffect, useMemo, useState} from "react";
import {CreateButton, List, TagField, useAutocomplete, useDataGrid} from "@refinedev/mui";
import {DataGrid, GridColumns} from "@mui/x-data-grid";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    TextField, Tooltip
} from "@mui/material";
import {Autorenew, Cancel, Check, Close, Delete, Edit, Person, SearchOutlined, Visibility} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";

import {CustomAccordion} from "../index";
import {
    ICity,
    IPropertyPropsFilterVariables, ProfileProps,
    PropertyProps
} from "../../interfaces/common";
import {useDebounce} from "use-debounce";
import {ColorModeContext} from "../../contexts";
import {useMobile} from "../../utils";

const AdminList = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const Link = useLink();
    const {width} = useMobile();
    const {data: user} = useGetIdentity<ProfileProps>();

    const [value, setValue] = useState('');
    const [debouncedSearchText] = useDebounce(value, 500);
    const [byTag, setByTag] = useState(false);
    const [averageCheckGte, setAverageCheckGte] = useState<number>(0);
    const [averageCheckLte, setAverageCheckLte] = useState<number>(2000);

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

    const typeOptions = [
        {
            value: 'bar',
            title: translate('home.sortByType.bar')
        },
        {
            value: 'cafe',
            title: translate('home.sortByType.cafe')
        },
        {
            value: 'restaurant',
            title: translate('home.sortByType.restaurant')
        },
    ]

    const {dataGridProps, filters, setFilters, search} = useDataGrid<
        PropertyProps, HttpError, IPropertyPropsFilterVariables
    >({
        resource: `institution/all`,
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const {city, type, verify, averageCheck_gte, averageCheck_lte} = params;

            filters.push(
                {
                    field: "averageCheck",
                    operator: 'gte',
                    value: averageCheckGte ? averageCheckGte : undefined
                },
                {
                    field: "averageCheck",
                    operator: 'lte',
                    value: averageCheckLte ? averageCheckLte : undefined
                },
                {
                    field: "city",
                    operator: "contains",
                    value: city ? city : undefined
                },
                {
                    field: "type",
                    operator: "eq",
                    value: type ? type : undefined
                },
                {
                    field: 'verify',
                    operator: 'eq',
                    value: verify ? verify : undefined
                }
            )
            return filters;
        }
    });
    const citiesIds = dataGridProps.rows.map((item) => item._id);
    const {tableQueryResult: {data: citiesData, isLoading}} = useTable<ICity>({
        resource: 'city/all',
        queryOptions: {
            enabled: citiesIds.length > 0
        }
    });

    const columns = useMemo<GridColumns<PropertyProps>>(
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
                                onClick={() => navigate(`/all_institutions/show/${row?._id}`)}
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
                                onClick={() => navigate(`/all_institutions/edit/${row?._id}`)}
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
                field: "type",
                headerName: translate("home.create.type.title"),
                renderCell: function render({row}) {
                    return <TagField value={translate(`home.create.type.${row.type}`)}/>
                },
                width: 120,
                minWidth: 120
            },
            {
                field: "verify",
                headerName: translate("posts.fields.status.title"),
                renderCell: function render({row}) {
                    let color: ComponentProps<typeof TagField>["color"];
                    switch (row.verify) {
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
                    return <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TagField value={translate(`posts.fields.status.${row.verify}`)} color={color}/>
                        <IconButton onClick={() => navigate(`/all_institutions/updateStatus/${row._id}`)}>
                            <Autorenew/>
                        </IconButton>
                    </Box>
                },
                minWidth: 150,
                flex: 0.3
            },
            {
                field: "averageCheck",
                headerName: translate("home.create.averageCheck"),
                type: "number",
                width: 120
            },
            {
                field: 'place.city',
                headerName: translate('home.create.city'),
                renderCell: function render({row}) {
                    return <>{row?.place?.city}</>
                },
                type: "string",
                width: 200,
                minWidth: 170
            },
            {
                field: 'user',
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
            },
            {
                field: 'views',
                headerName: translate('views.title'),
                renderCell: function render({row}) {
                    return <>{row?.views?.viewsNumber}</>
                },
                minWidth: 80,
                width: 100,
                sortable: false
            }
        ], [citiesData, isLoading]
    );

    const {control, register, handleSubmit} = useForm<PropertyProps, HttpError, IPropertyPropsFilterVariables>({
        refineCoreProps: {
            resource: 'institution/all'
        },
        defaultValues: {
            city: getDefaultFilter("city", filters, "eq"),
            title: getDefaultFilter("title", filters, "contains"),
            type: getDefaultFilter("type", filters, "eq"),
            averageCheck_gte: getDefaultFilter('averageCheck', filters, "gte"),
            averageCheck_lte: getDefaultFilter('averageCheck', filters, "lte"),
        }
    });

    const {autocompleteProps} = useAutocomplete({
        resource: "city/all",
        defaultValue: getDefaultFilter("city", filters, "eq")
    });

    useEffect(() => {
        if (byTag) {
            setFilters(
                [
                    {
                        field: 'tag',
                        operator: 'contains',
                        value: debouncedSearchText
                    },
                    {
                        field: 'title',
                        operator: 'contains',
                        value: ''
                    }
                ]
            )
        } else {
            setFilters(
                [
                    {
                        field: 'title',
                        operator: 'contains',
                        value: debouncedSearchText
                    },
                    {
                        field: 'tag',
                        operator: 'contains',
                        value: ''
                    }
                ]
            )
        }
    }, [debouncedSearchText, byTag]);

    const {state: locationState} = useLocation();
    const [state, setState] = useState<any>(locationState ?? "");

    useEffect(() => {
        if (state.value && state.isTag) {
            setByTag(true)
            setValue(state.value)
        }
    }, [state]);


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
                                    name="type"
                                    render={({field}) => (
                                        <Autocomplete
                                            options={typeOptions as any}
                                            {...field}
                                            color={'secondary'}
                                            onChange={(_, value: any) => {
                                                field.onChange(value?.value ?? value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.title
                                                    ? item.title
                                                    : typeOptions?.find(
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
                                                    label={translate("home.sortByType.browse")}
                                                    placeholder={translate("home.sortByType.browse")}
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
                                    name="verify"
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
                                    name="city"
                                    render={({field}) => (
                                        <Autocomplete
                                            {...autocompleteProps}
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value?.name ?? value);
                                            }}
                                            color={'secondary'}
                                            value={field?.value || null}
                                            getOptionLabel={(item) => {
                                                return item.name
                                                    ? item.name
                                                    : autocompleteProps?.options?.find(
                                                    (p) =>
                                                        p.name.toString() ===
                                                        item.toString(),
                                                )?.name ?? "";
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                value === undefined ||
                                                option?.name?.toString() ===
                                                (value?.name ?? value)?.toString()
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    color={'secondary'}
                                                    label={translate("home.create.city")}
                                                    placeholder="Search city"
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />

                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    width: '100%',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <TextField
                                        fullWidth
                                        value={averageCheckGte ? averageCheckGte : 0}
                                        onChange={(e) => setAverageCheckGte(Number(e.target.value))}
                                        color={'secondary'}
                                        label={translate("capl.create.date")}
                                        placeholder="Date"
                                        type={"number"}
                                        margin="normal"
                                        variant="outlined"
                                        size="small"
                                    />

                                    <TextField
                                        fullWidth
                                        value={averageCheckLte ? averageCheckLte : 2000}
                                        onChange={(e) => setAverageCheckLte(Number(e.target.value))}
                                        color={'secondary'}
                                        label={translate("capl.create.date")}
                                        placeholder="Date"
                                        type={"number"}
                                        margin="normal"
                                        variant="outlined"
                                        size="small"
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
                    title={translate('list.institution')}
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
