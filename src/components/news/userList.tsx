import {HttpError, useTable} from "@refinedev/core";
import React, { useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {Box, Typography} from "@mui/material";

import {INews} from "../../interfaces/common";
import {FilterNews} from "../index";
import ListForUsers from "./lists/listForUsers";

const UserList = () => {

    const [sortBy, setSortBy] = useState("");
    const [searchValue, setSearchValue] = useState<any>();
    const [debouncedSearchText] = useDebounce(searchValue, 500)


    const {
        tableQueryResult: {data, isLoading, isError,},
        current,
        setCurrent,
        setPageSize,
        pageSize,
        sorters,
        setSorters,
        filters,
        setFilters,
    } = useTable<INews, HttpError>({
        resource: "news/all"
    });

    const allNews: INews[] = data?.data ?? [] as INews[];

    useEffect(() => {
        setFilters([
            {
                field: 'title',
                value: debouncedSearchText,
                operator: 'contains'
            }
        ])
    }, [debouncedSearchText]);

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
                        <FilterNews
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
            <ListForUsers
                isLoading={isLoading}
                news={allNews}
                data={data}
                current={current}
                setCurrent={setCurrent}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        </Box>
    )
        ;
};
export default UserList
