import {CrudSorting, useTranslate} from "@refinedev/core";
import React, {useMemo} from "react";

import "@/main.css"
import {HeadlessSelect} from "@/components/common/search/utils/headlessSelect";

type TProps = {
    sorters: CrudSorting,
    defaultSetSorters: (sorter: CrudSorting) => void,
}
const SortEstablishmentComponent = ({sorters, defaultSetSorters}: TProps) => {

    const translate = useTranslate();

    const currentSorterOrders = useMemo(() => {
        return {
            rating_asc:
                sorters?.find((item) => item.field === "rating_asc")?.order || "asc",
            rating_desc:
                sorters?.find((item) => item.field === "rating_desc")?.order || "desc",
            createdAt_asc:
                sorters?.find((item) => item.field === "createdAt_asc")?.order || "asc",
            createdAt_desc:
                sorters?.find((item) => item.field === "createdAt_desc")?.order || "desc",
            title_asc:
                sorters?.find((item) => item.field === "title_asc")?.order || "asc",
            title_desc:
                sorters?.find((item) => item.field === "title_desc")?.order || "desc",
            averageCheck_asc:
                sorters?.find((item) => item.field === "averageCheck_asc")?.order || -1,
            averageCheck_desc:
                sorters?.find((item) => item.field === "averageCheck_desc")?.order || 1,
        };
    }, [sorters]);
    const toggleSort = (field: keyof typeof currentSorterOrders) => {
        const newOrder = field?.split('_')[1] as "asc" | 'desc';
        defaultSetSorters([
            {
                field,
                order: newOrder,
            },
        ])
    };

    const options = [
        {
            title: translate("home.default"),
            value: ""
        },
        {
            title: translate("home.sortRating") + '  ' + '↑',
            value: "rating_asc",
        },
        {
            title: translate("home.sortRating") + '  ' + '↓',
            value: "rating_desc",
        },
        {
            title: translate('home.oldest'),
            value: 'createdAt_asc',
        },
        {
            title: translate('home.newest'),
            value: 'createdAt_desc',
        },
        {
            title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.a-z"),
            value: 'title_asc'
        },
        {
            title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.z-a"),
            value: 'title_desc'
        },
        {
            title: translate("home.create.averageCheck") + '  ' + '↑',
            value: 'averageCheck_asc'
        },
        {
            title: translate("home.create.averageCheck") + '  ' + '↓',
            value: 'averageCheck_desc'
        },
    ];

    const currentSorters = options?.sort((a) => (a?.value === (sorters?.length > 0 ? sorters[0]?.field : '')) ? -1 : 1)[0];
    return (
        <HeadlessSelect
            current={currentSorters}
            options={options}
            toggleSort={toggleSort}
        />
    );
};
export default SortEstablishmentComponent
