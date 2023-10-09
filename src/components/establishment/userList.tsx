import {useLocation} from "react-router-dom";
import {useTable} from "@refinedev/core";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

import {FilterInstitutions} from "../index";
import {PropertyProps} from "../../interfaces/common";
import ListForUsers from "./utills/lists/listForUsers";

const UserList = () => {
    const {state} = useLocation();
    const [sortBy, setSortBy] = useState("");

    const [searchValue, setSearchValue] = useState<any>();

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
            setSearchValue('#' + state.value)
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
