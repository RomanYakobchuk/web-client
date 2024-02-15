import {
    CrudFilters,
    getDefaultFilter,
    HttpError,
    useTable,
    useTranslate
} from "@refinedev/core";
import {useDataGrid, useAutocomplete, TagField} from "@refinedev/mui";
import {
    Grid,
    Box,
    Button,
    InputAdornment,
    TextField,
    Autocomplete, IconButton
} from "@mui/material";
import {
    GridColDef, GridRowId,
} from "@mui/x-data-grid";
import {
    CalendarMonth,
    Clear,
    Edit,
    RateReview,
    SearchOutlined,
    Visibility
} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form"
import React, {useMemo, useState} from "react";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

import {IReserve, IReserveFilterVariables, PropertyProps} from "@/interfaces/common";
import GridComponent from "@/components/grid/GridComponent";
import UpdateReserveStatusTag from "@/components/capl/utills/updateReserveStatusTag";
import {GridFilter} from "@/components/grid";
import {ESTABLISHMENT} from "@/config/names";


const CaplManagerPage = () => {

    const translate = useTranslate();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState<GridRowId[]>([] as GridRowId[]);
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
        syncWithLocation: true,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const {search, establishmentStatus, userStatus, establishment, day} = params;
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
                    field: "establishmentStatus",
                    operator: 'eq',
                    value: establishmentStatus?.value !== "" ? establishmentStatus : undefined
                },
                {
                    field: "establishment",
                    operator: "eq",
                    value: establishment !== "" ? establishment : undefined
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

    const establishmentIds = dataGridProps.rows.map((item) => item._id);
    const {tableQueryResult: {data: establishmentsData, isLoading}} = useTable<PropertyProps>({
        resource: `${ESTABLISHMENT}/userestablishments`,
        queryOptions: {
            enabled: establishmentIds.length > 0
        }
    });

    const columns = useMemo<GridColDef<IReserve>[]>(
        () => [
            {
                field: "isActive",
                headerName: translate("posts.fields.status.title"),
                renderCell: function render({row}) {
                    return <Box sx={{
                        p: '3px 10px',
                        bgcolor: row?.isActive ? '#00be65' : '#ff6464',
                        color: '#010101',
                        borderRadius: '10px'
                    }}>
                        {translate(`capl.status.valid.${row?.isActive ? 'active' : 'inactive'}`)}
                    </Box>
                },
                width: 150,
                minWidth: 130,
                maxWidth: 150,
                flex: 0.3
            },
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
                        onClick={() => navigate(`/chats?firstId=${row?.user}&secondId=${row?.establishment?._id}`)}
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
                width: 140
            },
            {
                field: "date",
                headerName: translate("capl.create.date"),
                type: "dateTime",
                valueFormatter: params => dayjs(params?.value)?.format('DD/MM/YYYY HH:mm'),
                renderCell: function render({row}) {
                    return <TagField value={dayjs(row.date).format("DD/MM/YYYY HH:mm")}/>
                },
                width: 180,
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
                minWidth: 130,
                renderCell: function render({row}) {
                    return <Box sx={{
                        fontSize: '16px',
                        fontWeight: 600
                    }}>
                        {row?.numberPeople}
                    </Box>
                }
            },
            {
                field: "userStatus.value",
                headerName: translate("capl.status.userStatus"),
                renderCell: function render({row}) {
                    return <UpdateReserveStatusTag
                        defaultValue={row?.userStatus?.value}
                        id={row?._id}
                        reserve={row}
                        fieldName={this.headerName}
                        field={'userStatus'}
                    />
                },
                width: 150,
                minWidth: 170,
                maxWidth: 170,
                flex: 0.3
            },
            {
                field: "establishmentStatus.value",
                headerName: translate("capl.status.establishmentStatus"),
                renderCell: function render({row}) {
                    return <UpdateReserveStatusTag
                        defaultValue={row?.establishmentStatus?.value}
                        id={row?._id}
                        reserve={row}
                        fieldName={this.headerName}
                        field={'establishmentStatus'}
                    />
                },
                width: 150,
                minWidth: 170,
                maxWidth: 170,
                flex: 0.3
            },
        ], [establishmentsData, isLoading]
    );


    const {control, register, handleSubmit,} = useForm<IReserve, HttpError, IReserveFilterVariables>({
        refineCoreProps: {
            resource: 'capl/allByUser'
        },
        defaultValues: {
            search: getDefaultFilter("fullName", filters, "eq"),
            userStatus: getDefaultFilter("userStatus.value", filters, "eq"),
            establishmentStatus: getDefaultFilter("establishmentStatus.value", filters, "eq"),
            establishment: getDefaultFilter("establishment._id", filters, "eq")
        }
    });

    const {autocompleteProps} = useAutocomplete({
        resource: `${ESTABLISHMENT}/userestablishments`,
        defaultValue: getDefaultFilter("establishment._id", filters, "eq")
    })

    return (
        <Grid container spacing={2}>
            <GridFilter onSubmit={handleSubmit(search)}>
                <TextField
                    {...register("search")}
                    label={translate('buttons.search')}
                    placeholder={"Id, fullName, whoPay"}
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
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={"establishmentStatus"}
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
                                    label={translate("capl.status.establishmentStatus")}
                                    placeholder={translate("capl.status.establishmentStatus")}
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="establishment"
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
                                    placeholder="Search establishment"
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
                    variant="outlined"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Clear sx={{cursor: 'pointer'}} onClick={handleClearDate}/>
                            </InputAdornment>
                        ),
                        startAdornment: <InputAdornment position={'start'}><CalendarMonth/></InputAdornment>
                    }}
                />
            </GridFilter>
            <GridComponent
                filtersComponent={<Box></Box>}
                title={translate('list.capl')}
                dataGridProps={dataGridProps}
                columns={columns}
                setSelectedItems={setSelectedIds}
                accessResource={'capl'}
                createLink={'/capl/create'}
            />
        </Grid>
    );
};
export default CaplManagerPage;
