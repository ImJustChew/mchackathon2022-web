import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import client from "../config/pocketbase";

const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        (async () => {
            const records = await client.records.getFullList('products', 200, {
                sort: 'name',
            }).catch(console.error);
            if(records)setItems(records);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const records = await client.records.getFullList('orders', 200, {
                filter: 'status = "confirmed"'
            }).catch(console.error);
            if(records)setOrders(records);            
        })();
        client.realtime.subscribe('orders', function (e) {
            console.log(e);
            if(e.action == 'update' && e.record.status == 'confirmed') {
                setOrders((orders) => {
                    const newOrders = [...orders];
                    const index = newOrders.findIndex((o) => o.id == e.record.id);
                    if(index == -1) {
                        newOrders.push(e.record);
                    } else {
                        newOrders[index] = e.record;
                    }
                    return newOrders;
                });
            }
            if(e.action == 'update' && e.record.status == 'completed'){
                setOrders((orders) => orders.filter((o) => o.id != e.record.id));
            }
        });
        return () => {
            client.realtime.unsubscribe('orders');
        }
    },[]);

    return (
        <div className="grid grid-cols-4 gap-4 p-6">
            {orders.map((order) => (
                <div key={order.id} className="flex flex-col p-4 border border-gray-300 rounded-md">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold">Order #{order.id}</h1>
                        <p>Total {order.cart.reduce((a, b) => a + b.quantity, 0)} items</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <h2 className="text-2xl font-semibold">Table #{order.position} ${order.total || "-"}</h2>
                        <Button variant="contained" onClick={() => {
                            client.records.update('orders', order.id, {
                                status: 'completed',
                            }).catch(console.error);
                        }}>Complete</Button>
                    </div>
                    <div className="flex flex-col justify-between border-t border-gray-400 mt-4">
                        <h1 className="text-xl font-semibold">Items</h1>
                        <div className="flex flex-col divide-y divide-gray-300">
                            {order.cart.map((item) => (
                                <div key={item.id} className="flex flex-row justify-between py-2">
                                    <h1 className="font-semibold">{items.find(i => i.id == item.id).name}</h1>
                                    <p>{item.quantity} x ${items.find(i => i.id == item.id).price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div></div>
                </div>
            ))}
        </div>
    );

}

export default Admin;