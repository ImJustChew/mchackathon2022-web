import PocketBase from 'pocketbase';

const client = new PocketBase('https://pb.chibimello.com');

client.users.authViaEmail('testing@cacat.com', '12345678');

export default client;  