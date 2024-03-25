import {
    CrudFilters,
    HttpError,
    useTable,
    useTranslate
} from "@refinedev/core";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {TagField, useDataGrid} from "@refinedev/mui";
import {GridColDef} from "@mui/x-data-grid";
import {
    Box,
    Grid,
    IconButton, Tooltip
} from "@mui/material";
import {Edit, Person, Visibility} from "@mui/icons-material";
import {useDebounce} from "use-debounce";

import {
    ICity,
    IPropertyPropsFilterVariables,
    IEstablishment
} from "@/interfaces/common";
import EstablishmentFiltersStat from "../../properties/establishment/establishmentFiltersStat";
import EstablishmentStat from "../../properties/establishment/establishmentStat";
import {CREATE, EDIT, ESTABLISHMENT, SHOW} from "@/config/names";
import GridComponent from "@/components/grid/GridComponent";
import {EditUpdateStatus} from "@/components";
import {useUserInfo} from "@/hook";

const AdminEstablishmentTable = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {user} = useUserInfo();
    const [value, setValue] = useState('');
    const [debouncedSearchText] = useDebounce(value, 500);
    const [byTag, setByTag] = useState(false);
    const [averageCheckGte, setAverageCheckGte] = useState<number>(0);
    const [averageCheckLte, setAverageCheckLte] = useState<number>(2000);

    const {dataGridProps, filters, setFilters, search} = useDataGrid<
        IEstablishment, HttpError, IPropertyPropsFilterVariables
    >({
        resource: `${ESTABLISHMENT}/all`,
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

    const columns = useMemo<GridColDef<IEstablishment>[]>(
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
                                onClick={() => navigate(`/${ESTABLISHMENT}/${SHOW}/${row?._id}`)}
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
                                onClick={() => navigate(`/${ESTABLISHMENT}/${EDIT}/${row?._id}`)}
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
                width: 200
            },
            {
                field: "type",
                headerName: translate("home.create.type.title"),
                renderCell: function render({row}) {
                    return <TagField value={translate(`home.create.type.${row.type}`)}/>
                },
                width: 150,
                minWidth: 150
            },
            {
                field: "verify",
                headerName: translate("posts.fields.status.title"),
                renderCell: function render({row}) {
                    return <EditUpdateStatus establishment={row}/>
                },
                minWidth: 150,
                flex: 0.3
            },
            {
                field: "averageCheck",
                headerName: translate("home.create.averageCheck"),
                type: "number",
                width: 160
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
                align: 'center',
                sortable: false,
                width: 100
            },
            {
                field: 'viewsContainer.viewsNumber',
                headerName: translate('views.title'),
                renderCell: function render({row}) {
                    return <>{row?.viewsContainer?.viewsNumber}</>
                },
                minWidth: 150,
                width: 150,
                align: 'center',
                sortable: false
            }
        ], [citiesData, isLoading]
    );

    useEffect(() => {
        setFilters(
            [
                {
                    field: 'title',
                    operator: 'contains',
                    value: value
                }
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

    return (
        <Grid container spacing={2}>
            <GridComponent
                filtersComponent={
                    <EstablishmentFiltersStat
                        filters={filters}
                        setFilters={setFilters}
                        value={value}
                        setAverageCheckGte={setAverageCheckGte}
                        search={search}
                        setAverageCheckLte={setAverageCheckLte}
                        averageCheckLte={averageCheckLte}
                        averageCheckGte={averageCheckGte}
                        setValue={setValue}
                    />
                }
                title={translate('list.establishment')}
                dataGridProps={dataGridProps}
                columns={columns}
                accessResource={`${ESTABLISHMENT}`}
                createLink={`/${ESTABLISHMENT}/${CREATE}`}
            />
            <Grid item xs={12}>
                <Grid item xs={12} sm={6}>
                    <EstablishmentStat/>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default AdminEstablishmentTable
