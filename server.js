const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const webpush = require('web-push');

const getConfig = require('next/config').default;

const { publicRuntimeConfig } = getConfig();
const {
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
} = publicRuntimeConfig;

const vapidKeys = {
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
    'mailto:thomaso\'brien@hollandandbarrett.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// TODO: this is a static pushSubscription object for now, ideally I would be storing and retrieving these from
// a database

const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/cqXe5cuNrmg:APA91bF5Hzftl3ET3-2WEmKcArNPMsN-8CNOCQFeoSF2yJwQC7RY8vyVXIwy3KTeCyIVxkz4wAFv7e9-N7DTBQbtrolm0lYDUJ6k-sz6U2XcC9kkW0OuQ4wyPIhLsEusIDmVQVeNZdT4',
    expirationTime: null,
    keys: {
        p256dh: 'BAr8yXJel8GRduUWgk-u4UdwiERUdswOT4QVX5Wt1SZBSdTyNAWncDdT0CzPjWp8Yw8k7ii0buZL5FF_Rzhowyk',
        auth: 'q-UGpxNcERHTxgLccV1kCA'
    }
};

app.prepare().then(() => {
    const server = express();

    server.use(express.json());
    server.use(express.urlencoded());

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.post('/api/trigger-push-msg/', (req, res) => {
        const triggerPushMsg = (subscription, dataToSend) => {
            return webpush.sendNotification(subscription, dataToSend)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((err) => {
                if (err.statusCode == 404 || err.statusCode === 410) {
                    console.log('Subscription has expired or is no longer valid: ', err);
                    // delete subscription from data base at this point
                } else {
                    throw err;
                }
            })
        }

        triggerPushMsg(pushSubscription, JSON.stringify(req.body))
        .then(() => {
            res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ data: { success: true } }));
        })
        .catch(function(err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'unable-to-send-messages',
                    message: `We were unable to send messages to all subscriptions : ` +
                        `'${err.message}'`
                }
            }));
        });
    });

    server.listen('3000', err => {
        if (err) throw err;
        console.log(`> Ready on Port 3000`);
    });
});
