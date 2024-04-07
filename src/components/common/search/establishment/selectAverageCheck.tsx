import {useList, useTranslate} from "@refinedev/core";
import React, {useEffect} from "react";

import {CustomSelectPopover} from "@/components/common/custom/customSelectPopover";
import {SearchByAverageCheckComponent} from "@/components/common/search";
import {SetFilterType} from "@/interfaces/types";
import {ESTABLISHMENT} from "@/config/names";
import {Loading} from "@/components";
import { SxProps } from "@mui/material";

type TProps = {
    valueGte: number,
    setValueGte: (value: number) => void,
    valueLte: number,
    setValueLte: (value: number) => void,
    setFilters: SetFilterType,
    handleSearch?: () => void,
    buttonsStyle?: SxProps
}

export const SelectAverageCheck = ({
                                       setFilters,
                                       handleSearch,
                                       setValueLte,
                                       setValueGte,
                                       valueGte,
                                       valueLte,
                                       buttonsStyle
                                   }: TProps) => {
    const translate = useTranslate();

    const {data, isLoading, isError, refetch} = useList({
        resource: `${ESTABLISHMENT}/getAverageCheck`
    });

    useEffect(() => {
        if (isError) {
            (async () => refetch())();
        }
    }, [isError]);

    const minValue = data?.data?.[0]?.minValue || 0;
    const maxValue = data?.data?.[0]?.maxValue || 100000;

    const title = () => {
        if (valueGte !== minValue && valueLte !== maxValue) {
            return "₴" + `${valueGte}` + " - " + "₴" + `${valueLte}`
        }
        if (valueGte !== minValue && valueLte === maxValue) {
            return translate('text.from') + " " + "₴" + `${valueGte}`;
        }
        if (valueGte === minValue && valueLte !== maxValue) {
            return translate('text.to') + " " + "₴" + `${valueLte}`;
        }
        return translate('home.create.averageCheck');
    }

    useEffect(() => {
        if (valueGte <= minValue) {
            setValueGte(minValue);
        }
        if (valueLte >= maxValue) {
            setValueLte(maxValue)
        }
    }, [valueLte, valueGte, maxValue, minValue])

    return (
        <CustomSelectPopover
            buttonStyles={{
                height: '42px',
                ...buttonsStyle
            }}
            isShowSearchButton={true}
            text={title()}
            handleSearch={handleSearch}
        >
            {
                isLoading
                    ? <Loading height={'100px'}/>
                    : (
                        <SearchByAverageCheckComponent
                            maxValue={maxValue}
                            minValue={minValue}
                            valueGte={valueGte}
                            setValueGte={setValueGte}
                            valueLte={valueLte}
                            setValueLte={setValueLte}
                            setFilters={setFilters}
                        />
                    )
            }
        </CustomSelectPopover>
    );
};

