import {CrudFilters, getDefaultFilter, HttpError, useTranslate} from "@refinedev/core";
import {Autocomplete, Box, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {useAutocomplete} from "@refinedev/mui";
import {Controller} from "react-hook-form";

import {IPropertyPropsFilterVariables, IEstablishment} from "@/interfaces/common";
import {SearchInputComponent} from "@/components/common/search";
import {SetFilterType} from "@/interfaces/types";
import {GridFilter} from "@/components/grid";
import {ESTABLISHMENT} from "@/config/names";

type TProps = {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    setFilters: SetFilterType,
    search:  (value: any) => Promise<void>,
    filters: CrudFilters,
    averageCheckGte: number,
    setAverageCheckGte: Dispatch<SetStateAction<number>>,
    averageCheckLte: number,
    setAverageCheckLte: Dispatch<SetStateAction<number>>
}
const EstablishmentFiltersStat = ({setFilters, search, value, setValue, filters, averageCheckGte, setAverageCheckGte, setAverageCheckLte, averageCheckLte}: TProps) => {

    const translate = useTranslate();

    const {control, register, handleSubmit} = useForm<IEstablishment, HttpError, IPropertyPropsFilterVariables>({
        refineCoreProps: {
            resource: `${ESTABLISHMENT}/all`
        },
        defaultValues: {
            city: getDefaultFilter("city", filters, "eq"),
            title: getDefaultFilter("title", filters, "contains"),
            type: getDefaultFilter("type", filters, "eq"),
            averageCheck_gte: getDefaultFilter('averageCheck', filters, "gte"),
            averageCheck_lte: getDefaultFilter('averageCheck', filters, "lte"),
        }
    });

    const {autocompleteProps} = useAutocomplete({
        resource: "city/all",
        defaultValue: getDefaultFilter("city", filters, "eq")
    });
    const options = [
        {
            value: "published",
            title: translate('posts.fields.status.published')
        },
        {
            value: "draft",
            title: translate('capl.status.draft')
        },
        {
            value: "rejected",
            title: translate('capl.status.rejected')
        }
    ];

    const typeOptions = [
        {
            value: 'bar',
            title: translate('home.sortByType.bar')
        },
        {
            value: 'cafe',
            title: translate('home.sortByType.cafe')
        },
        {
            value: 'restaurant',
            title: translate('home.sortByType.restaurant')
        },
    ]

    return (
        <Box>
            <GridFilter onSubmit={handleSubmit(search)}>
                <Controller
                    control={control}
                    name="type"
                    render={({field}) => (
                        <Autocomplete
                            options={typeOptions as any}
                            {...field}
                            color={'secondary'}
                            onChange={(_, value: any) => {
                                field.onChange(value?.value ?? value);
                            }}
                            getOptionLabel={(item) => {
                                return item.title
                                    ? item.title
                                    : typeOptions?.find(
                                    (p) =>
                                        p.value === item
                                )?.title ?? "";
                            }}
                            isOptionEqualToValue={(option, value) => {
                                return value === undefined ||
                                    option?.value === value
                            }
                            }
                            value={field?.value || null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    color={'secondary'}
                                    label={translate("home.create.type.title")}
                                    placeholder={translate("home.create.type.title")}
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="verify"
                    render={({field}) => (
                        <Autocomplete
                            options={options as any}
                            {...field}
                            color={'secondary'}
                            onChange={(_, value: any) => {
                                field.onChange(value?.value ?? value);
                            }}
                            getOptionLabel={(item) => {
                                return item.title
                                    ? item.title
                                    : options?.find(
                                    (p) =>
                                        p.value === item
                                )?.title ?? "";
                            }}
                            isOptionEqualToValue={(option, value) => {
                                return value === undefined ||
                                    option?.value === value
                            }
                            }
                            value={field?.value || null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    color={'secondary'}
                                    label={translate("posts.fields.status.title")}
                                    placeholder={translate("posts.fields.status.title")}
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="city"
                    render={({field}) => (
                        <Autocomplete
                            {...autocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value?.name ?? value);
                            }}
                            color={'secondary'}
                            value={field?.value || null}
                            getOptionLabel={(item) => {
                                return item.name
                                    ? item.name
                                    : autocompleteProps?.options?.find(
                                    (p) =>
                                        p.name.toString() ===
                                        item.toString(),
                                )?.name ?? "";
                            }}
                            isOptionEqualToValue={(option, value) =>
                                value === undefined ||
                                option?.name?.toString() ===
                                (value?.name ?? value)?.toString()
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    color={'secondary'}
                                    label={translate("home.create.city")}
                                    placeholder="Search city"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    width: '100%',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <TextField
                        fullWidth
                        value={averageCheckGte ? averageCheckGte : 0}
                        onChange={(e) => setAverageCheckGte(Number(e.target.value))}
                        color={'secondary'}
                        label={translate("capl.create.date")}
                        placeholder="Date"
                        type={"number"}
                        variant="outlined"
                        size="small"
                    />

                    <TextField
                        fullWidth
                        value={averageCheckLte ? averageCheckLte : 2000}
                        onChange={(e) => setAverageCheckLte(Number(e.target.value))}
                        color={'secondary'}
                        label={translate("capl.create.date")}
                        placeholder="Date"
                        type={"number"}
                        variant="outlined"
                        size="small"
                    />
                </Box>
            </GridFilter>
            <Box sx={{
                maxWidth: '600px',
                width: '100%'
            }}>
                <SearchInputComponent
                    searchValue={value}
                    setSearchValue={setValue}
                    defaultSetFilters={setFilters}
                    isButton={false}
                />
            </Box>
        </Box>
    );
};
export default EstablishmentFiltersStat
