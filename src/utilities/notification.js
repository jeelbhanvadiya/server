const gcm = require('node-gcm')
const serverConfig = require(`../config/environments/${process.env.NODE_ENV || "production"}.js`);
const sender = new gcm.Sender(serverConfig?.fcmKey)

module.exports.notification_to_user = async (sender_user_data, data, notification) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Device Token: ', sender_user_data?.deviceToken);
            if (sender_user_data && data && notification && sender_user_data?.deviceToken != null && sender_user_data != undefined && sender_user_data != null) {
                let message = new gcm.Message({
                    data: data,
                    notification: notification
                });
                // console.log(sender_user_data?.deviceToken);
                sender.send(message, {
                    registrationTokens: [sender_user_data?.deviceToken]
                }, function (err, response) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(response)
                    }
                })
            }
            else {
                resolve(true)
            }
        } catch (error) {
            reject(error)
        }
    })
}