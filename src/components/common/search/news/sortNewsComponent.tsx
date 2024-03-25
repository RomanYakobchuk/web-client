import React, {useMemo} from "react";
import {CrudSorting, useTranslate} from "@refinedev/core";
import {SxProps} from "@mui/material";
import {HeadlessSelect} from "@/components/headlessUI/headlessSelect";

type TProps = {
    newSorters: CrudSorting,
    setSortBy: (value: string) => void,
    defaultSetSorters: (sorter: CrudSorting) => void,
    sortBy: string,
    styles?: SxProps
}

const SortNewsComponent = ({newSorters, setSortBy, defaultSetSorters, sortBy, styles}: TProps) => {

    const translate = useTranslate();

    const currentSorterOrders = useMemo(() => {
        return {
            createdAt_asc:
                newSorters?.find((item: any) => item.field === "createdAt_asc")?.order || "asc",
            createdAt_desc:
                newSorters?.find((item: any) => item.field === "createdAt_desc")?.order || "desc",
            title_asc:
                newSorters?.find((item: any) => item.field === "title_asc")?.order || "asc",
            title_desc:
                newSorters?.find((item: any) => item.field === "title_desc")?.order || "desc",
        };
    }, [newSorters]);

    const toggleSort = (field: keyof typeof currentSorterOrders) => {
        const newOrder = field?.split('_')[1] as "asc" | "desc";
        defaultSetSorters([
            {
                field,
                order: newOrder,
            },
        ]);
    };
    const options = [
        {
            title: translate("home.default"),
            value: ""
        },
        {
            title: 'Найстаріші',
            value: 'createdAt_asc',
        },
        {
            title: 'Найновіші',
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
            title: translate("news.dateEvent.title") + '  ' + '↑',
            value: 'date_event_asc'
        },
        {
            title: translate("news.dateEvent.title") + '  ' + '↓',
            value: 'date_event_desc'
        }
    ];
    return (
        // <FormControl
        //     sx={{
        //         width: '100%',
        //         maxWidth: '200px',
        //         ...styles
        //     }}
        // >
        //     <Select
        //         variant={"outlined"}
        //         size="small"
        //         color={"info"}
        //         fullWidth
        //         displayEmpty
        //         required
        //         inputProps={{'aria-label': 'Without label'}}
        //         value={newSorters[0]?.field ? newSorters[0]?.field : sortBy ? sortBy : ""}
        //         sx={{
        //             fontSize: {xs: '12px', sm: '16px'},
        //             borderRadius: '7px',
        //             borderColor: 'common.white',
        //             borderWidth: '1px',
        //             borderStyle: 'solid'
        //         }}
        //         onChange={
        //             (e: any) => {
        //                 setSortBy(e.target.value)
        //                 toggleSort(e.target.value)
        //             }
        //         }
        //     >
        //         <MenuItem value={""}>{translate("home.default")}</MenuItem>
        //         {
        //             [
        //                 {
        //                     title: 'Найстаріші',
        //                     value: 'createdAt_asc',
        //                 },
        //                 {
        //                     title: 'Найновіші',
        //                     value: 'createdAt_desc',
        //                 },
        //                 {
        //                     title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.a-z"),
        //                     value: 'title_asc'
        //                 },
        //                 {
        //                     title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.z-a"),
        //                     value: 'title_desc'
        //                 },
        //                 {
        //                     title: translate("news.dateEvent.title") + '  ' + '↑',
        //                     value: 'date_event_asc'
        //                 },
        //                 {
        //                     title: translate("news.dateEvent.title") + '  ' + '↓',
        //                     value: 'date_event_desc'
        //                 },
        //             ].map((type) => (
        //                 <MenuItem key={type.value}
        //                           value={type.value}>{type.title}</MenuItem>
        //             ))
        //         }
        //     </Select>
        // </FormControl>
        // <div className="w-[220px]">
        //     <Listbox
        //         value={selectedValue}
        //         onChange={
        //             (value) => {
        //                 setSortBy(value?.value)
        //                 toggleSort(value?.value as any)
        //                 setSelectedValue(value)
        //             }
        //         }
        //     >
        //         <div className="relative mt-1">
        //             <Listbox.Button
        //                 className="relative cursor-pointer w-full rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
        //                 <span className="block truncate">{selectedValue.title}</span>
        //                 <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        //              <ChevronUpDownIcon
        //                  className="h-5 w-5 text-gray-400"
        //                  aria-hidden="true"
        //              />
        //             </span>
        //             </Listbox.Button>
        //             <Transition
        //                 as={Fragment}
        //                 leave="transition ease-in duration-100"
        //                 leaveFrom="opacity-100"
        //                 leaveTo="opacity-0"
        //             >
        //                 <Listbox.Options
        //                     className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
        //                     {
        //                       ?.map((item, index) => {
        //                             return (
        //                                 <Listbox.Option
        //                                     className={({active}) =>
        //                                         `relative cursor-default select-none py-2 pl-10 pr-4 ${
        //                                             active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
        //                                         }`
        //                                     }
        //                                     key={index}
        //                                     value={item}>
        //                                     {() => {
        //                                         return (
        //                                             <>
        //               <span
        //                   className={`block truncate ${
        //                       selectedValue?.value === item?.value ? 'font-medium' : 'font-normal'
        //                   }`}
        //               >
        //                 {item?.title}
        //               </span>
        //                                                 {selectedValue?.value === item?.value ? (
        //                                                     <span
        //                                                         className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
        //                   <CheckIcon className="h-5 w-5" aria-hidden="true"/>
        //                 </span>
        //                                                 ) : null}
        //                                             </>
        //                                         )
        //                                     }}
        //                                 </Listbox.Option>
        //                             )
        //                         })
        //                     }
        //                 </Listbox.Options>
        //             </Transition>
        //         </div>
        //     </Listbox>
        // </div>
        <HeadlessSelect
            options={options}
            setSortBy={setSortBy}
            toggleSort={toggleSort}
        />
    );
};
export default SortNewsComponent;
