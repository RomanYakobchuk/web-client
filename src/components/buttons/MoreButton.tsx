import {FetchNextPageOptions, InfiniteQueryObserverResult} from "@tanstack/query-core";
import {GetListResponse, HttpError, useTranslate} from "@refinedev/core";
import React, {FC} from "react";
import {Button, CircularProgress} from "@mui/material";

export interface IMoreButton {
    hasNextPage: boolean | undefined,
    isFetchingNextPage: boolean,
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<GetListResponse<any>, HttpError>>,
    total: number | undefined,
    isLoading?: boolean
}

const MoreButton: FC<IMoreButton> = ({isFetchingNextPage, hasNextPage, fetchNextPage, total, isLoading = false}) => {
    const translate = useTranslate();
    return (
        <Button
            sx={{
                textTransform: 'inherit',
                m: '10px auto',
                borderRadius: '20px',
                backdropFilter: 'blur(4px)',
                color: '#fff !important',
                textWrap: 'nowrap',
                "&.Mui-disabled":{
                    bgcolor: 'rgba(0, 0, 0, 0.4)'
                }
            }}
            variant={'contained'}
            color={'info'}
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
        >
            {
                isLoading
                    ? <CircularProgress
                        color={'secondary'}
                        size={28}
                    />
                    : isFetchingNextPage
                        ? translate('loading')
                        : hasNextPage
                            ? translate('buttons.loadMore')
                            : (!total || total === 0) ? translate('text.notResult') : translate('buttons.thatsAll')
            }
        </Button>
    )
}
export default MoreButton;