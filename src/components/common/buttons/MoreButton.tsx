import {FetchNextPageOptions, InfiniteQueryObserverResult} from "@tanstack/query-core";
import {GetListResponse, HttpError, useTranslate} from "@refinedev/core";
import React, {FC} from "react";
import {Button} from "@mui/material";

interface IMoreButton {
    hasNextPage: boolean | undefined,
    isFetchingNextPage: boolean,
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<GetListResponse<any>, HttpError>>,
    total: number | undefined
}

const MoreButton: FC<IMoreButton> = ({isFetchingNextPage, hasNextPage, fetchNextPage, total}) => {
    const translate = useTranslate();
    return (
        <Button
            sx={{
                textTransform: 'inherit',
                m: '10px auto',
                borderRadius: '20px'
            }}
            variant={'contained'}
            color={'info'}
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
        >
            {
                isFetchingNextPage
                    ? translate('loading')
                    : hasNextPage
                        ? translate('buttons.loadMore')
                        : (!total || total === 0) ? translate('text.notResult') : translate('buttons.thatsAll')
            }
        </Button>
    )
}
export default MoreButton;