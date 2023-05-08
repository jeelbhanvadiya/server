module.exports.notification = {
    add_stock: (data) => { return { template: { title: "Stock", body: `Add stock successfully saved!` }, data: { type: 1, stockIds: data?.stockIds, click_action: "FLUTTER_NOTIFICATION_CLICK" } } },
}
class apiResponse {
    constructor(status, message, data, error) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
    }
}
module.exports.apiResponse = apiResponse;
