import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {useMobile} from "../utils";

interface ISchema {
    marginS: string,
    borderRadiusS: string,
    heightLayoutS: string,
    heightSiderS: string,
    schema: Schema['type'],
    marginSiderS: string,
    gapS: number,
    buttonSiderS: {
        left: string,
        top: {xs: string, sm: string},
        borderRadius: string
    },
    setSchema: (value: Schema['type']) => void
}

export interface Schema {
    type: 'schema_1' | 'schema_2' | 'schema_3'
}

interface Props {
    children: ReactNode;
}

const SchemaContext = createContext<ISchema | undefined>(undefined);

export const useSchema = (): ISchema => {
    const context = useContext(SchemaContext);
    if (!context) {
        throw new Error("useSchema must be used within a SchemaProvider");
    }
    return context;
};

export const SchemaProvider: FC<Props> = ({children}) => {
    const selectedSchema = window.localStorage.getItem("schema");

    const {width} = useMobile();

    const [schema, setSchema] = useState<Schema["type"]>(
        (selectedSchema as Schema["type"]) || "schema_1"
    );
    const [buttonSiderS, setButtonSiderS] = useState<ISchema['buttonSiderS']>({left: '0', top: {xs: "10px", sm: '15px'}, borderRadius: '0px 6px 0px 6px'});
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

    useEffect(() => {
        applyStyles(schema);
    }, []);

    const applyStyles = (selectedSchema: Schema["type"]) => {
        if (selectedSchema === "schema_1") {
            setMarginS("0");
            setMarginSiderS("0");
            setBorderRadiusS("0");
            setGapS(0)
            setHeightLayoutS("100vh");
            setHeightSiderS("100%")
            setButtonSiderS({
                top: {xs: "10px", sm: '15px'},
                left: '0px',
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
                top: {xs: "12px", sm: '17px'},
                left: '20px',
                borderRadius: '6px'
            })
        } else if (selectedSchema === "schema_3") {
            // Apply styles for schema 3
        }
    };

    const schemaContextValue: ISchema = {
        borderRadiusS,
        heightLayoutS,
        marginS,
        setSchema,
        heightSiderS,
        marginSiderS,
        schema,
        gapS,
        buttonSiderS
    };

    return (
        <SchemaContext.Provider value={schemaContextValue}>
            {children}
        </SchemaContext.Provider>
    );
};