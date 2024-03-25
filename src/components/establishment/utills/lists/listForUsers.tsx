import {Box} from "@mui/material";
import {BaseRecord, GetListResponse, useTranslate} from "@refinedev/core";
import React, {Dispatch} from "react";

import {Loading, PaginationComponent} from "../../../index";
import PropertiesList from "./propertiesList";
import {IEstablishment} from "@/interfaces/common";
import {useMobile} from "@/hook";

type IProps = {
    isLoading: boolean,
    allEstablishments: IEstablishment[],
    total: number,
    data: GetListResponse<BaseRecord> | undefined,
    current: number,
    setCurrent: Dispatch<React.SetStateAction<number>>,
    pageSize: number,
    setPageSize: Dispatch<React.SetStateAction<number>>
}
const ListForUsers = ({isLoading, allEstablishments, data, current, setCurrent, setPageSize, pageSize, total}: IProps) => {
    const translate = useTranslate();
    const {width} = useMobile();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            justifyContent: width > 1000 ? 'unset' : 'center',
            alignItems: width > 1000 ? 'unset' : 'start'
        }}>
            {
                isLoading ? <Loading height={'40vh'}/> :
                    allEstablishments?.length > 0 ?
                        <PropertiesList items={allEstablishments}/>
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
                total > 1 && (
                    <PaginationComponent count={total as number} current={current} setCurrent={setCurrent}
                                         pageCount={pageSize} setPageSize={setPageSize}/>
                )
            }
        </Box>
    );
};
export default ListForUsers
