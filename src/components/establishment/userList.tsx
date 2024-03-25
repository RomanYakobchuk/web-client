import {HttpError, useTable} from "@refinedev/core";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";

import {FilterEstablishments} from "../index";
import {IEstablishment} from "@/interfaces/common";
import ListForUsers from "./utills/lists/listForUsers";
import {ESTABLISHMENT} from "@/config/names";
import {EstablishmentType} from "@/interfaces/types";
import {EstablishmentMaps} from "@/components/google/newMap/EstablishmentMaps";


const UserList = () => {
    const [isShowLoading, setIsShowLoading] = useState(true);
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
    } = useTable<IEstablishment, HttpError>({
        resource: `${ESTABLISHMENT}/all`,
        pagination: {
            current: 1,
            pageSize: 20
        },
        syncWithLocation: true,
    });
    // console.log(filters)
    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters.flatMap((item) => ("field" in item ? item : []));
        return {
            title: logicalFilters.find((item) => item.field === 'title')?.value || "",
            city_like: logicalFilters.find((item) => item.field === 'city')?.value || "",
            propertyType: logicalFilters.find((item) => item.field === 'propertyType')?.value as EstablishmentType || "" as EstablishmentType,
            averageCheck_lte: logicalFilters.find((item) => item.field === 'averageCheck' && item?.operator === 'lte')?.value || 100000,
            averageCheck_gte: logicalFilters.find((item) => item.field === 'averageCheck' && item?.operator === 'gte')?.value || 0,
        }
    }, [filters]);
    const [title, setTitle] = useState<string>(currentFilterValues?.title);

    const allEstablishments = data?.data || [] as IEstablishment[];

    useEffect(() => {
        setIsShowLoading(isFetching)
    }, [isFetching]);
    useEffect(() => {
        if (isShowLoading) {
            const timer = setTimeout(() => {
                setIsShowLoading(false)
            }, 5000)
            return () => {
                clearTimeout(timer);
            }
        }
    }, [isShowLoading]);

    return (
        <Box sx={{
            // display: 'flex',
            // flexDirection: {xs: 'column', lg: 'row'},
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', lg: '65% 35%'},
            gap: 2,
            width: '100%',
            margin: '0 auto',
            px: 1,
            maxWidth: '1500px',
            position: 'relative'
        }}>
            <Box
                sx={{
                    order: {lg: 2},
                    width: '100%',
                    position: {xs: 'unset', lg: 'sticky'},
                    top: {lg: '100px'},
                    maxWidth: {xs: '100%', lg: '600px'},
                    height: {xs: '100px', sm: '150px', md: '300px', lg: '100vh'},

                    maxHeight: 'calc(100vh - 200px)'
                }}
            >
                <EstablishmentMaps establishments={allEstablishments || []}/>
            </Box>
            <Box
                sx={{
                    maxWidth: '1200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    margin: '0 auto',
                    overflow: 'hidden'
                }}
            >
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
                {/*<FullPageLoading isOpen={isShowLoading}/>*/}
                <Box
                    sx={{
                        width: '100%',
                        px: 0.5
                    }}
                >
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
            </Box>
        </Box>
    );
};
export default UserList;
