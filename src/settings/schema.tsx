import {createContext, FC, PropsWithChildren, ReactNode, useContext, useEffect, useState} from "react";
import {useMobile} from "../utils";

type ISchemaType = {
    styles: {
        marginS: string,
        borderRadiusS: string,
        heightLayoutS: string,
        heightSiderS: string,
        marginSiderS: string,
        gapS: number,
        buttonSiderS: {
            left: string,
            top: { xs: string, sm: string },
            borderRadius: string,
            transform: string
        },
    },
    schema: Schema['type'],
    setSchema: (value: Schema['type']) => void
}

export interface Schema {
    type: 'schema_1' | 'schema_2' | 'schema_3'
}

interface Props {
    children: ReactNode;
}

export const SchemaContext = createContext<ISchemaType>({} as ISchemaType);

export const useSchema = (): ISchemaType => {
    const context = useContext(SchemaContext);
    if (!context) {
        throw new Error("useSchema must be used within a SchemaProvider");
    }
    return context;
};

export const SchemaProvider: FC<PropsWithChildren> = ({children}) => {
    const selectedSchema = window.localStorage.getItem("schema") as string;

    const {width} = useMobile();

    const [schema, setSchema] = useState<Schema["type"]>(
        (selectedSchema as Schema["type"]) || "schema_1"
    );
    const [buttonSiderS, setButtonSiderS] = useState<ISchemaType['styles']['buttonSiderS']>({left: '0', top: {xs: "10px", sm: '15px'}, transform: 'translate(25%, 35%)', borderRadius: '0px 6px 0px 6px'});
    const [marginS, setMarginS] = useState<string>("0");
    const [gapS, setGapS] = useState<number>(0);
    const [marginSiderS, setMarginSiderS] = useState<string>("0");
    const [borderRadiusS, setBorderRadiusS] = useState<string>("0");
    const [heightLayoutS, setHeightLayoutS] = useState<string>("100%");
    const [heightSiderS, setHeightSiderS] = useState<string>("100%");

    useEffect(() => {
        window.localStorage.setItem("schema", schema);
        applyStyles(schema);
    }, [schema, width]);

    const applyStyles = (selectedSchema: Schema["type"]) => {
        if (selectedSchema === "schema_1") {
            setMarginS("0");
            setMarginSiderS("0");
            setBorderRadiusS("0");
            setGapS(0)
            setHeightLayoutS("100vh");
            setHeightSiderS("100%")
            setButtonSiderS({
                top: {xs: "8px", sm: '12px'},
                left: '0px',
                transform: 'translate(0, 35%)',
                borderRadius: '0px 6px 6px 0px'
            })
        } else if (selectedSchema === "schema_2") {
            setMarginS(width < 900 ? '5px' : "5px 5px 5px 10px");
            setBorderRadiusS("15px");
            setMarginSiderS("5px");
            setGapS(1)
            setHeightLayoutS("calc(98vh - 64px)");
            setHeightSiderS("calc(100% - 10px)");
            setButtonSiderS({
                top: {xs: "14px", sm: '17px'},
                left: '14px',
                transform: 'translate(25%, 35%)',
                borderRadius: '6px'
            })
        } else if (selectedSchema === "schema_3") {
            // Apply styles for schema 3
        }
    };

    const schemaContextValue: ISchemaType = {
        styles: {
            borderRadiusS,
            heightLayoutS,
            marginS,
            heightSiderS,
            marginSiderS,
            gapS,
            buttonSiderS
        },
        schema,
        setSchema,
    };

    return (
        <SchemaContext.Provider value={schemaContextValue}>
            {children}
        </SchemaContext.Provider>
    );
};