import {Box, FormControl, FormHelperText, Slider, TextField} from "@mui/material";
import React, {ChangeEvent} from "react";
import {useTranslate} from "@refinedev/core";

import {SetFilterType} from "@/interfaces/types";
import {textFieldStyle} from "@/styles";


type TProps = {
    valueGte: number,
    setValueGte: (value: number) => void,
    valueLte: number,
    setValueLte: (value: number) => void,
    setFilters: SetFilterType,
    minValue: number,
    maxValue: number,
}
const SearchByAverageCheckComponent = ({
                                           valueGte,
                                           minValue,
                                           maxValue,
                                           valueLte,
                                           setValueLte,
                                           setValueGte,
                                           setFilters,
                                       }: TProps) => {

    const translate = useTranslate();

    const handleChange = (newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setValueLte(newValue[1])
            setValueGte(newValue[0])
            setFilters([
                {
                    field: 'averageCheck',
                    operator: 'lte',
                    value: newValue[1]
                },
                {
                    field: 'averageCheck',
                    operator: 'gte',
                    value: newValue[0]
                }
            ])
        }
    };

    return (
        <FormControl
            sx={{
                width: '100%', minWidth: '250px'
            }}>
            <FormHelperText
                sx={{
                    fontSize: '14px',
                    mb: 0.5,
                    color: 'text.primary'
                }}
            >
                {translate('home.create.averageCheck')}
            </FormHelperText>
            <Box sx={{
                width: '100%',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                }}>
                    <TextField
                        color={"secondary"}
                        sx={{
                            width: '40%',
                            borderColor: 'silver',
                            minWidth: '30%',
                            ...textFieldStyle
                        }}
                        id="outlined-number-1"
                        size={"small"}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            inputProps: {
                                min: minValue,
                                max: maxValue
                            }
                        }}
                        value={valueGte}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setValueGte(Number(e.target.value))
                            setFilters([{
                                field: 'averageCheck',
                                operator: 'gte',
                                value: e.target.value ? e.target.value : undefined
                            }])
                        }}
                    />
                    <TextField
                        color={"secondary"}
                        sx={{
                            width: '40%',
                            borderColor: 'silver',
                            minWidth: '30%',
                            ...textFieldStyle
                        }}
                        InputProps={{
                            inputProps: {
                                min: minValue,
                                max: maxValue
                            }
                        }}
                        id="outlined-number-2"
                        size={"small"}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={valueLte}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setValueLte(Number(e.target.value))
                            setFilters([{
                                field: 'averageCheck',
                                operator: 'lte',
                                value: e.target.value ? e.target.value : undefined
                            }])
                        }}
                    />
                </Box>
                <Box sx={{
                    width: '90%',
                    margin: 'auto'
                }}>
                    <Slider
                        color={"secondary"}
                        value={[Number(valueGte), Number(valueLte)]}
                        min={minValue}
                        max={maxValue}
                        onChange={(__: any, value: any) => {
                            handleChange(value);
                        }}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </Box>
        </FormControl>
    );
};
export default SearchByAverageCheckComponent;
