class BaseController {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    sendSuccessResponse(data) {
        this.response.json({ success: true, data: data });
    }
    sendFailResponse(data, message = 'Server Error') {
        this.response.json({ success: false, message: message, data: data })
    }
}

module.exports = BaseController;