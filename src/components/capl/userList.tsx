import {Box, Button, Grid, Typography} from "@mui/material";
import {IReserve, ProfileProps} from "../../interfaces/common";
import {Loading, Pagination, ReservedCard} from "../index";
import React, {useContext} from "react";
import {CanAccess, useGetIdentity, useTable, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {ColorModeContext} from "../../contexts";
import {Edit} from "@mui/icons-material";

const UserList = () => {
    const {data: user} = useGetIdentity<ProfileProps>();
    const translate = useTranslate();
    const navigate = useNavigate();

    const {
        tableQueryResult: {data, isLoading, isError},
        sorters,
        setSorters,
        filters,
        setFilters,
        pageCount,
        setPageSize,
        current,
        setCurrent
    } = useTable({
        resource: `capl/allByUser`,
    })
    const reservations: IReserve[] | any = data?.data ?? [];


    if (isLoading) return <Loading/>
    if (isError) return <div>Error</div>
    return (
        <Box>
            <CanAccess resource={'capl'} action={'userListReserve'}>
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}>
                    <Button
                        variant={'contained'}
                        startIcon={<Edit/>}
                        color={"primary"}
                        onClick={() => navigate(`/capl/create`)}
                    >
                        {translate('capl.title')}
                    </Button>

                </Box>
            </CanAccess>
            <Typography my={1}>
                {translate('capl.main.yourReserve')}
            </Typography>
            <Grid container spacing={2}>
                {
                    reservations?.map((item: IReserve, index: number) =>
                        <Grid
                            key={index}
                            item
                            xs={12}
                            sm={6}
                            lg={4}
                            xl={3}
                        >
                            <ReservedCard
                                key={index}
                                userStatus={item?.userStatus}
                                institutionStatus={item?.institutionStatus}
                                institution={item.institution}
                                _id={item?._id}
                                writeMe={item?.writeMe}
                                isActive={item?.isActive}
                                fullName={item?.fullName}
                                whoPay={item?.whoPay}
                                eventType={item?.eventType}
                                date={item?.date}
                                comment={item?.comment}
                                desiredAmount={item?.desiredAmount}
                                numberPeople={item?.numberPeople}
                            />
                        </Grid>
                    )}
            </Grid>
            <Pagination current={current} setCurrent={setCurrent} pageCount={pageCount} setPageSize={setPageSize}/>
        </Box>
    )
        ;
};
export default UserList;
