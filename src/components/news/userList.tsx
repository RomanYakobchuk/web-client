import {HttpError, useTable} from "@refinedev/core";
import React, {useContext, useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {Box, Typography} from "@mui/material";

import {INews} from "@/interfaces/common";
import {FilterNews} from "../index";
import ListForUsers from "./lists/listForUsers";
import {useMobile} from "@/hook";
import {SchemaContext} from "@/settings/schema";
import {FullPageLoading} from "@/components/loading/fullPageLoading";

const UserList = () => {

    const {width} = useMobile();
    const {schema} = useContext(SchemaContext);

    const [isShowAdversiting, setIsShowAdversiting] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState("");
    const [searchValue, setSearchValue] = useState<any>();
    const [debouncedSearchText] = useDebounce(searchValue, 500)


    const {
        tableQueryResult: {data, isFetching, isLoading, isError},
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
                value: searchValue,
                operator: 'contains'
            }
        ])
    }, [debouncedSearchText]);

    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box sx={{
            maxWidth: {xs: '95%', lg: '1400px'},
            margin: '0 auto'
        }}>
            {/*<FullPageLoading isOpen={isFetching}/>*/}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                alignItems: 'start'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    // width: isLarge ? '40%' : '100%',
                    width: '100%',
                    alignItems: 'center',
                    // position: isLarge ? 'sticky' : 'unset',
                    // top: schema === 'schema_2' ? '20px' : '80px',
                    // maxWidth: {xs: '90%', sm: '700px'},
                    maxWidth: {xs: '100%', sm: '700px'},
                    gap: 2,
                    // p: isLarge ? '20px': '0',
                    // bgcolor: isLarge ? 'modern.modern_1.main' : 'transparent',
                    // borderRadius: '15px'
                }}>
                    <FilterNews
                        filters={filters}
                        setFilters={setFilters}
                        sortBy={sortBy}
                        setCurrent={setCurrent}
                        setSortBy={setSortBy}
                        setSearchValue={setSearchValue}
                        sorters={sorters}
                        setSorters={setSorters}
                        searchValue={searchValue}
                    />
                    {
                        isShowAdversiting && (
                            <Box sx={{
                                width: '100%',
                                height: {xs: '300px', md: '500px'},
                                bgcolor: 'modern.modern_1.second',
                                p: '20px',
                                display: 'flex',
                                borderRadius: '15px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                ADVERTISING
                            </Box>
                        )
                    }
                </Box>
                <Box sx={{
                    // width: width > 1100 ? '60%' : '100%',
                    // maxWidth: {xs: '700px', lg: '100%'}
                    width: '100%',
                    // maxWidth: {xs: '90%', sm: '100%'}
                }}>
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
            </Box>
        </Box>
    );
};
export default UserList
