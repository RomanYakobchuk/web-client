import {IGetIdentity, ProfileProps} from "@/interfaces/common";
import {useGetIdentity} from "@refinedev/core";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from "@/config/const";

type TProps = {
    user: ProfileProps,
    favoriteEstablishment: string[],
    access_token: string,
    refresh_token: string,
}
export const useUserInfo = (): TProps => {
    const {data} = useGetIdentity<IGetIdentity>();
    const user = data?.user?._id ? data?.user as ProfileProps : {} as ProfileProps;
    const favoriteEstablishment = data?.favoritePlaces as string[];

    const access_token = localStorage.getItem(`${ACCESS_TOKEN_KEY}`) || "";
    const refresh_token = localStorage.getItem(`${REFRESH_TOKEN_KEY}`) || "";
    return {
        user,
        favoriteEstablishment,
        access_token,
        refresh_token
    }
}