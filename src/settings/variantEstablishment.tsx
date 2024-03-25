import {createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useState} from "react";

type TVariant = {
    variantShowItems: TVariantShowItems,
    setVariantShowItems: Dispatch<SetStateAction<TVariantShowItems>>
}

export interface IVariant {
    variant: 'variant_2' | 'variant_1',
    newsVariant: 'variant_1' | 'variant_2'
}
type TVariantShowItems = {
    establishment: IVariant['variant'],
    news: IVariant['variant'],
}
export const VariantContext = createContext<TVariant>({} as TVariant);

const VSI = 'variant_show_items';
export const VariantProvider: FC<PropsWithChildren> = ({children}) => {
    const selectedVariants = window.localStorage.getItem("variant_show_items") as string;

    const [variantShowItems, setVariantShowItems] = useState<TVariantShowItems>(selectedVariants ? JSON.parse(selectedVariants) : {establishment: "variant_2", news: "variant_1"} as TVariant["variantShowItems"]);

    useEffect(() => {
        window.localStorage.setItem(VSI, JSON.stringify(variantShowItems));
    }, [variantShowItems]);

    const schemaContextValue: TVariant = {
        variantShowItems,
        setVariantShowItems
    };

    return (
        <VariantContext.Provider value={schemaContextValue}>
            {children}
        </VariantContext.Provider>
    );
};