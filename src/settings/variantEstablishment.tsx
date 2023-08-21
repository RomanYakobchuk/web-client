import {createContext, FC, PropsWithChildren, useEffect, useState} from "react";

type TVariant = {
    variant: IVariant['variant'],
    setVariant: (value: IVariant['variant']) => void
    newsVariant: IVariant['newsVariant'],
    setNewsVariant: (value: IVariant['newsVariant']) => void
}

export interface IVariant {
    variant: 'variant_1' | 'variant_2',
    newsVariant: 'variant_1' | 'variant_2'
}

export const VariantContext = createContext<TVariant>({} as TVariant);


export const VariantProvider: FC<PropsWithChildren> = ({children}) => {
    const selectedVariant = window.localStorage.getItem("variant_place") as string;
    const selectedNewsVariant = window.localStorage.getItem("variant_news") as string;


    const [variant, setVariant] = useState<IVariant["variant"]>(
        (selectedVariant as IVariant["variant"]) || "variant_1"
    );
    const [newsVariant, setNewsVariant] = useState<IVariant["newsVariant"]>(
        (selectedNewsVariant as IVariant["newsVariant"]) || "variant_1"
    );

    useEffect(() => {
        window.localStorage.setItem("variant_place", variant);
    }, [variant]);
    useEffect(() => {
        window.localStorage.setItem("variant_news", newsVariant);
    }, [newsVariant]);


    const schemaContextValue: TVariant = {
        variant,
        setVariant,
        setNewsVariant,
        newsVariant
    };

    return (
        <VariantContext.Provider value={schemaContextValue}>
            {children}
        </VariantContext.Provider>
    );
};