import {useEffect, useState} from "react";
import {axiosInstance} from "../authProvider";


export interface IState<T> {
    isLoading: boolean,
    isError: Error | null,
    isFetching: boolean,
    data: T[],
    count: number,
    updateOtherParams: (newParams: {}) => void
}

export const useLazyScrollLoading = <T>(url: string, _end: number, params = {}): IState<T> => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState(null);
    const [count, setCount] = useState<number>(0);
    const [otherParams, setOtherParams] = useState(params);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        const getData = setTimeout(() => {
            axiosInstance.get(url, {
                params: {
                    _end: _end * 10,
                    _start: _end * 10 - 10,
                    ...otherParams
                }
            }).then(res => {
                setData(res.data)
                setCount(Number(res.headers['x-total-count']))
            })
                .catch(setIsError)
                .finally(() => setIsLoading(false))
        }, 1000);

        return () => clearTimeout(getData);

    }, [url, _end, otherParams]);

    useEffect(() => {
        const isF = +count > data?.length;
        setIsFetching(isF as boolean);
    }, [count, data?.length]);
    const updateOtherParams = (newParams = {}) => {
        setOtherParams(newParams);
    };
    return {
        data,
        isError,
        isLoading,
        count,
        updateOtherParams,
        isFetching
    }
}