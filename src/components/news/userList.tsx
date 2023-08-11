import {useNavigate} from "react-router-dom";
import {HttpError, useGetIdentity, useTable, useTranslate} from "@refinedev/core";
import React, {useContext, useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";

import {ColorModeContext} from "../../contexts";
import {IGetIdentity, INews, NewsProps, ProfileProps} from "../../interfaces/common";
import {CustomButton, FilterNews, Loading, NewsCard, PaginationComponent} from "../index";
import {buttonStyle} from "../../styles";

const UserList = () => {
    const navigate = useNavigate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;

    const [sortBy, setSortBy] = useState("");
    const [isUserInstitution, setIsUserInstitution] = useState<boolean>(false);
    const translate = useTranslate();
    const [searchValue, setSearchValue] = useState<any>();
    const [debouncedSearchText] = useDebounce(searchValue, 500)
    const {mode} = useContext(ColorModeContext);


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
    } = useTable<NewsProps[], HttpError>({
        resource: "news/all"
    });
    useEffect(() => {
        if (user) {
            if (user?.status === 'admin' || user?.status === "manager") {
                setIsUserInstitution(true);
            }
        }
    }, [user]);

    const allNews: NewsProps[] | any = data?.data ?? [];

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
        <Box>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                mt: {xs: "10px", sm: '20px'}
            }}>
                <Stack direction={"column"} width={"100%"}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '16px', sm: '24px'}
                        }} fontWeight={700} color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                            {
                                !allNews.length ? translate("news.notHave") : translate("news.title")
                            }
                        </Typography>
                        {
                            isUserInstitution &&
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <Button
                                    color={'info'}
                                    startIcon={<Add/>}
                                    variant={'contained'}
                                    sx={{
                                        ...buttonStyle,
                                        textTransform: 'none'
                                    }}
                                    onClick={() => navigate('/news/create')}>
                                    {translate("news.button")}
                                </Button>
                            </Stack>
                        }
                    </Box>
                    <Box mb={{xs: 1, sm: 2}} mt={3} width={"100%"}>
                        <Box display={"flex"} width={"100%"} gap={2} flexDirection={"column"} mb={{xs: '20px', sm: 0}}>
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
                </Stack>
            </Box>

            <Grid
                container
                spacing={2}
            >
                {
                    isLoading ? <Loading/> :
                        allNews.map((news: INews, index: number) => (
                            <Grid
                                item
                                key={index}
                                xs={12}
                                sm={6}
                                lg={4}
                                xl={3}
                            >
                                <NewsCard
                                    index={index}
                                    news={news}
                                />
                            </Grid>
                        ))
                }
            </Grid>
            {
                allNews.length > 0 && (
                    <PaginationComponent count={data?.total as number} current={current} setCurrent={setCurrent} pageCount={pageSize} setPageSize={setPageSize}/>
                )
            }
        </Box>
    );
};
export default UserList
