import {BaseRecord, GetListResponse, useTranslate} from "@refinedev/core";
import React, {Dispatch} from "react";
import {Box} from "@mui/material";

import {INews} from "../../../interfaces/common";
import {Loading, PaginationComponent} from "../../index";
import NewsList from "../lists/newsList";
import {useMobile} from "../../../hook";

type IProps = {
    isLoading: boolean,
    news: INews[],
    data: GetListResponse<BaseRecord> | undefined,
    current: number,
    setCurrent: Dispatch<React.SetStateAction<number>>,
    pageSize: number,
    setPageSize: Dispatch<React.SetStateAction<number>>
}
const ListForUsers = ({isLoading, news, data, current, setCurrent, setPageSize, pageSize}: IProps) => {
    const translate = useTranslate();
    const {width} = useMobile();
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '100%',
            justifyContent: width > 1000 ? 'unset' : 'center',
            alignItems: width > 1000 ? 'unset' : 'start'
        }}>
            {
                isLoading ?
                    <Loading height={'40vh'}/>
                :
                    news?.length > 0 ?
                        <NewsList news={news}/>
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
                data && data?.total > 1 && (
                    <PaginationComponent count={data?.total as number} current={current} setCurrent={setCurrent}
                                         pageCount={pageSize} setPageSize={setPageSize}/>
                )
            }
        </Box>
    );
};
export default ListForUsers
