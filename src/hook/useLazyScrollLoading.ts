import {useEffect, useRef, useState} from "react";
import {axiosInstance} from "../authProvider";


export interface IState<T> {
    isLoading: boolean,
    isError: Error | null,
    isFetching: boolean,
    data: T[],
    count: number,
    updateOtherParams: (newParams: {}) => void,
    loadData: (params?: {}) => void
}

type SetProps = {
    url: string,
    _end: number,
    params?: {},
    call?: boolean,
    pageSize?: number
}
export const useLazyScrollLoading = <T>({url, _end, params = {}, call = true, pageSize = 10}: SetProps): IState<T> => {

    const fetchDataRef = useRef<() => void>();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState(null);
    const [count, setCount] = useState<number>(0);
    const [otherParams, setOtherParams] = useState(params);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const getData = setTimeout(() => {
            const fetchData = () => {
                setIsLoading(true);
                axiosInstance.get(url, {
                    params: {
                        _end: _end * pageSize,
                        _start: _end * pageSize - pageSize,
                        ...params,
                        ...otherParams
                    }
                }).then(res => {
                    setData(res.data)
                    setCount(Number(res.headers['x-total-count']))
                })
                    .catch(setIsError)
                    .finally(() => setIsLoading(false))
            }
            fetchDataRef.current = fetchData;

            if (call) {
                fetchData();
            }

        }, 1000);

        return () => {
            clearTimeout(getData)
        };

    }, [url, _end, otherParams, call]);

    // useEffect(() => {
    //     const fetchData = () => {
    //         setIsLoading(true);
    //
    //         axiosInstance
    //             .get(url, {
    //                 params: {
    //                     _end: _end * 10,
    //                     _start: _end * 10 - 10,
    //                     ...otherParams,
    //                 },
    //             })
    //             .then((res) => {
    //                 setData(res.data);
    //                 setCount(Number(res.headers["x-total-count"]));
    //             })
    //             .catch(setIsError)
    //             .finally(() => {
    //                 setIsLoading(false);
    //                 setIsFetching(false);
    //             });
    //     };
    //
    //     fetchDataRef.current = fetchData;
    //
    //     if (call) {
    //         fetchData();
    //     }
    //
    //     const isF = +count > data.length;
    //     setIsFetching(isF as boolean);
    //
    //     return fetchData;
    // }, [url, _end, otherParams, call]);

    useEffect(() => {
        const isF = +count > data?.length;
        setIsFetching(isF as boolean);
    }, [count, data?.length]);
    const updateOtherParams = (newParams = {}) => {
        setOtherParams(newParams);
    };

    const loadData = () => {
        // updateOtherParams(params);
        setIsFetching(true)
        fetchDataRef?.current?.();
    };
    return {
        data,
        isError,
        isLoading,
        count,
        updateOtherParams,
        isFetching,
        loadData
    }
}