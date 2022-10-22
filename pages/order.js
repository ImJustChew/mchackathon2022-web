import { Add, HistoryOutlined, Remove } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import client from "../config/pocketbase";

const Order = () => {
    const [cart, setCart] = useState([]); // {id: number, quantity: number}[]
    const router = useRouter();

    const [items, setItems] = useState([]);

    useEffect(() => {
        (async () => {
            const records = await client.records.getFullList('products', 200, {
                sort: 'name',
            }).catch(console.error);
            if(records)setItems(records);
        })();
    }, []);

    const handleCheckout = async () => {
        console.log({
            cart,
        });
        const record = await client.records.create('orders', {
            cart,
            status: 'pending',
        })
        router.push(`/confirmed?id=${record.id}`)
    }

    return (
        <div>
            <Head>
                <title>Order</title>
            </Head>
            <div className="sticky top-0 p-3 bg-white shadow-lg z-10 flex flex-row justify-between">
                <h1 className="text-4xl font-semibold">Cart</h1>
                <IconButton onClick={() => router.push('/orders')}>
                    <HistoryOutlined/>
                </IconButton>
            </div>
            <div className="p-2">
                <div className="flex flex-col justify-start divide-y divide-gray-300">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col py-4">
                            <img className="w-32 h-24 object-cover object-top" src={client.baseUrl+'/api/files/products/' + item.id + "/"+ item.image} alt={item.name} />
                            <div className="flex flex-row">
                                <div className="flex flex-col justify-start flex-1">
                                    <h1 className="text-xl font-semibold">{item.name}</h1>
                                    <p>{item.description}</p>
                                </div>
                                <h2>${item.price}</h2>
                            </div>
                            <div className="flex flex-row justify-end pt-2">
                                {cart.find((i) => i.id == item.id) ? (<>
                                    <IconButton onClick={() => {
                                        setCart(cart.map((i) => {
                                            if(i.id == item.id) {
                                                return {
                                                    ...i,
                                                    quantity: i.quantity + 1,
                                                }
                                            }
                                            return i;
                                        }));
                                    }}><Add/></IconButton>
                                    <p>{cart.find((i) => i.id == item.id).quantity}</p>
                                    <IconButton onClick={() => {
                                        setCart(cart.map((i) => {
                                            if(i.id == item.id) {
                                                return {
                                                    ...i,
                                                    quantity: i.quantity - 1,
                                                }
                                            }
                                            return i;
                                        }).filter((i) => i.quantity > 0));
                                    }}><Remove/></IconButton>
                                    <Button variant="outlined" color="error" onClick={() => setCart(cart.filter((i) => i.id !== item.id))}>
                                        Remove from cart
                                    </Button>
                                </>) : (
                                    <Button variant="contained" onClick={() => setCart([...cart, { id: item.id, quantity: 1 }])}>
                                        Add to cart
                                    </Button>
                                )}
                            </div>
                        </div>
                        )
                    )}
                </div>
            </div>
            <div className="sticky bottom-0 p-2 bg-white shadow-lg flex flex-row">
                <div className="flex-1">
                    <h1 className="text-xl font-semibold">Total</h1>
                    <h2>
                        $
                        {cart.reduce((acc, item) => {
                            return acc + items.find(i => i.id == item.id).price * item.quantity;
                        }, 0).toFixed(0)}
                    </h2>
                </div>
                <Button variant="contained" onClick={handleCheckout} disabled={cart.length == 0}>Checkout</Button>
            </div>
        </div>
    )
}

export default Order;