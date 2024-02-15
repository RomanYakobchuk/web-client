import {Autocomplete, Box, TextField} from "@mui/material";
import {GridFilter} from "@/components/grid";
import {Controller} from "react-hook-form";
import {SearchInputComponent} from "@/components/common/search";
import React, {Dispatch, SetStateAction} from "react";
import {HttpError, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import {IProfilePropsFilterVariables, ProfileProps} from "@/interfaces/common";
import {SetFilterType} from "@/interfaces/types";
import {useMobile} from "@/hook";

type TProps = {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    setFilters: SetFilterType,
    search:  (value: any) => Promise<void>
}
const UserFiltersStat = ({setFilters, value, setValue, search}: TProps) => {
    const translate = useTranslate();
    const {width} = useMobile();

    const {control, handleSubmit} = useForm<ProfileProps, HttpError, IProfilePropsFilterVariables>({
        refineCoreProps: {
            resource: 'users/findUserByQuery'
        },
    });
    const options = [
        {
            value: "user",
            title: translate('roles.user')
        },
        {
            value: "admin",
            title: translate('roles.admin')
        },
        {
            value: "manager",
            title: translate('roles.manager')
        }
    ];
    const stateOptions = (type: string) => [
        {
            value: true,
            title: translate(`posts.fields.status.${type}.true`)
        },
        {
            value: false,
            title: translate(`posts.fields.status.${type}.false`)
        }
    ];
    return (
        <Box>
            <GridFilter onSubmit={handleSubmit(search)}>
                <Controller
                    control={control}
                    name="status"
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
                    name="isActivated"
                    render={({field}) => (
                        <Autocomplete
                            options={stateOptions('email') as any}
                            {...field}
                            color={'secondary'}
                            onChange={(_, value: any) => {
                                field.onChange(value?.value === true || value?.value === false ? value?.value : value);
                            }}
                            getOptionLabel={(item) => {
                                return item.title
                                    ? item.title
                                    : stateOptions('email')?.find(
                                    (p) =>
                                        p.value === item
                                )?.title ?? "";
                            }}
                            isOptionEqualToValue={(option, value) => {
                                return value === undefined ||
                                    option?.value === value
                            }
                            }
                            value={field?.value === true || field?.value === false ? field?.value : null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    color={'secondary'}
                                    label={translate("posts.fields.status.email.title")}
                                    placeholder={translate("posts.fields.status.email.title")}
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="phoneVerify"
                    render={({field}) => (
                        <Autocomplete
                            options={stateOptions('phone') as any}
                            {...field}
                            color={'secondary'}
                            onChange={(_, value: any) => {
                                field.onChange(value?.value === true || value?.value === false ? value?.value : value);
                            }}
                            getOptionLabel={(item) => {
                                return item.title
                                    ? item.title
                                    : stateOptions('phone')?.find(
                                    (p) =>
                                        p.value === item
                                )?.title ?? "";
                            }}
                            isOptionEqualToValue={(option, value) => {
                                return value === undefined ||
                                    option?.value === value
                            }
                            }
                            value={field?.value === true || field?.value === false ? field?.value : null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    color={'secondary'}
                                    label={translate("posts.fields.status.phone.title")}
                                    placeholder={translate("posts.fields.status.phone.title")}
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    )}
                />
            </GridFilter>
            <Box sx={{
                width: '100%',
                maxWidth: '600px'
            }}>
                <SearchInputComponent
                    isButton={width >= 600}
                    searchValue={value}
                    setSearchValue={setValue}
                    defaultSetFilters={setFilters}
                />
            </Box>
        </Box>
    );
};
export default UserFiltersStat
