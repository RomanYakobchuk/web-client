import {Box, Button, CircularProgress, MenuItem, Select} from "@mui/material";
import {HourglassBottom, Public, ThumbDownAltOutlined} from "@mui/icons-material";
import {PropertyProps} from "../../../interfaces/common";
import InstitutionCard from "../../institution/utills/InstitutionCard";
import React, {useState} from "react";
import {useInfiniteList, useTranslate} from "@refinedev/core";
import Loading from "../../loading";
import {useMobile} from "../../../utils";

interface IProps {
    id: string
}

const UserInstitutions = ({id}: IProps) => {

    const translate = useTranslate();
    const {device} = useMobile();

    const [favoritePlaces, setFavoritePlaces] = useState();
    const [status, setStatus] = useState<"draft" | "published" | "rejected">("published");


    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList<PropertyProps>({
        resource: `institution/allByUserId/${id}`,
        pagination: {
            pageSize: 5
        },
        filters: [
            {
                field: 'verify',
                operator: 'eq',
                value: status
            }
        ]
    });
    // const lengthPublic = institutions?.filter((item: PropertyProps) => item?.verify === "published")?.length;
    console.log(data)
    // const lengthDraft = institutions?.filter((item: PropertyProps) => item?.verify === "draft")?.length;
    if (isLoading) return device ? <Loading/> : <CircularProgress color={'secondary'}/>;
    if (isError) return <div>Error</div>;
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2.5,
                width: '100%'
            }}
        >
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: {xs: 'space-between', sm: 'start'},
                alignItems: 'center',
                gap: {xs: 0, sm: 2}
            }}>
                <Select
                    color={'secondary'}
                    value={status}
                    size={'small'}
                    sx={{
                        "& div": {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 1
                        }
                    }}
                    onChange={(event) => setStatus(event.target.value as any)}
                >
                    {
                        [
                            {
                                title: translate("buttons.isPublished"),
                                value: 'published' as "published",
                                color: "success",
                                icon: <Public/>
                            },
                            {
                                title: translate("buttons.isDraft"),
                                value: 'draft' as "draft",
                                color: 'info',
                                icon: <HourglassBottom/>
                            },
                            {
                                title: translate('buttons.isRejected'),
                                value: 'rejected' as 'rejected',
                                color: 'error',
                                icon: <ThumbDownAltOutlined/>
                            }
                        ].map((item, index) => (
                            <MenuItem
                                value={item.value}
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                {item.icon}
                                {item.title}
                            </MenuItem>
                        ))
                    }
                </Select>

            </Box>
            {
                data?.pages?.length > 0 ?
                    data?.pages?.map((page) =>
                        page?.data?.map((property, index) => (
                                <InstitutionCard
                                    key={index}
                                    otherProps={{
                                        setFavoritePlaces: setFavoritePlaces,
                                        favoritePlaces: favoritePlaces
                                    }}
                                    institution={property}
                                />
                            )
                        )
                    ) : ''
            }
            {
                hasNextPage && (
                    <Button
                        variant={"outlined"}
                        color={'secondary'}
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {translate(isFetchingNextPage ? 'loading' : 'buttons.loadMore')}
                    </Button>
                )
            }
        </Box>
    );
};
export default UserInstitutions;
