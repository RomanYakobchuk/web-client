import {
    CrudFilters,
    HttpError,
    useTable,
    useTranslate
} from "@refinedev/core";
import {useLocation, useNavigate} from "react-router-dom";
import React, {ComponentProps, useEffect, useMemo, useState} from "react";
import {useDebounce} from "use-debounce";
import {TagField, useDataGrid} from "@refinedev/mui";
import {GridColDef} from "@mui/x-data-grid";
import {
    Box,
    Grid,
    IconButton,
    Tooltip
} from "@mui/material";
import {Edit, OpenInNew, Person, Visibility} from "@mui/icons-material";

import {
    INews,
    INewsFilterVariables,
    PropertyProps
} from "@/interfaces/common";
import dayjs from "dayjs";
import {GridComponent} from "@/components/grid";
import {useUserInfo} from "@/hook";
import NewsStat from "@/dashboard/properties/news/newsStat";
import NewsFiltersStat from "@/dashboard/properties/news/newsFiltersStat";
import {ESTABLISHMENT, SHOW} from "@/config/names";

const AdminList = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {user} = useUserInfo();

    const [value, setValue] = useState('');
    const [debouncedSearchText] = useDebounce(value, 500);
    const [dateEventGte, setDateEventGte] = useState<Date | null>(null);
    const [dateEventLte, setDateEventLte] = useState<Date | null>(null);

    const {dataGridProps, filters, setFilters, search} = useDataGrid<
        INews, HttpError, INewsFilterVariables
    >({
        resource: `news/all`,
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const {title, category, date_event_lte, date_event_gte, establishment, status} = params;

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
                    field: "establishment",
                    operator: "eq",
                    value: establishment ? establishment : undefined
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
    const establishmentsIds = dataGridProps.rows.map((item) => item._id);
    const {tableQueryResult: {data: establishmentsData, isLoading}} = useTable<PropertyProps>({
        resource: `${ESTABLISHMENT}/userestablishments`,
        queryOptions: {
            enabled: establishmentsIds.length > 0
        }
    });

    const columns = useMemo<GridColDef<INews>[]>(
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
                field: 'establishment._id',
                headerName: translate('home.one'),
                renderCell: function render({row}) {
                    const {_id: establishmentId} = row.establishmentId as PropertyProps;
                    return <IconButton onClick={() => navigate(`/${ESTABLISHMENT}/${SHOW}/${establishmentId}`)}>
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
        ], [establishmentsData, isLoading]
    );

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
            setValue(state.value)
        }
    }, [state]);

    return (
        <Grid container spacing={2}>
            <GridComponent
                filtersComponent={
                    <NewsFiltersStat
                        value={value}
                        setFilters={setFilters}
                        filters={filters}
                        setValue={setValue}
                        setDateEventGte={setDateEventGte}
                        search={search}
                        setDateEventLte={setDateEventLte}
                        dateEventGte={dateEventGte}
                        dateEventLte={dateEventLte}
                    />
                }
                title={translate('list.news')}
                dataGridProps={dataGridProps}
                columns={columns}
                accessResource={'news'}
                createLink={'/news/create'}
            />
            <Grid item xs={12}>
                <Grid item xs={12} sm={6}>
                    <NewsStat/>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default AdminList
