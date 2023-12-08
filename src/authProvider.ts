import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import type {AuthBindings} from "@refinedev/core";

import {parseJwt} from "./utils";
import {IData, IGetIdentity, ProfileProps} from "./interfaces/common";
import {
    ACCESS_TOKEN_KEY,
    localFavPlacesKey,
    localKeyEstablishment,
    localKeyLeaveCommentAs,
    REFRESH_TOKEN_KEY, USER_PROPERTY
} from "./config/const";

export const baseURL = `${import.meta.env.VITE_APP_API}/api/v1`;
export const axiosInstance: AxiosInstance = axios.create({
    baseURL, headers: {
        'Access-Control-Allow-Origin': `${import.meta.env.VITE_APP_API}`,
        'Content-Type': 'application/json;charset=UTF-8'
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
        const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
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
                        localStorage.setItem(localFavPlacesKey, JSON.stringify(response?.data?.favoritePlaces));
                        localStorage.setItem(USER_PROPERTY, JSON.stringify({
                            notReadNotifications: response?.data?.countNotReadNotifications || 0
                        }))
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
                            localStorage.removeItem(localKeyLeaveCommentAs);
                            localStorage.removeItem(localKeyEstablishment);
                            localStorage.removeItem("user");
                            localStorage.removeItem(localFavPlacesKey);
                            localStorage.removeItem(USER_PROPERTY);
                            return window.location.reload();
                        }
                        return {};
                    } finally {
                        _isRefreshing = false;
                    }
                } else {
                    return new Promise((resolve) => {
                        subscribeTokenRefresh(() => {
                            resolve(axios.request(config));
                        });
                    });
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authProvider: AuthBindings = {
        login: async ({user, access_token, refresh_token, favoritePlaces, countNotReadNotifications}: IData) => {
            if (user) {
                const profileObj = user ? parseJwt(user) : null;
                if (profileObj) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                    localStorage.setItem(localFavPlacesKey, JSON.stringify(favoritePlaces ?? []));
                    localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
                    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
                    localStorage.setItem(USER_PROPERTY, JSON.stringify({
                        notReadNotifications: countNotReadNotifications || 0
                    }))

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
            localStorage.removeItem(localKeyLeaveCommentAs);
            localStorage.removeItem(localKeyEstablishment);
            localStorage.removeItem("user");
            localStorage.removeItem(localFavPlacesKey);
            localStorage.removeItem(USER_PROPERTY);
            axios.defaults.headers.common = {};
            return {
                success: true,
            };
        },
        onError: async (error) => {
            return {error}
        },
        check: async () => {
            const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
            const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (!access_token && !refresh_token) {
                return {
                    authenticated: false,
                    error: new Error("Not authenticated"),
                    logout: true,
                    success: false,
                    redirectTo: '/login'
                }
            } else if (access_token || refresh_token) {
                return {
                    authenticated: true
                }
            }
            return {
                authenticated: false,
                redirectTo: '/login',
                logout: true
            };

        },
        getPermissions: async () => {
            const userToken = localStorage.getItem('user') as string;
            const user = userToken ? parseJwt(userToken) : null;
            if (user) {
                return user?._doc?.status ?? user?.status
            }
            return "user";
        },
        getIdentity: async (): Promise<IGetIdentity | any> => {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY) as string;
            const refresh = localStorage.getItem(REFRESH_TOKEN_KEY) as string;
            const favoritePlaces = JSON.parse(localStorage.getItem(localFavPlacesKey) as string);
            const user = localStorage.getItem("user") as string;
            if (!token && (refresh && !isAccessTokenExpired(refresh))) {
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
