import {Box} from "@mui/material";
import {BaseRecord, GetListResponse, useTranslate} from "@refinedev/core";
import React, {Dispatch} from "react";

import {Loading, PaginationComponent} from "../../../index";
import PropertiesList from "./propertiesList";
import {PropertyProps} from "../../../../interfaces/common";
import {useMobile} from "../../../../utils";

type IProps = {
    isLoading: boolean,
    allInstitutions: PropertyProps[]
    data: GetListResponse<BaseRecord> | undefined,
    current: number,
    setCurrent: Dispatch<React.SetStateAction<number>>,
    pageSize: number,
    setPageSize: Dispatch<React.SetStateAction<number>>
}
const ListForUsers = ({isLoading, allInstitutions, data, current, setCurrent, setPageSize, pageSize}: IProps) => {
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
    );
};
export default ListForUsers
