import {Link, useNavigate} from "react-router-dom";
import {useNotification, useTranslate} from "@refinedev/core";

import {CustomCreate} from "@/components";
import {CreateCaplStepper} from "@/components/capl/create/createCaplStepper";
import {useStepsForm} from "@refinedev/react-hook-form";
import {useEffect} from "react";
import {socket} from "@/socketClient";

const Create = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const {open} = useNotification();

    const {
        refineCore: {onFinish, formLoading, mutationResult},
        register,
        handleSubmit,
        steps: {gotoStep, currentStep},
        formState: {errors},
        setValue,
        getValues
    } = useStepsForm({
        warnWhenUnsavedChanges: true,
        refineCoreProps: {
            resource: `capl/create`,
            errorNotification: (data: any) => {
                return {
                    type: 'error',
                    message: data?.response?.data?.error
                }
            },
            successNotification: (data: any) => {
                return {
                    type: 'success',
                    message: data?.data?.message
                }
            },
            action: `create`,
            // onMutationError: (data) => {
            //     setError(data?.response?.data)
            // },
            redirect: false
        },
        stepsProps: {
            defaultStep: 0
        }
    });

    useEffect(() => {
        if (mutationResult?.data?.data) {
            const result = mutationResult.data.data;
            if (result?.notification && result?.reservation?.manager && result?.reservation?.userStatus?.value === 'accepted') {
                socket?.emit('createNewNotification', {
                    userId: result?.reservation?.manager,
                    notification: result?.notification
                })
            }
        }
    }, [mutationResult?.data, socket]);

    useEffect(() => {
        if (Object.entries(errors)?.length > 0) {
            for (const entry of Object.entries(errors)) {
                open?.({
                    type: 'error',
                    message: entry[1]?.message as string
                    // message: entry[0],
                })
            }
        }
    }, [errors, gotoStep, currentStep]);
    // console.log(getValues())

    console.log(Object.entries(errors))
    return (
        <CustomCreate
            isLoading={formLoading}
            isShowSaveButton={false}
            customHandleOnCancel={() => {
                navigate('/capl')
            }}
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
                register={register}
                setValue={setValue}
                errors={errors}
                gotoStep={gotoStep}
                currentStep={currentStep}
                handleSubmit={handleSubmit}
                onFinish={onFinish}
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
export default Create
