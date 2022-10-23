import { IconButton } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import client from "../config/pocketbase";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
const { AR } = require("js-aruco");

const Confirmation = () => {
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState({});
    useEffect(() => {
        if(!id) return;
        client.records.getOne('orders', id).then((e) => {
            setOrder(e);
        }).catch(console.error);
        client.realtime.subscribe('orders/'+id, (e) => {
            console.log(e.record);
            setOrder(e.record);
        }).catch(console.error);
        () => {
            client.realtime.unsubscribe('orders/'+id);
        }
    }, [id]);

    const SVG = useMemo(() => {
        if(!order.tagid) return '';
        var dictionary = new AR.Dictionary('ARUCO_MIP_36h12');
        var SVG = dictionary.generateSVG(order.tagid);
        return SVG;
    }, [order.tagid]);

    return (
        <div>
            <Head>
                <title>Confirmation</title>
            </Head>
            <div className="sticky top-0 p-3 bg-white shadow-lg z-10 flex flex-row ">
                <IconButton onClick={() => router.back()}>
                    <ChevronLeftIcon/>
                </IconButton>
                <h1 className="text-4xl font-semibold">Confirmation</h1>
            </div>
            <div className="p-2">
                <h1 className="text-2xl font-semibold">Your order has been placed!</h1>
                <p>Order ID: {order.id}</p>
                <p>Order Status: {order.status}</p>
                {order.status != 'completed' && <>
                    {order.status == 'pending' ?<div className="grid place-items-center text-center">
                        <h1 className="text-2xl font-semibold py-8">Please wait while the server confirms your request~</h1>
                    </div>:
                    <div>
                        <div dangerouslySetInnerHTML={{ __html: SVG }}></div>
                        {order.status == 'seated' ?
                        <p className="font-bold text-3xl py-4 text-center text-green-700">We found your seat! Please wait while we prepare your food.</p>:
                        <p className="font-bold text-3xl py-4 text-center text-teal-700">Place this somewhere visible.</p>}
                    </div>}
                </>}
            </div>
        </div>
    );

}

export default Confirmation;