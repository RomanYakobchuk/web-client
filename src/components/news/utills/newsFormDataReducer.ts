import {IEstablishment, INewsDateEvent, IPicture, IWorkDay} from "@/interfaces/common";
import {INewsDataFormPlace, TItemList} from "@/interfaces/formData";

export interface StateFormNews {
    pictures: IPicture[] | File[];
    category: string;
    title: string;
    dateEvent: INewsDateEvent[],
    place: INewsDataFormPlace;
    description: string;
    createdBy: string;
    status: string,
    establishmentInfo: IEstablishment | null,
    datePublish: Date | null,
    isDatePublish: boolean
}

export const initialState: StateFormNews = {
    pictures: [],
    category: '',
    dateEvent: [],
    title: '',
    place: {} as INewsDataFormPlace,
    description: '',
    createdBy: '',
    status: 'published',
    establishmentInfo: null,
    datePublish: null,
    isDatePublish: false
};

function fillFieldByType(state: StateFormNews, field: keyof StateFormNews, value: any): StateFormNews {
    switch (field) {
        case 'pictures':
            return { ...state, pictures: value };
        case 'category':
            return { ...state, category: value };
        case 'title':
            return { ...state, title: value };
        case 'dateEvent':
            return { ...state, dateEvent: value };
        case 'status':
            return { ...state, status: value };
        case 'datePublish':
            return { ...state, datePublish: value };
        case 'isDatePublish':
            return { ...state, isDatePublish: value };
        case 'place':
            return { ...state, place: value };
        case 'establishmentInfo':
            return { ...state, establishmentInfo: value };
        case 'description':
            return { ...state, description: value };
        case 'createdBy':
            return { ...state, createdBy: value };
        default:
            return state;
    }
}

export type ActionNews = { type: keyof StateFormNews; payload: any };

export function reducerFormStateNews(state: StateFormNews, action: ActionNews): StateFormNews {
    switch (action.type) {
        default:
            return fillFieldByType(state, action.type, action.payload);
    }
}
