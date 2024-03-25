import {useOne} from "@refinedev/core";
import {IOAuth, IUserAgent} from "@/interfaces/common";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import {LoadSessionCard} from "@/services/utils/loadSessionCard";

import {SessionCard} from "@/services/utils/sessionCard";
import {useUserInfo} from "@/hook";
import UAParser from "ua-parser-js";

type TProps = {
    userId: string
}
export const ActiveUserSessions = ({userId}: TProps) => {

    const {access_token, refresh_token} = useUserInfo();

    const [sessions, setSessions] = useState<IOAuth[]>([] as IOAuth[]);
    const {data, isError, isLoading} = useOne<{ sessions: IOAuth[] }>({
        resource: `auth/userSessions`,
        id: userId as string
    })

    useEffect(() => {
        if (data?.data) {
            const userSessions = data?.data?.sessions;
            if (userSessions?.length > 0) {
                setSessions(userSessions)
            }
        }
    }, [data?.data]);

    const sortByCurrentSession = (arr: IOAuth[]) => {
        const condition = (obj: IOAuth) => obj?.access_token === access_token;
        return arr?.sort((a, b) => condition(b) ? 1 : condition(a) ? -1 : 0);
    }
    const parser = new UAParser(navigator.userAgent);
    const currentSession: IOAuth = {
        userAgent: parser?.getResult() as IUserAgent,
        userId: userId,
        createdAt: new Date(),
        _id: Date.now()?.toString(),
        access_token: access_token,
        refresh_token: refresh_token
    }
    return (
        <Box
            sx={{
                display: 'grid',
                width: '100%',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: 2,
                p: 1
            }}>
            <Box
                sx={{
                    borderRadius: '10px',
                    bgcolor: 'modern.modern_1.main',
                    p: 1
                }}
            >
                <Box>
                    CURRENT SESSION
                </Box>
                <SessionCard
                    isCurrentSession={true}
                    session={currentSession}/>
            </Box>
            {
                isLoading ? [1, 2, 3]?.map(value => (
                    <Box
                        key={Math.pow(value, value * 2)}
                    >
                        <LoadSessionCard/>
                    </Box>
                )) : sessions?.length > 0 && sortByCurrentSession(sessions)?.filter((session) => session?.access_token !== access_token)?.map((session, index) => {
                        return (
                            <Box
                                key={session?._id + Math.random() * 100 + index}
                                sx={{
                                    borderRadius: '10px',
                                    bgcolor: 'modern.modern_1.second',
                                }}
                            >
                                <SessionCard
                                    setSessions={setSessions}
                                    session={session}/>
                            </Box>
                        )
                    }
                )
            }
        </Box>
    );
};

