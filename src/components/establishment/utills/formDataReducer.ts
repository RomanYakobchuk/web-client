import {IEstablishment, IPicture, IWorkDay} from "@/interfaces/common";
import {TItemList} from "@/interfaces/formData";

export interface StateFormEstablishment {
    sendNotifications: boolean;
    pictures: IPicture[] | File[];
    type: string;
    title: string;
    averageCheck: string;
    workSchedule: IEstablishment["workSchedule"] | any;
    cuisine: string | null;
    workScheduleWeekend: IEstablishment["workSchedule"]["weekend"];
    location: google.maps.LatLngLiteral | { lat: number, lng: number };
    tags: TItemList;
    place: { address: string, city: string };
    features: TItemList;
    contacts: TItemList;
    workDays: IWorkDay[];
    description: string;
    createdBy: string;
}

export const initialState: StateFormEstablishment = {
    sendNotifications: false,
    pictures: [],
    type: '',
    title: '',
    averageCheck: '',
    workSchedule: {},
    cuisine: null,
    workScheduleWeekend: '',
    location: { lat: 0, lng: 0 },
    tags: [],
    place: { address: '', city: '' },
    features: [],
    contacts: [],
    workDays: [],
    description: '',
    createdBy: '',
};

function fillFieldByType(state: StateFormEstablishment, field: keyof StateFormEstablishment, value: any): StateFormEstablishment {
    switch (field) {
        case 'sendNotifications':
            return { ...state, sendNotifications: value };
        case 'pictures':
            return { ...state, pictures: value };
        case 'type':
            return { ...state, type: value };
        case 'title':
            return { ...state, title: value };
        case 'averageCheck':
            return { ...state, averageCheck: value };
        case 'workSchedule':
            return { ...state, workSchedule: value };
        case 'cuisine':
            return { ...state, cuisine: value };
        case 'workScheduleWeekend':
            return { ...state, workScheduleWeekend: value };
        case 'location':
            return { ...state, location: value };
        case 'tags':
            return { ...state, tags: value };
        case 'place':
            return { ...state, place: value };
        case 'features':
            return { ...state, features: value };
        case 'contacts':
            return { ...state, contacts: value };
        case 'workDays':
            return { ...state, workDays: value };
        case 'description':
            return { ...state, description: value };
        case 'createdBy':
            return { ...state, createdBy: value };
        default:
            return state;
    }
}

export type ActionEstablishment = { type: keyof StateFormEstablishment; payload: any };

export function reducerFormStateEstablishment(state: StateFormEstablishment, action: ActionEstablishment): StateFormEstablishment {
    switch (action.type) {
        default:
            return fillFieldByType(state, action.type, action.payload);
    }
}
