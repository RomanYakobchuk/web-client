import {useEffect, useState} from "react";
import {useShow, useTranslate} from "@refinedev/core";

import DonutStatSkeleton from "../../items/donutStatSkeleton";
import PieChart from "../../charts/PieChart";
import {PieChartProps} from "@/interfaces/dashboard";

type TEstablishmentStat = {
    totalEstablishment: number,
    createdInLastMonth: number,
    drafts: number,
    published: number,
    rejected: number
}
const EstablishmentStat = () => {

    const translate = useTranslate();


    const [statisticsEstablishment, setStatisticsEstablishment] = useState<TEstablishmentStat>({} as TEstablishmentStat);

    const {queryResult} = useShow<TEstablishmentStat>({
        dataProviderName: 'statistics',
        resource: 'stat/institutionsStatistics',
        id: '1' as string
    })

    useEffect(() => {
        if (queryResult?.data?.data) {
            setStatisticsEstablishment(queryResult?.data?.data)
        }
    }, [queryResult]);

    const delay = 100 / statisticsEstablishment?.totalEstablishment || 0;
    const draftSize = delay * statisticsEstablishment?.drafts || 0;
    const publishedSize = delay * statisticsEstablishment?.published || 0;
    const rejectedSize = delay * statisticsEstablishment?.rejected || 0;
    const lastMonthSize = delay * statisticsEstablishment?.createdInLastMonth || 0;

    const {isLoading} = queryResult;

    const list: PieChartProps['list'] = [
        {
            item: translate('capl.status.draft'),
            percent: draftSize,
            length: statisticsEstablishment?.drafts
        },
        {
            item: translate('posts.fields.status.published'),
            percent: publishedSize,
            length: statisticsEstablishment?.published
        },
        {
            item: translate('capl.status.rejected'),
            percent: rejectedSize,
            length: statisticsEstablishment?.rejected
        },
        {
            item: translate('stat.createdInLastMonth'),
            percent: lastMonthSize,
            length: statisticsEstablishment?.createdInLastMonth
        }];

    const colors = ["#43abc0", "#47b51a", "#bc0426", "#d8ad0c"];
    const series = list?.map((value) => value?.percent);
    const labels = list?.map((value) => value?.item);
    const items = list?.map((item, index) => ({...item, color: colors[index]}))

    return (
        <>
            {
                (isLoading || !statisticsEstablishment?.totalEstablishment)
                    ? <DonutStatSkeleton/>
                    : (statisticsEstablishment?.totalEstablishment && (
                            <PieChart
                                list={items}
                                labels={labels}
                                title={translate('all_institutions.all_institutions')}
                                value={statisticsEstablishment?.totalEstablishment || 0}
                                series={series}
                                colors={colors}
                            />)
                    )
            }
        </>
    );
};
export default EstablishmentStat
