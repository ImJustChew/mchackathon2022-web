import { Add, Remove } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client from "../config/pocketbase";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const OrdersList = () => {
    const router = useRouter();
    const [items, setItems] = useState([]);

    useEffect(() => {
        (async () => {
            const records = await client.records.getFullList('orders', 200).catch(console.error);
            if(records)setItems(records);
        })();
    }, []);

    return (
        <div>
            <Head>
                <title>Past Orders</title>
            </Head>
            <div className="sticky top-0 p-3 bg-white shadow-lg z-10 flex flex-row ">
                <IconButton onClick={() => router.back()}>
                    <ChevronLeftIcon/>
                </IconButton>
                <h1 className="text-4xl font-semibold">Past Orders</h1>
            </div>
            <div className="p-2">
                <div className="flex flex-col justify-start divide-y divide-gray-300">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col py-4" onClick={() => router.push("/confirmed?id="+item.id)}>
                            <div className="flex flex-row">
                                <div className="flex flex-col justify-start flex-1">
                                    <h1 className="text-xl font-semibold">Your order on {new Date(item.created).toLocaleDateString()}</h1>
                                    <p className="capitalize">{item.status}</p>
                                    <p>Total {item.cart.reduce((a, b) => a + b.quantity, 0)} items</p>
                                </div>
                                <h2>${item.total || "-"}</h2>
                            </div>
                        </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrdersList;