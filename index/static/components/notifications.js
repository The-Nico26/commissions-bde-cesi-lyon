(() => {

    window.notifications = new class NotificationManager {

        constructor(){
            this.registered = []
            this.TYPE = {
                DEBUG: "DEBUG",
                INFO: "INFO",
                SUCCESS: "SUCCESS",
                WARNING: "WARNING",
                ERROR: "ERROR",
            }
        }

        register(callback){
            this.registered.push(callback)
            return callback;
        }

        send(type, message){
            this.registered.forEach(callb => {
                callb({
                    type: type,
                    message: message
                })
            })
        }

        sendInfo(message){ this.send(this.TYPE.INFO,message) }
        sendSuccess(message){ this.send(this.TYPE.SUCCESS,message) }
        sendWarning(message){ this.send(this.TYPE.WARNING,message) }
        sendError(message){ this.send(this.TYPE.ERROR,message) }
        sendDebug(message){ this.send(this.TYPE.DEBUG,message) }

    }

    window.notifications.register(notif => {
        let message = `Notification ${notif.type} : ${notif.message}`
        switch (notif.type) {
            case window.notifications.TYPE.INFO:
            case window.notifications.TYPE.SUCCESS:
                console.info(message)
                break;
            case window.notifications.TYPE.WARNING:
                console.warn(message)
                break;
            case window.notifications.TYPE.ERROR:
                console.error(message)
                break;
            default:
                console.log(message)
                break;
        }
    })

})()