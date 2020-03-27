const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
//const net = require('net');
const Timer = require('../../util/timer');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAnCAYAAAEKrzouAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH5AMbFAMBxrwxgwAABWZJREFUWMPFmFtsFGUUgL+BLbWhLVEwYiDxAWyQm0GMFIEKeC3BxgspicADbPqEkYD6gor4UCNRwRhjDEKwi4JcRAoSwVJLFSx0uWm0JGipxS3bFktLoZTd7s7xYWa3c93dLqueP7M78//n8p/Lf+bMUQBYgmADQUKhXuns7BAEUWKTdswD8cktgFe7VRE8+LmI8HOM3ChoKzpLiQqCiETFJF3/FYBBBnFK7GYQDqBYWDiDgmKiViXCqldWArBt+xdc77mGo0ni47zpySLpSYSAaXILV5GYdRQFaobuZLaR5mYp42/bSYNdmacQ7nRR5HP8CA9pD37LnoxDod5ksxP1x1ElAj3ASRCirN/wnoW9H+Ft3Tf6EIkKR/s52kVPR7huF+2xbf4Hx1mLwYMGO1qM3U/bCKw2EO4ELlm5FfA7gqDGOSgGjjMAlNxNCPn9NL0LieT48JDdP9dXhoOZ0hkGEzoGM+eg7vgxLjT9AeXmpbneObRcClC572votpM6MmzKaaSwsJCuri72Ta6EVn3hIEwYOoG8vFxKSkrYXbWLxGBU+SbCZRcVW3WDp6wyQDYwwnAGFOAX/fku0yE3gTmW9gJnHbA+1f/r9WtAcMCgStAxwWyxpAVvInY5hG15pMiE8a5l/Tl6nBgVsMfFAdcQYBgAMwk64vQh5HMaQLljJBF1rpuJdZ80gVLHY+oLHE5mMcVwV85i0zFNDfqAL502pFCe1rG7ZnbcIDIMjgwXlC0g2NpChe8zCBsWAnCk9nv+CjQzdsWYpNbUVP5GS8QiUWlubhJv2bK4evv3V0oweCm+TiAVldv7b8eNG8/kiZPjz8OHj8DrNcRxZyo7jCI1NdUiEtVqiHMGB2xDwuGQiERl3bp3HJ3i7uWgJaPERgShPR0vj9SjtEP/n6fPDwbX925KYfOr/v/tLYSNCR7RXglEU2NozoebEmAedZkPJRawzJK6ttkwjPmm2u7h/+DovY/2etztQrEKaAEu6LgJYT7dJpU32FSabloPI0CuG7tpnLEEsVY1GnNmnSnYVYQpNNpZZVFPn0u+mx0/3blcdcHZjwD3ASjZ2UjW1sQZuXcRk1A4lbODIa5416FnGT96cp5HZW9i0w6DUTINj+xFTYR3+2itVHNOFOlWYum+RhTnEiLjcZ1p8AwI+ypQBzQDQ4H7gYnudZhWOQM/AeeBITr+A0DWrWzb6uJOpLSsVLq7u+Kvu9hVW3tE8Dm4LYTM9M6Q9vZWG01Dw2/CmtRcnNoG1yPBYItJyOHD3wkgGzd+Ij5fhdBs2eAuxO+vl6KiIsnLy5O2tqCJvqrqkHAyUxs8i/h8FTZLiESlq+uKFCwtsFswgKxd+6aoasRGEwr1yrNLnxFuJN+g4rrBelbzoKUC/AoWH1rErOmz6OjoYPPFzTSuvAAFLoqqQBXM217ME1MeJxQKs6NhB6dfOqPFoSFHkW/8ih6oBVMZ7Qh7EPYhXMlcmvFkJBccBIotc8eBaf9SJTxgmAMsNzyvBab+H3kw0ffqR/qVYXA7JKOBuxFKqOB1HnXAuQxM4RAKb5C4ybKGM8x3LHWPAQspR6ES6EHM/Sl3CwoB7dOGSYwARjngDAbgCoI/iRH+ZqRep1tB6xI0JeKRmosb9X7Un3rRX+gi0A2iwCn94LQD9wCzMhODBXQDY/TLCFp7Y2wKMu6lTT80Ux15jEs3Ph9mc5L8dQIBXkvA41XqkvCoQMDcL01m0bdYQcSl3+EmwKlXsySpgrHRhvAyEbRWnWNVvJzF9NCYZsFZiwAfmLpD1WnyakJYyg1gBaAo+cWovR8nbvukAkMOQNaLFAPhvg+pDj996zkwZxX8Azv2gXwSOnp3AAAAAElFTkSuQmCC';

BLEUUID = {
    SVC: '4e769f72-391f-4cd3-bbea-25a2e945066b',
    CHA_CMD: '70e45870-79ec-44c6-859d-0897aa7134b6',
    CHA_RESP: '79394316-6874-4506-9c20-1245751c6c20'
};

