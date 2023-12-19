import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import React, {Dispatch, Fragment, SetStateAction, useContext, useState} from "react";
import {Box} from "@mui/material";
import {ColorModeContext} from "@/contexts";

type TOption = {
    title: string,
    value: string
}
type TProps = {
    options: TOption[],
    setSortBy: (value: string) => void | Dispatch<SetStateAction<string>>,
    toggleSort?: (value: any) => void,
    btnHeight?: string,
    btnWidth?: string,
}
// [
//     {
//         title: translate("home.default"),
//         value: ""
//     },
//     {
//         title: 'Найстаріші',
//         value: 'createdAt_asc',
//     },
//     {
//         title: 'Найновіші',
//         value: 'createdAt_desc',
//     },
//     {
//         title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.a-z"),
//         value: 'title_asc'
//     },
//     {
//         title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.z-a"),
//         value: 'title_desc'
//     },
//     {
//         title: translate("news.dateEvent.title") + '  ' + '↑',
//         value: 'date_event_asc'
//     },
//     {
//         title: translate("news.dateEvent.title") + '  ' + '↓',
//         value: 'date_event_desc'
//     }
// ]
export const HeadlessSelect = ({options, toggleSort, setSortBy, btnHeight = '40px', btnWidth = '200px'}: TProps) => {
    const {mode} = useContext(ColorModeContext);

    const [selectedValue, setSelectedValue] = useState(options[0]);

    return (
        <Box sx={{
            width: `${btnWidth} !important`
        }}>
            <Listbox
                value={selectedValue}
                onChange={
                    (value) => {
                        setSortBy(value?.value)
                        if (toggleSort) {
                            toggleSort(value?.value as any)
                        }
                        setSelectedValue(value)
                    }
                }
            >
                <Box className="relative"
                     sx={{
                         "& button, & ul": {
                             bgcolor: 'common.black',
                             color: 'common.white',
                         },
                         "& li": {
                             color: 'common.white',
                             listStyleType: 'none',
                             '&:hover': {
                                 color: 'black'
                             }
                         }
                     }}
                >
                    <Listbox.Button
                        style={{
                            height: btnHeight,
                            boxShadow: mode === 'dark' ? 'rgb(230 239 245 / 30%) 0px 1px 2px 0px, rgb(211 217 221 / 15%) 0px 2px 6px 2px' : '0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)'
                        }}
                        className={`relative cursor-pointer rounded-lg w-full py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm`}>
                        <span className="block truncate">{selectedValue.title}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                     <ChevronUpDownIcon
                         className="h-5 w-5 text-gray-400"
                         aria-hidden="true"
                     />
                    </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute z-10 p-0 mt-1 max-h-60 w-[300px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {
                                options?.map((item, index) => {
                                    return (
                                        <Listbox.Option
                                            className={`relative rounded-3xl cursor-pointer py-2 my-2 pl-10 mx-4 pr-4 ${selectedValue?.value === item?.value ? 'cursor-default bg-amber-200 text-amber-900' : 'hover:bg-amber-100 text-gray-900'}`}
                                            key={index}
                                            value={item}>
                                            {() => {
                                                return (
                                                    <>
                      <span
                          className={`block truncate ${
                              selectedValue?.value === item?.value ? 'font-bold text-black' : 'font-normal'
                          }`}
                      >
                        {item?.title}
                      </span>
                                                        {selectedValue?.value === item?.value ? (
                                                            <span
                                                                className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                        </span>
                                                        ) : null}
                                                    </>
                                                )
                                            }}
                                        </Listbox.Option>
                                    )
                                })
                            }
                        </Listbox.Options>
                    </Transition>
                </Box>
            </Listbox>
        </Box>
    );
};
