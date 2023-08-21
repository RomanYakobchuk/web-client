import {useLocation} from "react-router-dom";
import {useTable, useTranslate} from "@refinedev/core";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

import {FilterInstitutions, Loading, PaginationComponent} from "../index";
import {PropertyProps} from "../../interfaces/common";
import {useMobile} from "../../utils";
import PropertiesList from "./utills/propertiesList";

const UserList = () => {
    const {state} = useLocation();
    const translate = useTranslate();
    const [sortBy, setSortBy] = useState("");
    const {width} = useMobile();

    const [searchValue, setSearchValue] = useState<any>();

    const {
        tableQueryResult: {data, isLoading, isError},
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorters,
        pageSize,
        setSorters,
        filters,
        setFilters,
    } = useTable({
        resource: "institution/all",
        syncWithLocation: true,

    });

    useEffect(() => {
        if (state && state?.value && state?.isTag) {
            setFilters([
                {
                    field: 'title',
                    value: '#' + state.value,
                    operator: 'contains'
                }
            ])
        }
    }, [state]);

    const allInstitutions = data?.data as PropertyProps[] ?? [] as PropertyProps[];

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
                            setSearchValue={setSearchValue}
                            sorters={sorters}
                            setSorters={setSorters}
                            searchValue={searchValue}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                justifyContent: width > 1000 ? 'unset' : 'center',
                alignItems: width > 1000 ? 'unset' : 'start'
            }}>
                {
                    isLoading ? <Loading height={'40vh'}/> :
                        allInstitutions?.length > 0 ?
                            <PropertiesList items={allInstitutions}/>
                            : <Box sx={{
                                width: '100%',
                                height: '250px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {translate('text.notResult')}
                            </Box>
                }
                {
                    allInstitutions.length > 0 && (
                        <PaginationComponent count={data?.total as number} current={current} setCurrent={setCurrent}
                                             pageCount={pageSize} setPageSize={setPageSize}/>
                    )
                }
            </Box>
        </Box>
    );
};
export default UserList;