class OttoPi {
    constructor (runtime, extensionId) {
        log.log('extensionId=' + extensionId);
        this._runtime = runtime;

        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        this._extensionId = extensionId;

        this._url = null;

        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [{
                services: [BLEUUID.SVC]
            }],
        }, this._onConnect, this.reset);
    }

    connect(id) {
        log.log('id=' + String(id));
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect () {
        log.log('disconnect()');
        if (this._ble) {
            this._ble.disconnect();
        }
        this.reset();
    }

    reset () {
        log.log('reset()');
    }

    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        if (! connected) {
            log.log('isConnected() > ' + String(connected));
        }
        return connected;
    }

    _onConnect () {
        log.log('_onConnect()');
        log.log(BLEUUID.SVC);
        log.log(BLEUUID.CHA_CMD);
        this._ble.read(BLEUUID.SVC, BLEUUID.CHA_RESP, true, this._onMessage);
    }

    _onMessage (base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        log.log('data=' + String(base64));
    }

    send_cmd (cmd) {
        log.log("> send_cmd:'" + cmd + "'");
        if (!this.isConnected()) {
            log.log('< send_cmd: is not connected');
            return "no connection";
        }
        if (this._busy) {
            log.log('< send_cmd: busy');
            return "busy";
        }

        this._busy = true;

        const output = (new TextEncoder).encode(cmd); // to uint8Array
        const data = Base64Util.uint8ArrayToBase64(output);

        this._ble.write(BLEUUID.SVC, BLEUUID.CHA_CMD, data, 'base64', true)
            .then(() => {
                log.log("write:'" + cmd + "':done");
                // this._busy = false;
            });
        log.log("_ble.write: promise");
        
        this._ble.read(BLEUUID.SVC, BLEUUID.CHA_RESP, false)
            .then(result => {
                const input = Base64Util.base64ToUint8Array(result.message);
                const resp = (new TextDecoder).decode(input);
                log.log("resp='" + resp + "'");

                if (resp.length > 0) {
                    const resp_json = JSON.parse(resp);
                    log.log("CMD='" + resp_json.CMD + "'");
                }
                this._busy = false;
            });
        log.log("_ble.read: promise");

        return "done";
    }

    read_resp () {
        log.log('> read_resp()');

        this._ble.read(BLEUUID.SVC, BLEUUID.CHA_RESP, false)
            .then(result => {
                const input = Base64Util.base64ToUint8Array(result.message);
            });
    }
}

/**
 * Class for the foo blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 */ 
class Scratch3Foo {

    /**
     * @return {array}
     */
    get CMD_MENU () {
        return [
            {
                text: '前進',
                value: ':.forward'
            },
            {
                text: '後退(バック)',
                value: ':.backward'
            },
            {
                text: '右を向く',
                value: ':.turn_right'
            },
            {
                text: '左を向く',
                value: ':.turn_left'
            },
            {
                text: 'すり足',
                value: ':.suriashi_fwd'
            },
            {
                text: '右にスライド',
                value: ':.slide_right'
            },
            {
                text: '左にスライド',
                value: ':.slide_left'
            }
        ];
    }

    get MOTION_MENU () {
        return [
            {
                text: 'ハッピー !',
                value: ':.happy'
            },
            {
                text: 'ビックリ !!',
                value: ':.surprised'
            },
            {
                text: 'ハイ !(右)',
                value: ':.hi_right'
            },
            {
                text: 'ハイ !(左)',
                value: ':.hi_left'
            },
            {
                text: 'バイバイ(右)',
                value: ':.bye_right'
            },
            {
                text: 'バイバイ(左)',
                value: ':.bye_left'
            },
            {
                text: 'おじぎ',
                value: ':.ojigi'
            },
            /*
            {
                text: 'おじぎ2',
                value: ':.ojigi2'
            }
            */
        ];
    }

    constructor (runtime) {
        log.log('runtime=' + runtime);
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.svr_addr = 'localhost';
        this.svr_port = 9001;
        this.timer_msec = 5000;

        this._peripheral = new OttoPi(this.runtime, 'foo');
        // this._onTargetCreated = this._onTargetCreated.bind(this);
        // this.runtime.on('targetWasCreated', this._onTargetCreated);
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'foo',
            name: 'Foo Blocks',
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'stop',
                    blockType: BlockType.COMMAND,
                    text: 'ストップ'
                },
                {
                    opcode: 'move',
                    blockType: BlockType.COMMAND,
                    text: '移動: [N]回 [CMD]',
                    arguments: {
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        CMD: {
                            type: ArgumentType.STRING,
                            menu: 'cmds',
                            defaultValue: ':.forward'
                        }
                    }
                },
                {
                    opcode: 'motion',
                    blockType: BlockType.COMMAND,
                    text: 'モーション: [N]回 [CMD]',
                    arguments: {
                        N: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        CMD: {
                            type: ArgumentType.STRING,
                            menu: 'motions',
                            defaultValue: ':.happy'
                        }
                    }
                },
                {
                    opcode: 'getBrowser',
                    text: 'user agent',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'calcPower',
                    blockType: BlockType.REPORTER,
                    text: 'べき乗:[NUM1] ** [NUM2]',
                    arguments: {
                        NUM1: {
                            type: ArgumentType.NUMBER
                        },
                        NUM2: {
                            type: ArgumentType.NUMBER
                        }
                    }
                }
            ],
            menus: {
                cmds: this.CMD_MENU,
                motions: this.MOTION_MENU,
            }
        };
    }

    _startStackTimer (util, duration_msec) {
        util.stackFrame.timer = new Timer();
        util.stackFrame.timer.start();
        util.stackFrame.duration = duration_msec;
        util.yield();
    }

    getURL (args) {
        let ret = this.url;
        if (this.url === undefined) {
            ret = '?';
        }
        
        return ret;
    }
    
    stop(args, util) {
        ret = this._peripheral.send_cmd(":auto_off");
        if (ret == "busy") {
            util.yield();
        }
    }

    execCmd (args, util) {
        const cmd = Cast.toString(args.CMD) + ' ' + Cast.toString(args.N);

        ret = this._peripheral.send_cmd(cmd);
        if (ret == "busy") {
            util.yield();
        }
    }
    
    move (args, util) {
        this.execCmd(args, util);
    }

    motion (args, util) {
        this.execCmd(args, util);
    }
    
    getBrowser () {
        return navigator.userAgent;
    }

    calcPower (args) {
        return args.NUM1 ** args.NUM2;
    }
}

module.exports = Scratch3Foo;
