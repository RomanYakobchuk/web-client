import {useShow, useTranslate} from "@refinedev/core";
import {useEffect, useState} from "react";
import {PieChartProps} from "@/interfaces/dashboard";
import DonutStatSkeleton from "@/dashboard/items/donutStatSkeleton";
import PieChart from "@/dashboard/charts/PieChart";

type TNewsStat = {
    totalNews: number,
    createdInLastMonth: number,
    drafts: number,
    published: number,
}
const NewsStat = () => {
    const translate = useTranslate();

    const [statisticsNews, setStatisticsNews] = useState<TNewsStat>({} as TNewsStat);

    const {queryResult} = useShow<TNewsStat>({
        dataProviderName: 'statistics',
        resource: 'stat/newsStatistics',
        id: '1' as string
    })

    useEffect(() => {
        if (queryResult?.data?.data) {
            setStatisticsNews(queryResult?.data?.data)
        }
    }, [queryResult]);
    const delay = 100 / statisticsNews?.totalNews || 0;
    const draftSize = delay * statisticsNews?.drafts || 0;
    const publishedSize = delay * statisticsNews?.published || 0;
    const lastMonthSize = delay * statisticsNews?.createdInLastMonth || 0;

    const {isLoading} = queryResult;

    const list: PieChartProps['list'] = [
        {
            item: translate('capl.status.draft'),
            percent: draftSize,
            length: statisticsNews?.drafts
        },
        {
            item: translate('posts.fields.status.published'),
            percent: publishedSize,
            length: statisticsNews?.published
        },
        {
            item: translate('stat.createdInLastMonth'),
            percent: lastMonthSize,
            length: statisticsNews?.createdInLastMonth
        }];

    const colors = ["#43abc0", "#47b51a", "#bc0426", "#d8ad0c"];
    const series = list?.map((value) => value?.percent);
    const labels = list?.map((value) => value?.item);
    const items = list?.map((item, index) => ({...item, color: colors[index]}))

    return (
        <>
            {
                (isLoading || !statisticsNews?.totalNews)
                    ? <DonutStatSkeleton/>
                    : (statisticsNews?.totalNews && (
                            <PieChart
                                list={items}
                                labels={labels}
                                title={translate('news.news')}
                                value={statisticsNews?.totalNews || 0}
                                series={series}
                                colors={colors}
                            />)
                    )
            }
        </>
    );
};
export default NewsStat
