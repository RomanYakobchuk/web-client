import {create} from "zustand";
import {PropertyProps} from "../interfaces/common";

interface IStore {
    establishmentInfo: PropertyProps,
    addEstablishment: (value: PropertyProps) => void,
    deleteEstablishment: () => void
}

const useStore = create<IStore>()((set) => ({
    establishmentInfo: {} as PropertyProps,
    addEstablishment: (value) =>
        set(() => ({
        establishmentInfo: value
    })),
    deleteEstablishment: () => {
        set(() => ({
            establishmentInfo: {} as PropertyProps
        }))
    }
}))

export {
    useStore
}