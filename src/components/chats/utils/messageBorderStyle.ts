import dayjs from "dayjs";
import {IMessage} from "@/interfaces/common";

const senderBorder = (lengthGroup: number, index: number) => ({
                                                                  first = '6px',
                                                                  second = '6px',
                                                                  third = '10px',
                                                                  fourth = '15px'
                                                              }: {
    first?: string,
    second?: string,
    third?: string,
    fourth?: string
}) => {
    if (lengthGroup === 1) {
        return `${fourth} ${third} ${third} ${fourth}`
    } else if ((lengthGroup === 2 && index === 0) || (lengthGroup >= 3 && index === 0)) {
        return `${fourth} ${third} ${first} ${fourth}`
    } else if ((lengthGroup === 2 && index === 1) || (lengthGroup >= 3 && index === (lengthGroup - 1))) {
        return `${fourth} ${first} ${third} ${fourth}`
    } else if (lengthGroup >= 3 && index !== 0 && index !== (lengthGroup - 1)) {
        return `${fourth} ${second} ${second} ${fourth}`
    }
}
const receiverBorder = (lengthGroup: number, index: number) => ({
                                                                    first = '6px',
                                                                    second = '6px',
                                                                    third = '10px',
                                                                    fourth = '15px'
                                                                }: {
    first?: string,
    second?: string,
    third?: string,
    fourth?: string
}) => {
    if (lengthGroup === 1) {
        return `${third} ${fourth} ${fourth} ${third}`
    } else if ((lengthGroup === 2 && index === 0) || (lengthGroup >= 3 && index === 0)) {
        return `${third} ${fourth} ${fourth} ${first}`
    } else if ((lengthGroup === 2 && index === 1) || (lengthGroup >= 3 && index === (lengthGroup - 1))) {
        return `${second} ${fourth} ${fourth} ${third}`
    } else if (lengthGroup >= 3 && index !== 0 && index !== (lengthGroup - 1)) {
        return `${second} ${fourth} ${fourth} ${second}`
    }
};

const messagesDate = (day: string, translate: (key: string, options?: any, defaultMessage?: string) => string) => {
    const currentDate1 = dayjs(new Date()).format("D-M-YYYY");
    const currentDate2 = dayjs(new Date()).format("DD-M-YYYY");
    const yesterday = dayjs().subtract(1, 'day').format("D-M-YYYY");
    if (day === currentDate1 || day === currentDate2) {
        return translate('dates.today')
    } else if (day === yesterday) {
        return translate('dates.yesterday')
    } else {
        return day.split('-')[0] + ' ' + translate(`dates.months.${day.split('-')[1]}`) + ' ' + day.split('-')[2]
    }
}
const getMessages = (messagesDB: IMessage[] | undefined): [string, IMessage[]][] | null => {
    if (!messagesDB || messagesDB?.length <= 0) return null;

    const list = (): Array<[string, IMessage[]]> => {
        return Object.entries(messagesDB?.reduce((acc: any, obj: IMessage) => {
            const createdAt = new Date(obj?.createdAt as Date);

            const dayMonthYear = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;

            if (!acc[dayMonthYear]) {
                acc[dayMonthYear] = [];
            }
            acc[dayMonthYear].push(obj);
            return acc;
        }, {}));
    }
    const sorted = list()?.sort((a, b) => {
        const [dateA] = a;
        const [dateB] = b;
        const [dayA, monthA, yearA] = dateA?.split('-');
        const [dayB, monthB, yearB] = dateB?.split('-');

        const dateObjA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
        const dateObjB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));

        return dateObjA.getTime() - dateObjB.getTime();
        // return dateObjB.getTime() - dateObjA.getTime();
    });
    if (sorted) {
        const mergedObjects = sorted?.reduce((acc: Record<string, IMessage[]>, [key, arr]) => {
            if (acc[key]) {
                acc[key] = acc[key].concat(arr);
            } else {
                acc[key] = arr;
            }
            return acc;
        }, {} as Record<string, IMessage[]>);
        return  Object.entries(mergedObjects).reverse() as [string, IMessage[]][];
    } else {
        return null;
    }
}
export {
    senderBorder,
    receiverBorder,
    messagesDate,
    getMessages
}