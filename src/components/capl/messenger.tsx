import {useGetIdentity, useList} from "@refinedev/core";
import {IConv, IGetIdentity, IMessage, ProfileProps} from "../../interfaces/common";
import {useEffect, useState} from "react";
import {axiosInstance} from "../../authProvider";

const Messenger = () => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const {data: dataConv, isLoading, isError} = useList({
        resource: `conversation/findChat/${user?._id}`,
    });

    const [conversation, setConversation] = useState<IConv[]>([]);
    const [currentChat, setCurrentChat] = useState<IConv>();

    const [messages, setMessages] = useState<any[]>([]);
    const [showChat, setScowChat] = useState<boolean>(false);
    const [newMessages, setNewMessages] = useState<string>('');
    const [arrivalMessages, setArrivalMessages] = useState<IMessage>();
    const [receiver, setReceiver] = useState<ProfileProps>(Object);

    useEffect(() => {
        if (dataConv) {
            setConversation(dataConv?.data as IConv[]);
        }
    }, [dataConv]);

    useEffect(() => {
        arrivalMessages && currentChat?.members?.includes(`${arrivalMessages?.sender}`)
        && setMessages(prevState => [...prevState, arrivalMessages])
    }, [arrivalMessages, currentChat]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get(`/message/find/${currentChat?._id}`);
                setMessages(res.data)
            } catch (e) {
                console.log(e)
            }
        })();
    }, [currentChat]);

    useEffect(() => {
        (async () => {
            if (currentChat) {
                const res = await axiosInstance.get(`/managers/one/${currentChat?.members?.find(member => member !== user?._id)}`);
                setReceiver(res.data)
            }
        })()
    }, [currentChat, user])

    return (
        <div>
            Messenger
        </div>
    );
};
export default Messenger
