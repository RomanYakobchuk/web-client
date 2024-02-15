import {INotification} from "@/interfaces/common";
import ApartmentLottie from "@/lotties/properties/apartment.json";
// import NewsLottie from "@/lotties/properties/news_1.json";
import NewsLottie from "@/lotties/properties/news_silver.json";
import ReserveLottie from "@/lotties/properties/reserve.json";
import MessageLottie from "@/lotties/properties/message.json";
import UserLottie from "@/lotties/properties/user.json";
import FunctionalLottie from "@/lotties/properties/functional.json";
import LottieComponent from "@/lotties/LottieComponent";

export const newNotificationIcon = (type: INotification['type']) => {
    const icons = {
        newNews: NewsLottie,
        newEstablishment: ApartmentLottie,
        newReservation: ReserveLottie,
        newMessage: MessageLottie,
        newUser: UserLottie,
        newFunctional: FunctionalLottie
    }
    return <LottieComponent style={{margin: 0}} size={50} loop={true} item={icons[type]}/>;
}
