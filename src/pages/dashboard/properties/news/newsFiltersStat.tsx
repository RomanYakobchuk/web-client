import {CrudFilters, getDefaultFilter, HttpError, useTranslate} from "@refinedev/core";
import {Autocomplete, Box, InputAdornment, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {useAutocomplete} from "@refinedev/mui";
import {GridFilter} from "@/components/grid";
import {Controller} from "react-hook-form";
import {Clear} from "@mui/icons-material";

import {SearchInputComponent} from "@/components/common/search";
import {INews, INewsFilterVariables} from "@/interfaces/common";
import {SetFilterType} from "@/interfaces/types";
import {ESTABLISHMENT} from "@/config/names";

type TProps = {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    setFilters: SetFilterType,
    search:  (value: any) => Promise<void>,
    filters: CrudFilters,
    dateEventGte: Date | null,
    dateEventLte: Date | null,
    setDateEventGte: Dispatch<SetStateAction<Date | null>>,
    setDateEventLte: Dispatch<SetStateAction<Date | null>>,
}
const NewsFiltersStat = ({setFilters, search, setValue, value, filters, dateEventGte, dateEventLte, setDateEventLte, setDateEventGte}: TProps) => {
    const translate = useTranslate();
    const {control, handleSubmit} = useForm<INews, HttpError, INewsFilterVariables>({
        refineCoreProps: {
            resource: 'news/all'
        },
        defaultValues: {
            title: getDefaultFilter("title", filters, "contains"),
        }
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
    const categoryOptions = [
        {
            value: 'general',
            title: translate('news.sortByCategory.general')
        },
        {
            value: 'event',
            title: translate('news.sortByCategory.events')
        },
        {
            value: 'promotions',
            title: translate('news.sortByCategory.promotions')
        },
    ];
    const {autocompleteProps} = useAutocomplete({
        resource: `${ESTABLISHMENT}/userestablishments`,
        defaultValue: getDefaultFilter("establishment._id", filters, "eq")
    });

    const handleClearDateLte = () => {
        setDateEventLte(null);
    };

    const handleClearDateGte = () => {
        setDateEventGte(null);
    };

    return (
        <Box>
            <GridFilter onSubmit={handleSubmit(search)}>
                <Controller
                    control={control}
                    name="establishment"
                    render={({field}) => (
                        <Autocomplete
                            {...autocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value?._id ?? value);
                            }}
                            color={'secondary'}
                            value={field?.value || null}
                            getOptionLabel={(item) => {
                                return item.title
                                    ? item.title
                                    : autocompleteProps?.options?.find(
                                    (p) =>
                                        p._id.toString() ===
                                        item.toString(),
                                )?.title ?? "";
                            }}
                            isOptionEqualToValue={(option, value) =>
                                value === undefined ||
                                option?._id?.toString() ===
                                (value?._id ?? value)?.toString()
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    color={'secondary'}
                                    label={translate("home.one")}
                                    placeholder="Search establishment"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={"status"}
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
                    name={"category"}
                    render={({field}) => (
                        <Autocomplete
                            options={categoryOptions as any}
                            {...field}
                            color={'secondary'}
                            onChange={(_, value: any) => {
                                field.onChange(value?.value ?? value);
                            }}
                            getOptionLabel={(item) => {
                                return item.title
                                    ? item.title
                                    : categoryOptions?.find(
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
                                    label={translate("posts.fields.category.title")}
                                    placeholder={translate("posts.fields.category.title")}
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
                        value={dateEventGte ? dateEventGte.toISOString().split('T')[0] : ''}
                        onChange={(e) => setDateEventGte(new Date(e.target.value))}
                        color={'secondary'}
                        label={translate("capl.create.date")}
                        placeholder="Date"
                        type={"date"}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Clear sx={{cursor: 'pointer'}} onClick={handleClearDateGte}/>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        value={dateEventLte ? dateEventLte.toISOString().split('T')[0] : ""}
                        onChange={(e) => setDateEventLte(new Date(e.target.value))}
                        color={'secondary'}
                        label={translate("capl.create.date")}
                        placeholder="Date"
                        type={"date"}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Clear sx={{cursor: 'pointer'}} onClick={handleClearDateLte}/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </GridFilter>
            <Box>
                <SearchInputComponent
                    searchValue={value}
                    setSearchValue={setValue}
                    defaultSetFilters={setFilters}
                />
            </Box>
        </Box>
    );
};
export default NewsFiltersStat
