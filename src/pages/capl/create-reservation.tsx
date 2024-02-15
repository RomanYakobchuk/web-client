import {Link} from "react-router-dom";
import {useTranslate} from "@refinedev/core";

import {CustomCreate} from "@/components";
import {CreateCaplStepper} from "@/components/capl/create/createCaplStepper";

const CreateReservation = () => {
    const translate = useTranslate();


    // const {refineCore: {onFinish, formLoading}} = useForm({
    //     warnWhenUnsavedChanges: true,
    //     refineCoreProps: {
    //         resource: `capl/create`,
    //         errorNotification: (data: any) => {
    //             return {
    //                 type: 'error',
    //                 message: data?.response?.data?.error
    //             }
    //         },
    //         successNotification: (data: any) => {
    //             return {
    //                 type: 'success',
    //                 message: data?.data?.message
    //             }
    //         },
    //         redirect: false
    //     },
    // })



    // const dataCapl = {
    //     fullName: fullName,
    //     setFullName: setFullName,
    //     whoPay,
    //     setWhoPay,
    //     eventType,
    //     date,
    //     desiredAmount,
    //     numberPeople,
    //     comment,
    //     writeMe,
    //     setEventType,
    //     setDate,
    //     setDesiredAmount,
    //     setNumberPeople,
    //     setComment,
    //     setWriteMe,
    //     user,
    //     setUser,
    //     isAllowedEdit,
    //     setIsAllowedEdit,
    //     manager,
    //     setManager,
    //     establishmentStatus,
    //     setEstablishmentStatus,
    //     userStatus,
    //     setUserStatus
    // }

    return (
        <CustomCreate
            isLoading={false}
            breadCrumbItems={
                [
                    {
                        title: <Link
                            style={{
                                color: 'silver'
                            }}
                            to={'/capl'}>{translate('capl.capl')}</Link>
                    },
                    {
                        title: translate('capl.reservation')
                    }
                ]
            }
            bgColor={'transparent'}
            headerTitle={translate('capl.title')}
            saveButtonText={translate('buttons.confirm')}
            maxWidth={'900px'}
            // onClick={onFinishHandler}
        >
            <CreateCaplStepper
                type={'create'}
            />
            {/*<CaplForm*/}
            {/*    {...dataCapl}*/}
            {/*    type={'create'}*/}
            {/*    searchPlace={searchPlace}*/}
            {/*    setSearchPlace={setSearchPlace}*/}
            {/*/>*/}
        </CustomCreate>
    );
};
export default CreateReservation
