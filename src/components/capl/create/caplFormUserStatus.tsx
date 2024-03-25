import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {useTranslate} from "@refinedev/core";
import {RadioGroup} from "@headlessui/react";
import {Box} from "@mui/material";

import {IReserve} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {TStatus} from "@/interfaces/types";
import {CheckIcon} from "@/components/icons";

type TCaplFormUserStatus = {
    typeStatus: "userStatus" | "establishmentStatus",
    type: "create" | "edit",
    className?: string,
    status: IReserve['userStatus'] | IReserve['establishmentStatus'],
    arrayStatus?: TArrayStatusItem[],
    setStatus: Dispatch<SetStateAction<TCaplFormUserStatus['status']>>
}
type TArrayStatusItem = {
    label: string,
    value: string | number,
    description: string
}
const statusArray = ({typeStatus, type}: {
    typeStatus: TCaplFormUserStatus['typeStatus'],
    type: TCaplFormUserStatus['type']
}) => {
    const arr = [
        {
            label: "accepted",
            value: "accepted",
            description: `capl.status.${typeStatus}.message.accepted`
        },
        {
            label: "draft",
            value: "draft",
            description: `capl.status.${typeStatus}.message.draft`
        },
    ];
    if (type === 'edit') {
        arr?.push({
            label: "draft",
            value: "draft",
            description: `capl.status.${typeStatus}.message.draft`
        })
    }
    return arr;
}
export const CaplFormUserStatus = ({
                                       status,
                                       setStatus,
                                       type,
                                       arrayStatus,
                                       className,
                                       typeStatus
                                   }: TCaplFormUserStatus) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const [selected, setSelected] = useState({value: status?.value, label: status?.value});

    arrayStatus = statusArray({typeStatus, type});

    useEffect(() => {
        setStatus({
            value: selected?.value as TStatus,
            reasonRefusal: ''
        })
    }, [selected]);

    return (
        <div className={`w-full ${className}`}>
            <div className="mx-auto w-full max-w-md">
                <RadioGroup value={selected} defaultValue={selected} onChange={setSelected}>
                    {/*<RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>*/}
                    <Box className="space-y-2">
                        {arrayStatus.map((status) => (
                            <RadioGroup.Option
                                key={status?.value}
                                value={status}
                                className={({checked}) =>
                                    `
                  ${checked || selected?.value === status?.value ? `${mode === 'dark' ? 'bg-sky-900' : 'bg-sky-900/75'} text-white ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300` : `${mode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
                   group transition ease-in-out delay-100 relative hover:bg-sky-900 flex cursor-pointer rounded-lg px-5 py-2 shadow-md focus:outline-none`
                                }
                            >
                                {({checked}) => (
                                    <>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center">
                                                <div>
                                                    <RadioGroup.Label
                                                        as="p"
                                                        className={`${
                                                            checked || selected?.value === status?.value ? 'text-white' : `${mode === 'dark' ? 'text-white' : 'text-gray-900'}`
                                                        } group-hover:text-white font-bold my-2`}
                                                    >
                                                        {translate(`capl.status.${status?.label}`)}
                                                    </RadioGroup.Label>
                                                    <RadioGroup.Description
                                                        as="span"
                                                        className={`inline ${
                                                            (checked || selected?.value === status?.value) ? 'text-sky-100' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        <Box
                                                            component="span"
                                                        >
                                                            {translate(status?.description)}
                                                        </Box>
                                                        {/*{' '}*/}
                                                        {/*<span aria-hidden="true">&middot;</span>*/}
                                                        {/*{' '}*/}
                                                        {/*<span>{plan.disk}</span>*/}
                                                    </RadioGroup.Description>
                                                </div>
                                            </div>
                                            {(checked || selected?.value === status?.value) && (
                                                <div className="shrink-0 flex text-white">
                                                    <CheckIcon className="h-6 w-6"/>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </Box>
                </RadioGroup>
            </div>
        </div>
    )
}
