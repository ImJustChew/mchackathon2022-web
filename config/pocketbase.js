import PocketBase from 'pocketbase';

const client = new PocketBase('http://pb.chibimello.com:8090');

client.users.authViaEmail('testing@cacat.com', '12345678');

export default client;  