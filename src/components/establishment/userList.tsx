import {useNavigate} from "react-router-dom";
import {CanAccess, useGetIdentity, useLink, useTable, useTranslate} from "@refinedev/core";
import {useDebounce} from "use-debounce";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {useContext, useEffect, useState} from "react";

import {FilterInstitutions, Loading, PaginationComponent, InstitutionCard} from "../index";
import {IGetIdentity, ProfileProps, PropertyProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import {buttonStyle} from "../../styles";
import {useMobile} from "../../utils";

const UserList = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const [sortBy, setSortBy] = useState("");
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const [favPlace, setFavPlaces] = useState<any>(user?.favoritePlaces);
    const [searchValue, setSearchValue] = useState<any>();
    const [debouncedSearchText] = useDebounce(searchValue, 500);

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
    });

    const allInstitutions = data?.data ?? [];

    const Link = useLink();
    useEffect(() => {
        setFilters([
            {
                field: 'title',
                value: debouncedSearchText ?? '',
                operator: 'contains'
            }
        ])
    }, [debouncedSearchText])


    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: width > 1000 ? 'row' : 'column',
            gap: width > 1000 ? 2 : 1,
            position: 'relative',
            justifyContent: width > 1000 ? 'unset' : 'center',
            alignItems: width > 1000 ? 'unset' : 'center'
        }}>
            <Box sx={{
                width: '100%',
                order: width > 1000 ? 1 : 2,
            }}>
                <Grid container spacing={2} sx={{
                    justifyContent: {xs: 'center', sm: 'normal'}
                }}>
                    {
                        isLoading ? <Loading height={'60vh'}/> :
                            allInstitutions.map((institution: PropertyProps | any) => (
                                <Grid
                                    sx={{
                                        display: 'grid',
                                        maxWidth: {xs: '350px'}
                                    }}
                                    item
                                    key={institution?._id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    xl={3}
                                >
                                    <InstitutionCard
                                        otherProps={setFavPlaces}
                                        key={institution._id}
                                        institution={institution}
                                    />
                                </Grid>
                            ))
                    }
                </Grid>
                {
                    allInstitutions.length > 0 && (
                        <PaginationComponent count={data?.total as number} current={current} setCurrent={setCurrent}
                                             pageCount={pageSize} setPageSize={setPageSize}/>
                    )
                }
            </Box>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                order: width > 1000 ? 2 : 1,
                width: width > 1000 ? '300px' : '100%',
                maxHeight: '88vh',
                minHeight: 'fit-content',
                padding: '10px',
                borderRadius: '15px',
                bgcolor: (theme) => theme.palette.primary.main
            }}>
                <Stack direction={"column"} width={"100%"}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <CanAccess resource={"all_institutions"} action={"create"}>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <Button
                                    color={"info"} variant={"contained"}
                                    startIcon={<Add/>}
                                    sx={buttonStyle}
                                    onClick={() => navigate('/all_institutions/create')}>
                                    {translate("home.create.title")}
                                </Button>
                            </Stack>
                        </CanAccess>
                    </Box>

                    <Box mb={1} mt={1} width={"100%"}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 2,
                            }}
                        >
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
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                alignItems: 'center',
                                borderRadius: '5px',
                                width: '100px'
                            }}>
                                <Box component={Link}
                                     sx={{
                                         textDecoration: 'none',
                                         color: 'black',
                                         padding: '5px',
                                         borderRadius: '5px 0 0 5px',
                                         bgcolor: 'silver',
                                         transition: '300ms linear',
                                         // borderBottom: !byTags ? '3px solid #212042' : '3px solid transparent',
                                         fontSize: {xs: '16px', md: '20px'},
                                         "&:hover": {
                                             bgcolor: '#2e36ca'
                                         }
                                     }}
                                >
                                    {translate("home.sortByType.all")}
                                </Box>
                                <Box component={Link}
                                     sx={{
                                         textDecoration: 'none',
                                         padding: '5px',
                                         borderRadius: '0 5px 5px 0',
                                         bgcolor: 'silver',
                                         color: 'black',
                                         transition: '300ms linear',
                                         // borderBottom: byTags ? '3px solid #212042' : '3px solid transparent',
                                         fontSize: {xs: '16px', md: '20px'},
                                         "&:hover": {
                                             bgcolor: '#2e36ca'
                                         }
                                     }}
                                >
                                    {translate("home.tags")}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};
export default UserList;
