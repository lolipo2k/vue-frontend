export default class SocketWrap {
    constructor(_debug = false) {
        this._socket = null;
        this._events = {};
        this._debug = _debug
    }

    /**
     * Subscribe on socket event
     * @param {string} eventName name of event
     * @param {function} callback handler for event
     * @return {number} key of added handler. Can be used to remove this handler
     */
    on(eventName, callback) {
        this._events[eventName] = this._events[eventName] || [];
        this._events[eventName].push(callback);
        return this._events[eventName].length - 1;
    }

    /**
     * Send request and resolve when socket answered
     * @param {string} requestName name of event to request
     * @param {object} data request data
     * @param {string} answerName name of answer event
     * @param {number} timeout milliseconds before reject timeout error
     * @return {Promise}
     */
    request(requestName, data, answerName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            this.send({
                'type': requestName,
                'data': data
            });
            let key = 0;
            let timeoutTimer = setTimeout(() => {
                this.removeListener(answerName, key);
                reject(new Error('Request timeout'))
            }, timeout);
            key = this.on(answerName, (answer) => {
                console.log('GOT ANSWER ', answerName, answer)
                this.removeListener(answerName, key);
                clearInterval(timeoutTimer);
                resolve(answer);
            });
        });
    }

    /**
     * Remove event handler
     * @param {string} eventName name of event
     * @param {number} key handler key, which returned from 'on' function
     */
    removeListener(eventName, key) {
        if (eventName in this._events) {
            this._events[eventName].splice(key, 1);
        }
    }

    /**
     * Emit event
     * @param {string} eventName name of event
     */
    fire(eventName) {
        this.debug("fired [" + eventName + "]");
        let events = this._events[eventName];
        let args = Array.prototype.slice.call(arguments, 1);

        if (!events) {
            return;
        }
        //fire all handlers for this event
        for (let i = 0, len = events.length; i < len; i++) {
            try {
                events[i].apply(null, args);
            }
            catch (e) {
                console.error(`Error when handle event [${eventName}]`, e);
            }
        }
    }

    /**
     * Debug message if acktive
     */
    debug(message) {
        if (this._debug) {
            console.log(message)
        }
    }

    /**
     * Create new socket connection by url
     * @param {string} server url to socket server
     */
    connect(server) {
        this._socket = new WebSocket(server);
        //after socket is opened
        let self = this;
        this._socket.onopen = function () {
            self.fire('connected');
        }
            ;
        //ws on mesessage event
        this._socket.onmessage = function (msg) {
            let json = JSON.parse(msg.data);
            //fire proper event callback
            self.debug("RECEIVED MESSAGE " + json.type);
            self.debug(json);
            self.fire(json.type, json.data);
        }
            ;
        //ws error
        this._socket.onerror = function (err) {
            self.debug('onerror');
            self.debug(err);
            self.fire('socket_error', err);
        }
            ;
        //close our socket
        this._socket.onclose = function (closeEvenet) {
            //fire external event
            self.fire('socket_closed', { code: closeEvenet.code });
        };
    }

    /**
     * Close socket connection
     */
    close() {
        this.debug("closing connection");
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close(1000);
        }
        this.fire('socket_will_closed', {});
    }

    /**
     * Is socket connection closed
     */
    isClosed() {
        return this._socket?.readyState === WebSocket.CLOSED;
    }

    /**
     * Send message to socket
     * @param {object} message send message with socket
     */
    send(message) {
        this.debug("SENDING MSG " + message.type);
        this.debug(message);
        this._socket.send(JSON.stringify(message));
    }

    /**
     * Send data with message type
     * @param {string} type type of socket message
     * @param {object} data sending data
     */
    sendOnType(type, data) {
        this.send({
            'type': type,
            'data': data,
        })
    }
}