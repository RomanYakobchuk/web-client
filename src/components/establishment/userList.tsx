import {useLocation} from "react-router-dom";
import {useTable} from "@refinedev/core";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

import {FilterInstitutions} from "../index";
import {PropertyProps} from "@/interfaces/common";
import ListForUsers from "./utills/lists/listForUsers";

const UserList = () => {
    const {state} = useLocation();
    const [sortBy, setSortBy] = useState("");

    const [searchValue, setSearchValue] = useState<any>();
    // const [query, setQuery] = useSearchParams({
    //     page: '1',
    //     pageSize: '20'
    // });
    const {
        tableQueryResult: {data, isLoading, isError},
        current,
        setCurrent,
        setPageSize,
        sorters,
        pageSize,
        setSorters,
        filters,
        setFilters,
        createLinkForSyncWithLocation
    } = useTable({
        resource: "institution/all",
        pagination: {
            current: 1,
            pageSize: 20
        },
        syncWithLocation: true,
    });

    // useEffect(() => {
    //     const newLink = createLinkForSyncWithLocation({
    //         pagination: {
    //             pageSize: pageSize,
    //             current: current,
    //         },
    //         filters: filters,
    //         sorters: sorters
    //     });
    //     console.log(newLink)
    //     // navigate(`/all_institutions${newLink}`)
    // }, [filters, sorters, current, pageSize]);
    useEffect(() => {
        if (state && state?.value && state?.isTag) {
            setFilters([
                {
                    field: 'title',
                    value: '#' + state.value,
                    operator: 'contains'
                }
            ])
            setSearchValue('#' + state.value)
        }
    }, [state]);

    const allInstitutions = data?.data as PropertyProps[] ?? [] as PropertyProps[];

    // useEffect(() => {
    //     const newFilters: any = {};
    //     if (filters?.length > 0) {
    //         for (const filter of filters as LogicalFilter[]) {
    //             if (filter?.value && filter?.field) {
    //                 newFilters[filter.field] = filter.value
    //             }
    //         }
    //     }
    //     if (sorters?.length > 0) {
    //         for (const sorter of sorters) {
    //             if (sorter?.field && sorter?.order) {
    //                 newFilters['sort'] = sorter.field;
    //                 newFilters['order'] = sorter.order;
    //             }
    //         }
    //     }
    //     setQuery(newFilters)
    // }, [filters, sorters]);

    // useEffect(() => {
    //     const queryObj = Object.fromEntries(query.entries());
    //
    //     const newArrayFilters: LogicalFilter[] = [];
    //     for (const queryObjKey in queryObj) {
    //         if (queryObj.hasOwnProperty(queryObjKey)) {
    //             const fieldValue = queryObj[queryObjKey];
    //             if (queryObjKey !== 'sort' && queryObjKey !== 'order') {
    //                newArrayFilters.push({
    //                    field: queryObjKey,
    //                    value: fieldValue,
    //                    operator: 'eq'
    //                })
    //             }
    //         }
    //     }
    //     setFilters(newArrayFilters)
    //     setSorters([
    //         {
    //             field: queryObj['sort'] || '',
    //             order: queryObj['order'] as "asc" | "desc" || 'desc'
    //         }
    //     ])
    // }, []);


    // useEffect(() => {
    //     const queryObj = Object.fromEntries(query.entries());
    //
    //     const newArrayFilters: LogicalFilter[] = Object.entries(queryObj)
    //         .filter(([key]) => key !== 'sort' && key !== 'order')
    //         .map(([key, value]) => ({
    //             field: key,
    //             value,
    //             operator: 'eq'
    //         }));
    //
    //     setFilters(newArrayFilters);
    //
    //     setSorters([
    //         {
    //             field: queryObj['sort'] || '',
    //             order: queryObj['order'] as "asc" | "desc" || 'desc'
    //         }
    //     ]);
    // }, []);


    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                p: {xs: 1, sm: 0}
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Box mb={1} mt={1} width={"100%"}>
                        <FilterInstitutions
                            filters={filters}
                            setFilters={setFilters}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            setCurrent={setCurrent}
                            setSearchValue={setSearchValue}
                            sorters={sorters}
                            setSorters={setSorters}
                            searchValue={searchValue}
                        />
                    </Box>
                </Box>
            </Box>
            <ListForUsers
                isLoading={isLoading}
                allInstitutions={allInstitutions}
                data={data}
                current={current}
                setCurrent={setCurrent}
                pageSize={pageSize}
                total={data?.total as number}
                setPageSize={setPageSize}
            />
        </Box>
    );
};
export default UserList;
