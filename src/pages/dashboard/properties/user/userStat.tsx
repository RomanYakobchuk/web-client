import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useShow, useTranslate} from "@refinedev/core";
import {DefaultizedPieValueType} from '@mui/x-charts';
import {PieChartProps} from "@/interfaces/dashboard";
import {Box} from "@mui/material";

import PieChartByMui, {TSeriesForMuiPieChartList} from "../../charts/PieChartByMui";
import DonutStatSkeleton from "../../items/donutStatSkeleton";
import PieChart from "../../charts/PieChart";

type TUserStat = {
    total: number,
    totalUsers: number,
    totalAdmins: number,
    totalManagers: number,
    usersInLastMonth: number,
    activatedByEmail: number,
    notActivatedByEmail: number,
    activeAccountsInLastMonth: number,
    verifiedByPhone: number,
    notVerifiedByPhone: number,
    blockedAccounts: number
}
type TProps = {
    setTotal?: Dispatch<SetStateAction<number>>
}
const UserStat = ({setTotal}: TProps) => {

    const translate = useTranslate();

    const [statisticsUsers, setStatisticsUsers] = useState<TUserStat>({} as TUserStat);

    const {queryResult} = useShow<TUserStat>({
        dataProviderName: 'statistics',
        resource: 'stat/userStatistics',
        id: '1' as string
    })

    useEffect(() => {
        if (queryResult?.data?.data) {
            setStatisticsUsers(queryResult?.data?.data)
        }
    }, [queryResult]);
    const {isLoading} = queryResult;

    const all = statisticsUsers?.total;
    const delay = 100 / all || 0;
    const onlyUsers = delay * statisticsUsers?.totalUsers || 0;
    const onlyAdmins = delay * statisticsUsers?.totalAdmins || 0;
    const onlyManagers = delay * statisticsUsers?.totalManagers || 0;
    const usersInLastMonth = delay * statisticsUsers?.usersInLastMonth || 0;
    const activatedByEmail = delay * statisticsUsers?.activatedByEmail || 0;
    const notActivatedByEmail = delay * statisticsUsers?.notActivatedByEmail || 0;
    const activeAccountsInLastMonth = delay * statisticsUsers?.activeAccountsInLastMonth || 0;
    const verifiedByPhone = delay * statisticsUsers?.verifiedByPhone || 0;
    const notVerifiedByPhone = delay * statisticsUsers?.notVerifiedByPhone || 0;
    const blockedAccounts = delay * statisticsUsers?.blockedAccounts || 0;

    const list: PieChartProps['list'] = [
        {
            item: translate('roles.admin'),
            percent: onlyAdmins,
            length: statisticsUsers?.totalAdmins
        },
        {
            item: translate('roles.manager'),
            percent: onlyManagers,
            length: statisticsUsers?.totalManagers
        },

        {
            item: translate('roles.ordinaryUser'),
            percent: onlyUsers,
            length: statisticsUsers?.totalUsers
        },
        {
            item: translate('stat.users.blocked'),
            percent: blockedAccounts,
            length: statisticsUsers?.blockedAccounts
        },
        {
            item: translate('stat.createdInLastMonth'),
            percent: usersInLastMonth,
            length: statisticsUsers?.usersInLastMonth
        },
    ];

    const colors = ["#1540cc", "#56339e", "#3c3780", "#53599e", "#758db0"];
    const series = list?.map((value) => value?.percent);
    const labels = list?.map((value) => value?.item);
    const items = list?.map((item, index) => ({...item, color: colors[index]}));

    const onlyUserByEmail = [
        {
            label: translate('stat.users.activatedByEmail'),
            value: activatedByEmail,
            length: statisticsUsers?.activatedByEmail
        },
        {
            label: translate('stat.users.notActivatedByEmail'),
            value: notActivatedByEmail,
            length: statisticsUsers?.notActivatedByEmail
        },
        {
            label: translate('stat.users.activeAccountsInLastMonth'),
            value: activeAccountsInLastMonth,
            length: statisticsUsers?.activeAccountsInLastMonth
        },
    ]
    const onlyUserByPhone = [
        {
            label: translate('stat.users.verifiedByPhone'),
            value: verifiedByPhone,
            length: statisticsUsers?.verifiedByPhone
        },
        {
            label: translate('stat.users.notVerifiedByPhone'),
            value: notVerifiedByPhone,
            length: statisticsUsers?.notVerifiedByPhone
        },
    ]

    const onlyUsersAllColorsByEmail = ["#f3153e", "#ca6073", "#7d0a0a"];
    const onlyUsersAllColorsByPhone = ["#c52d7d", "#920c53"];
    const onlyUsersItemsByEmail = onlyUserByEmail?.map((item, index) => ({...item, color: onlyUsersAllColorsByEmail[index]}));
    const onlyUsersItemsByPhone = onlyUserByPhone?.map((item, index) => ({...item, color: onlyUsersAllColorsByPhone[index]}));

    const TOTALEMAIL = onlyUsersItemsByEmail.map((item) => item.value).reduce((a, b) => a + b, 0) || 0;

    const getArcLabelEmail = (params: DefaultizedPieValueType) => {
        const percent = (params?.value / TOTALEMAIL) || 0;
        return `${(percent * 100).toFixed(0) || 0}%`;
    };
    const TOTALPHONE = onlyUsersItemsByPhone.map((item) => item.value).reduce((a, b) => a + b, 0) || 0;

    const getArcLabelPhone = (params: DefaultizedPieValueType) => {
        const percent = (params?.value / TOTALPHONE) || 0;
        return `${(percent * 100).toFixed(0) || 0}%`;
    };

    const seriesForMuiPie: TSeriesForMuiPieChartList = [
        {
            id: 'onlyUsersItemsByEmail',
            innerRadius: Number(0) as number,
            outerRadius: Number(60) as number,
            cx: Number(110) as number,
            data: onlyUsersItemsByEmail,
            arcLabel: getArcLabelEmail,
            cornerRadius: Number(20),
        },
        {
            id: 'onlyUsersItemsByPhone',
            innerRadius: typeof 80 === 'number' ? 80 : Number(80),
            outerRadius: typeof 100 === 'number' ? 100 : Number(100),
            cx: 110 as number,
            data: onlyUsersItemsByPhone,
            arcLabel: getArcLabelPhone,
            cornerRadius: Number(20)
        },
    ] as TSeriesForMuiPieChartList;

    useEffect(() => {
        if (statisticsUsers?.total > 0 && setTotal) {
            setTotal(statisticsUsers?.total)
        }
    }, [statisticsUsers?.total]);

    return (
        <Box sx={{
            width: '100%',
            display: 'grid',
            "@media screen and (max-width: 700px)":{
                gridTemplateColumns: 'repeat(1, 1fr)'
            },
            "@media screen and (min-width: 700px)":{
                gridTemplateColumns: 'repeat(2, 1fr)'
            },
            gap: 2,
        }}>
            {
                (isLoading || !statisticsUsers?.total)
                    ? [1, 2]?.map((value) => (
                        <DonutStatSkeleton key={value}/>
                    ))
                    : <>
                        <PieChart
                            title={translate('all-users.all-users')}
                            value={all || 0}
                            series={series}
                            colors={colors}
                            labels={labels}
                            list={items}
                        />
                        <PieChartByMui
                            title={translate('roles.ordinaryUser')}
                            value={statisticsUsers?.totalUsers || 0}
                            series={seriesForMuiPie}
                            list={[...onlyUsersItemsByEmail, ...onlyUsersItemsByPhone]}
                        />
                        {/*<PieChart*/}
                        {/*    title={translate('roles.ordinaryUser')}*/}
                        {/*    value={statisticsUsers?.totalUsers || 0}*/}
                        {/*    series={onlyUsersSeries}*/}
                        {/*    colors={onlyUsersColors}*/}
                        {/*    labels={onlyUsersLabels}*/}
                        {/*    list={onlyUsersItems}*/}
                        {/*    style={{*/}
                        {/*        minWidth: {xs: '300px', sm: '500px'}*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </>
            }
        </Box>
    );
};
export default UserStat
