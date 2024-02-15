import {useState, useEffect, useMemo} from "react";
import {axiosInstance} from "../authProvider";

interface IAxiosResponse<T> {
    data: T,
    status: number,
    statusText: string,
    headers: {},
    config: {},
    request: {}
}
interface IUseAxiosProps {
    url: string;
    method: "post" | "get" | "patch" | "delete";
    body?: any;
}
export const useFetch = <T>({url, method, body}: IUseAxiosProps) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                let response: IAxiosResponse<T>;
                if (method === 'get') {
                    response = await axiosInstance[method](url);
                } else {
                    response = await axiosInstance[method](url, {...body});
                }
                setIsLoading(false)
                setData(response?.data);
                setIsError(false);
            } catch (e) {
                setIsError(true);
                setIsLoading(false)
            }
        };
        fetchData().then(r => r);
    }, [url, method, body]);

    const memorizedData = useMemo(() => data, [data]);

    return {
        data: memorizedData,
        isLoading,
        isError
    };
};
