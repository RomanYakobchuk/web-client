import {Box, Grid, Skeleton, Typography} from "@mui/material";
import {useList, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {Typography as TypographyAntd} from "antd";
import {PlaceOutlined} from "@mui/icons-material";
import ScrollContent from "../common/scrollContent";

const {Text} = TypographyAntd;
const CountViews = () => {

    const translate = useTranslate();
    const navigate = useNavigate();

    const {data: dataViews, isLoading: isLoadingViews} = useList<any>({
        resource: "institution/countMoreViews",
    });
    return (
        <Box sx={{
            display: "flex",
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            {
                (dataViews?.total! > 0 || isLoadingViews) &&
                <Typography sx={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: (theme: any) => theme.palette.secondary.main
                }}>
                    {translate("home.sortByType.popularPlace")}
                </Typography>
            }
            <ScrollContent id={'countViews'}>
                {
                    isLoadingViews
                        ? [1, 2, 3]?.map((item: number) => (
                            <Skeleton
                                key={item}
                                sx={{
                                    width: {xs: '300px', sm: '400px'},
                                    height: {xs: '150px', sm: "200px"},
                                    borderRadius: '10px'
                                }}
                                animation={"wave"}
                                variant={"rectangular"}
                            />
                        ))
                        : dataViews?.data?.map((item: any, index) => (
                            <Grid
                                onClick={() => navigate(`/all_institutions/show/${item?.viewsWith?._id}`)}
                                key={index}
                                item
                                sx={{
                                    cursor: 'pointer',
                                    width: {xs: '300px', sm: '400px'},
                                    height: {xs: '150px', sm: "200px"},
                                    borderRadius: '10px',
                                    bgcolor: (theme) => theme.palette.primary.main,
                                    backgroundImage: `url(${item?.viewsWith?.mainPhoto})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'end',
                                    p: '10px'
                                }}>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: '22px',
                                    fontWeight: 900,
                                    textTransform: 'capitalize'
                                }}>
                                    {item?.viewsWith?.title}
                                </Text>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 600
                                }}>
                                    {translate(`home.sortByType.${item?.viewsWith?.type}`)}
                                </Text>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <PlaceOutlined sx={{
                                        color: '#fff'
                                    }}/>
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: 500
                                    }}>
                                        {item?.viewsWith?.place?.city}
                                    </Text>
                                </Box>
                            </Grid>
                        ))
                }
            </ScrollContent>
        </Box>
    );
};
export default CountViews
