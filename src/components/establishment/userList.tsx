import {HttpError, useTable} from "@refinedev/core";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";

import {FilterEstablishments} from "../index";
import {PropertyProps} from "@/interfaces/common";
import ListForUsers from "./utills/lists/listForUsers";
import {ESTABLISHMENT} from "@/config/names";
import {FullPageLoading} from "@/components/loading/fullPageLoading";
import {EstablishmentType} from "@/interfaces/types";


const UserList = () => {
    const {
        tableQueryResult: {data, isLoading, isError, isFetching},
        current,
        setCurrent,
        setPageSize,
        sorters,
        pageSize,
        setSorters,
        filters,
        setFilters,
    } = useTable<PropertyProps, HttpError>({
        resource: `${ESTABLISHMENT}/all`,
        pagination: {
            current: 1,
            pageSize: 20
        },
        syncWithLocation: true,
    });
    // console.log(filters)
    console.log(performance.navigation.type == performance.navigation.TYPE_RELOAD)
    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters.flatMap((item) => ("field" in item ? item : []));

        return {
            title: logicalFilters.find((item) => item.field === 'title')?.value || "",
            city_like: logicalFilters.find((item) => item.field === 'city')?.value || "",
            propertyType: logicalFilters.find((item) => item.field === 'propertyType')?.value as EstablishmentType || "" as EstablishmentType,
            averageCheck_lte: logicalFilters.find((item) => item.field === 'averageCheck_lte')?.value || 0,
            averageCheck_gte: logicalFilters.find((item) => item.field === 'averageCheck_gte')?.value || 2000,
        }
    }, [filters]);
    const [title, setTitle] = useState<string>(currentFilterValues?.title);

    // console.log(currentFilterValues?.title);
    const allEstablishments = data?.data || [] as PropertyProps[];
    console.log(filters)
    // useEffect(() => {
    //     setTitle(currentFilterValues?.title)
    // }, [currentFilterValues?.title]);
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
                    <Box mb={1} width={"100%"}>
                        <FilterEstablishments
                            currentFilterValues={currentFilterValues}
                            filters={filters}
                            setFilters={setFilters}
                            setCurrent={setCurrent}
                            setSearchValue={setTitle}
                            sorters={sorters}
                            setSorters={setSorters}
                            searchValue={title}
                        />
                    </Box>
                </Box>
            </Box>
            <FullPageLoading isOpen={isFetching}/>
            {
                isError ? <Typography>Error...</Typography> :
                    <ListForUsers
                        isLoading={isLoading}
                        allEstablishments={allEstablishments}
                        data={data}
                        current={current}
                        setCurrent={setCurrent}
                        pageSize={pageSize}
                        total={data?.total as number}
                        setPageSize={setPageSize}
                    />
            }
        </Box>
    );
};
export default UserList;
