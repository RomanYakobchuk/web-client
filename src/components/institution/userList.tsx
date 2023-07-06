import {useNavigate} from "react-router-dom";
import {CanAccess, useGetIdentity, useLink, useTable, useTranslate} from "@refinedev/core";
import {useDebounce} from "use-debounce";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {useContext, useEffect, useState} from "react";

import {FilterInstitutions, Loading, Pagination, InstitutionCard} from "../index";
import {ProfileProps, PropertyProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import {buttonStyle} from "../../styles";

const UserList = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const {data: user} = useGetIdentity<ProfileProps>();
    const [sortBy, setSortBy] = useState("");
    const {mode} = useContext(ColorModeContext);

    const [byTags, setByTags] = useState(false);
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
        setSorters,
        filters,
        setFilters,
    } = useTable({
        resource: "institution/all",
    });

    const allInstitutions = data?.data ?? [];

    const Link = useLink();
    useEffect(() => {
        if (byTags) {
            setFilters([
                {
                    field: 'tag',
                    value: debouncedSearchText,
                    operator: 'contains'
                },
                {
                    field: 'title',
                    value: "",
                    operator: 'contains'
                }
            ])
        } else {
            setFilters([
                {
                    field: 'tag',
                    value: "",
                    operator: 'contains'
                },
                {
                    field: 'title',
                    value: debouncedSearchText,
                    operator: 'contains'
                }
            ])
        }
    }, [byTags, debouncedSearchText])

    const searchByValue = async () => {
        setByTags(!byTags)
    }

    if (isError) return <Typography>Error...</Typography>;

    return (
        // <Typography sx={{
        //     fontSize: {xs: '16px', sm: '24px'}
        // }} fontWeight={700} color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
        //     {
        //         !allInstitutions.length ? translate("home.notHave") : translate("home.title")
        //     }
        // </Typography>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1
        }}>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
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
                                flexDirection: {xs: 'column', sm: 'row'},
                                width: '100%',
                                gap: 2,
                            }}
                        >
                            <FilterInstitutions
                                setByTags={setByTags}
                                filters={filters}
                                setFilters={setFilters}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                setSearchValue={setSearchValue}
                                sorters={sorters}
                                setSorters={setSorters}
                                byTags={byTags}
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
                                     onClick={searchByValue}
                                     sx={{
                                         textDecoration: 'none',
                                         color: byTags ? 'white' : 'black',
                                         padding: '5px',
                                         borderRadius: '5px 0 0 5px',
                                         bgcolor: !byTags ? 'silver' : '#2e36ca',
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
                                     onClick={searchByValue}
                                     sx={{
                                         textDecoration: 'none',
                                         padding: '5px',
                                         borderRadius: '0 5px 5px 0',
                                         bgcolor: !byTags ? '#2e36ca' : 'silver',
                                         color: !byTags ? 'white' : 'black',
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
            <Grid container spacing={2} sx={{
                justifyContent: {xs: 'center', sm: 'normal'}
            }}>
                {
                    isLoading ? <Loading/> :
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
            {/*<Box mt={{xs: '10px', sm: '20px'}}*/}
            {/*     sx={{display: "flex", flexWrap: "wrap", justifyContent: {xs: 'space-between', lg: 'start'}, gap: 2}}>*/}
            {/*    */}
            {/*</Box>*/}
            {
                allInstitutions.length > 0 && (
                    <Pagination current={current} setCurrent={setCurrent} pageCount={pageCount} setPageSize={setPageSize}/>
                )
            }
        </Box>
    );
};
export default UserList;
