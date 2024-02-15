import {Box, MenuItem, Select} from "@mui/material";
import {HourglassBottom, Public, ThumbDownAltOutlined} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {useInfiniteList, useTranslate} from "@refinedev/core";

import Loading from "../../loading/loading";
import {useMobile} from "@/hook";
import {PropertyProps} from "@/interfaces/common";
import MoreButton from "@/components/common/buttons/MoreButton";
import PropertiesList from "@/components/establishment/utills/lists/propertiesList";
import {VariantComponent} from "@/components";
import {SearchInputComponent} from "@/components/common/search";
import {useDebounce} from "use-debounce";
import {ESTABLISHMENT} from "@/config/names";

interface IProps {
    id: string
}

const Userestablishments = ({id}: IProps) => {

    const translate = useTranslate();
    const {width} = useMobile();

    const [searchValue, setSearchValue] = useState<string>('');
    const [establishment, setEstablishment] = useState<PropertyProps[]>([] as PropertyProps[]);
    const [status, setStatus] = useState<"draft" | "published" | "rejected">("published");

    const [debounceSearchValue] = useDebounce(searchValue, 500);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList<PropertyProps>({
        resource: `${ESTABLISHMENT}/allByUserId/${id}`,
        pagination: {
            pageSize: 10
        },
        filters: [
            {
                field: 'verify',
                operator: 'eq',
                value: status
            },
            {
                field: 'title',
                value: debounceSearchValue,
                operator: 'contains'
            }
        ]
    });

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: PropertyProps[],
                total: number
            }) => page?.data ?? [])));
            setEstablishment(list);
        }
    }, [data]);
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

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
                flexDirection: 'column',
                gap: 2
            }}>
                <SearchInputComponent
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    isButton={false}
                />
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
                    <VariantComponent type={"establishment"}/>
                </Box>
            </Box>
            {
                isLoading
                    ? <Loading height={'200px'}/>
                    : isError
                        ? <p>Something went wrong</p>
                        : establishment?.length > 0 && (
                        <PropertiesList
                            items={establishment}
                            numberOfColumnsByWidth={width < 700 ? 2 : width < 1400 ? 3 : 4}
                        />
                    )
            }
            <MoreButton
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                total={total}
            />
        </Box>
    );
};
export default Userestablishments;
