import {IGetIdentity, ProfileProps} from "@/interfaces/common";
import {useGetIdentity} from "@refinedev/core";

type TProps = {
    user: ProfileProps,
    favoriteEstablishment: string[]
}
export const useUserInfo = (): TProps => {
    const {data} = useGetIdentity<IGetIdentity>();
    const user = data?.user?._id ? data?.user as ProfileProps : {} as ProfileProps;
    const favoriteEstablishment = data?.favoritePlaces as string[];

    return {
        user,
        favoriteEstablishment
    }
}