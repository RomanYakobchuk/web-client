import {
    CrudFilters,
    getDefaultFilter,
    HttpError,
    useTable,
    useTranslate
} from "@refinedev/core";
import {useDataGrid, List, useAutocomplete, TagField, CreateButton} from "@refinedev/mui";
import {
    Grid,
    Box,
    Button,
    Card,
    CardContent,
    InputAdornment,
    TextField,
    Autocomplete, IconButton
} from "@mui/material";
import {DataGrid, GridColumns} from "@mui/x-data-grid";
import {Clear, Edit, RateReview, SearchOutlined, Visibility} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form"
import {ComponentProps, useMemo, useState} from "react";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

import {IReserve, IReserveFilterVariables, PropertyProps} from "../../interfaces/common";
import {CustomAccordion} from "../index";
import {useMobile} from "../../hook";


const ManagerList = () => {

    const translate = useTranslate();
    const navigate = useNavigate();
    const {width} = useMobile();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleClearDate = () => {
        setSelectedDate(null);
    };
    const options = [
        {
            value: "accepted",
            title: translate('capl.status.accepted')
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

    const {dataGridProps, filters, search} = useDataGrid<
        IReserve, HttpError, IReserveFilterVariables
    >({
        resource: `capl/allByUser`,
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const {search, institutionStatus, userStatus, institution, day} = params;

            filters.push(
                {
                    field: "search",
                    operator: "eq",
                    value: search
                },
                {
                    field: "userStatus",
                    operator: 'eq',
                    value: userStatus?.value !== "" ? userStatus : undefined
                },
                {
                    field: "institutionStatus",
                    operator: 'eq',
                    value: institutionStatus?.value !== "" ? institutionStatus : undefined
                },
                {
                    field: "institution",
                    operator: "eq",
                    value: institution !== "" ? institution : undefined
                },
                {
                    field: 'day',
                    operator: "gte",
                    value: selectedDate ? selectedDate : undefined
                }
            )
            return filters;
        }
    });

    const institutionIds = dataGridProps.rows.map((item) => item._id);
    const {tableQueryResult: {data: institutionsData, isLoading}} = useTable<PropertyProps>({
        resource: 'institution/userInstitutions',
        queryOptions: {
            enabled: institutionIds.length > 0
        }
    });

    const columns = useMemo<GridColumns<IReserve>>(
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
                        <IconButton
                            color={"success"}
                            onClick={() => navigate(`/capl/show/${row?._id}`)}
                        >
                            <Visibility/>
                        </IconButton>
                        <IconButton
                            color={'info'}
                            onClick={() => navigate(`/capl/edit/${row?._id}`)}
                        >
                            <Edit/>
                        </IconButton>
                    </Box>
                },
                width: 100,
                minWidth: 100
            },
            {
                field: 'written',
                headerName: translate('capl.list.write'),
                renderCell: function render({row}) {
                    return <IconButton
                        disabled={!row?.writeMe}
                        sx={{
                            m: 'auto'
                        }}
                        onClick={() => navigate(`/chats?firstId=${row?.user}&secondId=${row?.institution?._id}`)}
                    >
                        <RateReview/>
                    </IconButton>
                },
                sortable: false,
                width: 80,
                minWidth: 80
            },
            {
                field: "fullName",
                headerName: translate("capl.create.fullName"),
                type: "string",
                width: 120
            },
            {
                field: "date",
                headerName: translate("capl.create.date"),
                type: "dateTime",
                renderCell: function render({row}) {
                    return <TagField value={dayjs(row.date).format("DD/MM/YYYY HH:mm")}/>
                },
                width: 150,
                minWidth: 130
            },
            {
                field: "desiredAmount",
                headerName: translate("capl.create.desiredAmount"),
                type: "number",
                width: 180,
                minWidth: 160
            },
            {
                field: "numberPeople",
                headerName: translate("capl.create.numberPeople"),
                type: "number",
                width: 130,
                minWidth: 130
            },
            {
                field: "userStatus.value",
                headerName: translate("capl.status.userStatus"),
                renderCell: function render({row}) {
                    let color: ComponentProps<typeof TagField>["color"];
                    switch (row.userStatus.value) {
                        case "accepted":
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
                    return <TagField value={translate(`capl.status.${row.userStatus.value}`)} color={color}/>
                },
                width: 130,
                minWidth: 100,
                flex: 0.3
            },
            {
                field: "institutionStatus.value",
                headerName: translate("capl.status.institutionStatus"),
                renderCell: function render({row}) {
                    let color: ComponentProps<typeof TagField>["color"];
                    switch (row.institutionStatus.value) {
                        case "accepted":
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
                    return <TagField value={translate(`capl.status.${row.institutionStatus.value}`)} color={color}/>
                },
                width: 130,
                minWidth: 100,
                flex: 0.3
            },
        ], [institutionsData, isLoading]
    );


    const {control, register, handleSubmit} = useForm<IReserve, HttpError, IReserveFilterVariables>({
        refineCoreProps: {
            resource: 'capl/allByUser'
        },
        defaultValues: {
            search: getDefaultFilter("fullName", filters, "eq"),
            userStatus: getDefaultFilter("userStatus.value", filters, "eq"),
            institutionStatus: getDefaultFilter("institutionStatus.value", filters, "eq"),
            institution: getDefaultFilter("institution._id", filters, "eq")
        }
    });

    const {autocompleteProps} = useAutocomplete({
        resource: "institution/userInstitutions",
        defaultValue: getDefaultFilter("institution._id", filters, "eq")
    })

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
                                <TextField
                                    {...register("search")}
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
                                <Controller
                                    control={control}
                                    name={"userStatus"}
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
                                                    label={translate("capl.status.userStatus")}
                                                    placeholder={translate("capl.status.userStatus")}
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
                                    name={"institutionStatus"}
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
                                            }}
                                            value={field?.value || null}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    color={'secondary'}
                                                    label={translate("capl.status.institutionStatus")}
                                                    placeholder={translate("capl.status.institutionStatus")}
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

                                <TextField
                                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
                                                <Clear sx={{cursor: 'pointer'}} onClick={handleClearDate}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <br/>
                                <Button type="submit" variant="contained">
                                    {translate("buttons.search")}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </CustomAccordion>
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
                    title={translate('list.capl')}
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
export default ManagerList
