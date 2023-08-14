import axios, {AxiosRequestConfig} from "axios";
import {parseJwt} from "utils/parse-jwt";
import {IData, IGetIdentity, ProfileProps} from "./interfaces/common";
import type {AuthBindings} from "@refinedev/core";


export const ACCESS_TOKEN_KEY = "access-refine-auth";
export const REFRESH_TOKEN_KEY = "refresh-refine-auth";

export const baseURL = `${process.env.REACT_APP_API}/api/v1`;
// export const baseURL = ``;

export const axiosInstance = axios.create({
    baseURL, headers: {
        'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
    }
});

function isAccessTokenExpired(access_token: string) {
    const token_a = parseJwt(access_token);
    const dateNow = new Date();
    if (token_a?.exp) {
        return token_a?.exp * 1000 > dateNow.getTime();
    } else {
        return false
    }
}

let _isRefreshing = false;
let _refreshSubscribers: any[] = [];

const subscribeTokenRefresh = (cb: any) => {
    _refreshSubscribers.push(cb);
};

const onTokenRefreshed = () => {
    _refreshSubscribers.map((cb) => cb());
};

axiosInstance.interceptors.request.use(async (request: AxiosRequestConfig) => {
        const access_token = await localStorage.getItem(ACCESS_TOKEN_KEY);
        if (access_token && isAccessTokenExpired(access_token)) {
            if (request.headers) {
                request.headers["Authorization"] = access_token;
            } else {
                request.headers = {
                    Authorization: access_token,
                };
            }
        }
        return request;
    },
    (error) => Promise.reject(error)
);


// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response
//     },
//     async (error) => {
//         if (error.response) {
//             const config = error?.config;
//             if (error?.response?.status === 401 && !config._retry) {
//                 config._retry = true;
//                 try {
//                     const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
//                     const response = await axios.post(`${baseURL}/auth/refreshToken`, {
//                         refresh_token
//                     })
//                     config.headers.authorization = response?.data?.access_token;
//
//                     localStorage.setItem(ACCESS_TOKEN_KEY, response?.data?.access_token)
//                     localStorage.setItem(REFRESH_TOKEN_KEY, response?.data?.refresh_token)
//                     localStorage.setItem("user", response?.data?.user)
//
//                     config._retry = true;
//
//                     return await axios.request(config);
//                 } catch (error: any) {
//                     if (error?.response?.data?.code === 401 || error?.response?.data?.code === '401') {
//
//                         localStorage.removeItem(ACCESS_TOKEN_KEY);
//                         localStorage.removeItem(REFRESH_TOKEN_KEY);
//                         localStorage.removeItem("user");
//                         return window.location.reload();
//                     }
//                     return Promise.reject(error)
//                 }
//             }
//         }
//         return Promise.reject(error)
//     }
// )

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            const config = error?.config;
            if (error?.response?.status === 401 && !config._retry) {
                if (!_isRefreshing) {
                    config._retry = true;
                    _isRefreshing = true;

                    try {
                        const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
                        if (!refresh_token) {
                            window.location.reload();
                            return Promise.reject(error)
                        }
                        const response = await axios.post(`${baseURL}/auth/refreshToken`, {
                            refresh_token,
                        });

                        config.headers.authorization = response?.data?.access_token;

                        localStorage.setItem(ACCESS_TOKEN_KEY, response?.data?.access_token);
                        localStorage.setItem(REFRESH_TOKEN_KEY, response?.data?.refresh_token);
                        localStorage.setItem("user", response?.data?.user);

                        onTokenRefreshed();
                        config._retry = true;

                        return await axios.request(config);
                    } catch (error: any) {
                        if (
                            error?.response?.data?.code === 401 ||
                            error?.response?.data?.code === "401"
                        ) {
                            localStorage.removeItem(ACCESS_TOKEN_KEY);
                            localStorage.removeItem(REFRESH_TOKEN_KEY);
                            localStorage.removeItem("user");
                            return window.location.reload();
                        }
                        return {};
                    } finally {
                        _isRefreshing = false;
                    }
                } else {
                    const retryOriginalRequest = new Promise((resolve) => {
                        subscribeTokenRefresh(() => {
                            resolve(axios.request(config));
                        });
                    });
                    return retryOriginalRequest;
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authProvider: AuthBindings = {
        login: async ({user, access_token, refresh_token, favoritePlaces}: IData) => {
            if (user) {
                const profileObj = user ? parseJwt(user) : null;

                if (profileObj) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                    localStorage.setItem('favoritePlaces', JSON.stringify(favoritePlaces));
                    localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
                    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)

                    window.location.reload();
                    return {
                        success: true,
                    }
                } else {
                    return {
                        success: false
                    }
                }
            }
            return {
                success: false
            };
        },
        logout: async () => {
            await axiosInstance.get('/auth/logout')
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem("user");
            return {
                success: true,
                redirectTo: '/login'
            };
        },
        onError: async (error) => {
            return {error}
        },
        check: async () => {
            const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
            const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (!access_token || !refresh_token) {
                return {
                    authenticated: false,
                    error: new Error("Not authenticated"),
                    logout: true,
                    success: false,
                    redirectTo: '/login'
                }
            } else if (access_token && refresh_token) {
                return {
                    authenticated: true
                }
            }
            return {
                authenticated: false,
                redirectTo: '/login'
            };

        },
        getPermissions: async () => {
            return null;
        },
        getIdentity: async (): Promise<IGetIdentity | any> => {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY) as string;
            const refresh = localStorage.getItem(REFRESH_TOKEN_KEY) as string;
            const favoritePlaces = JSON.parse(localStorage.getItem('favoritePlaces') as string);
            const user = localStorage.getItem("user") as string;
            if (!token || (refresh && !isAccessTokenExpired(refresh))) {
                return {
                    authenticated: false,
                    error: new Error("Not authenticated"),
                    logout: true,
                    redirectTo: '/login'
                };
            }
            const data = user ? parseJwt(user) : null;

            if (!data) return null;

            return {
                user: data?._doc ?? data as ProfileProps,
                favoritePlaces: favoritePlaces as string[]
            }
        },
    }
;
