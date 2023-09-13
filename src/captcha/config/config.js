import $ from "jquery";
// import CryptoJS from 'crypto-js'
// import JSEncrypt from "jsencrypt";

class CaptchaConfig {
    constructor(args) {
        if (!args.bindEl) {
            throw new Error("[TAC] 必须配置 [bindEl]用于将验证码绑定到该元素上");
        }
        if (!args.requestCaptchaDataUrl) {
            throw new Error("[TAC] 必须配置 [requestCaptchaDataUrl]请求验证码接口");
        }
        if (!args.validCaptchaUrl) {
            throw new Error("[TAC] 必须配置 [validCaptchaUrl]验证验证码接口");
        }
        this.bindEl = args.bindEl;
        this.$bindEl = $(args.bindEl);
        this.requestCaptchaDataUrl = args.requestCaptchaDataUrl;
        this.validCaptchaUrl = args.validCaptchaUrl;
        if (args.validSuccess) {
            this.validSuccess = args.validSuccess;
        }
        if (args.validFail) {
            this.validFail = args.validFail;
        }

        this.requestChain = [];
        this.addRequestChainByString(args.chainString);
    }
    addRequestChainByString(chainString) {
        if (!chainString) {
            return
        }
        const chains = chainString.split(">")
        // 对chains字符串用>分隔
        for (const c of chains) {
            const chain = captchaRequestChains[c];
            if (chain) {
                this.addRequestChain(chain);
            }else {
                throw new Error(`[TAC] chains错误， 无法读取到[${c}]`);
            }
        }

    }
    addRequestChain(fun) {
        this.requestChain.push(fun);
    }

    requestCaptchaData() {
        const requestParam = {}
        // 请求前装载参数
        this._preRequest("requestCaptchaData", requestParam);
        // 发送请求
        const request = this.doSendRequest("requestCaptchaData", requestParam);
        // 返回结果
        return request.then(res => {
            // 装返回结果
            this._postRequest("requestCaptchaData", requestParam, res);
            // 返回结果
            return res;
        });
    }

    doSendRequest(type, requestParam) {
        let requestUrl;
        if (type === "requestCaptchaData") {
            requestUrl = this.requestCaptchaDataUrl;
        } else {
            requestUrl = this.validCaptchaUrl;
        }
        return new Promise((resolve, reject) => {
            $.ajax({
                url: requestUrl,
                type: "POST",
                data: JSON.stringify(requestParam),
                dataType: "json",
                contentType:  "application/json;charset=UTF-8",
                success: (data) => {
                    resolve(data);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    }

    _preRequest(type, requestParam, c, tac) {
        for (let i = 0; i < this.requestChain.length; i++) {
            const r = this.requestChain[i];
            if (r.preRequest) {
                if (!r.preRequest(type, requestParam, this, c, tac)) {
                    break;
                }
            }
        }

    }

    _postRequest(type, requestParam, res, c, tac) {
        for (let i = 0; i < this.requestChain.length; i++) {
            const r = this.requestChain[i];
            // 判断r是否存圩postRequest方法
            if (r.postRequest) {
                if (!r.postRequest(type, requestParam, res, this, c, tac)) {
                    break;
                }
            }
        }
    }

    validCaptcha(currentCaptchaId, data, c, tac) {
        const sendParam = {
            id: currentCaptchaId,
            data: data
        };
        this._preRequest("validCaptcha", sendParam, c, tac);
        const request = this.doSendRequest("validCaptcha", sendParam);
        return request.then(res => {
            this._postRequest("validCaptcha", sendParam, res, c, tac);
            return res;
        }).then(res => {
            if (res.code === 200) {
                const useTimes = (data.endSlidingTime - data.startSlidingTime) / 1000;
                c.showTips(`验证成功,耗时${useTimes}秒`, 1, () => this.validSuccess(res, c, tac));
            } else {
                let tipMsg = "验证失败，请重新尝试!";
                if (res.code) {
                    if (res.code !== 4001) {
                        tipMsg = "验证码被黑洞吸走了！";
                    }
                }
                c.showTips(tipMsg, 0, () => this.validFail(res, c, tac));
            }
        });
    }

    validSuccess(res, c, tac) {
        console.log("验证码校验成功， 请重写  [config.validSuccess] 方法， 用于自定义逻辑处理")
        window.currentCaptchaRes = res;
        tac.destroyWindow();
    }

    validFail(res, c, tac) {
        tac.reloadCaptcha();
    }
}

function wrapConfig(config) {
    if (config instanceof CaptchaConfig) {
        return config;
    }
    return new CaptchaConfig(config);
}

function wrapStyle(style) {
    if (!style) {
        style = {}
    }

    if (!style.btnUrl) {
        // 设置默认图片
        style.btnUrl = "data:image/png;base64,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";
    }
    if (!style.moveTrackMaskBgColor && !style.moveTrackMaskBorderColor) {
        style.moveTrackMaskBgColor = "#89d2ff";
        style.moveTrackMaskBorderColor = "#0298f8";

    }
    return style;
}

const captchaRequestChains = {
    "rsaaes": {
        preRequest(type, param, c, tac) {
            if (type !== "validCaptcha") {
                // 只有验证上传数据时才进行aes加密
                return true;
            }
            // 随机生成aes的key和iv
            const key = CryptoJS.lib.WordArray.random(16);
            const iv = CryptoJS.lib.WordArray.random(16);
            // 对param.data进行aes加密
            const data = CryptoJS.AES.encrypt(param.data, key, {
                iv: iv,
                padding: CryptoJS.pad.NoPadding,
                mode: CryptoJS.mode.CTR
            });
            param.data = data.ciphertext;
            const keyAndIv = key.toString() + "|" + iv.toString();
            const rsaPublicKey = window.TAC.enc.rsaPublicKey;
            if (!rsaPublicKey) {
                throw new Error("请配置rsa公钥");
            }
            // 使用公钥rsaPublicKey对keyAndIv进行加密
            const jsEncrypt = new JSEncrypt();
            jsEncrypt.setPublicKey(rsaPublicKey);
            param.ki = jsEncrypt.encrypt(keyAndIv);

            return true;
        },
        postRequest(type, param, c, tac) {
            return true;
        }
    },
    "base64": {
        preRequest(type, param, c, tac) {
            if (type !== "validCaptcha") {
                // 只有验证上传数据时才进行aes加密
                return true;
            }
            // 对param.data使用CryptoJS进行base64加密
            if (param.data) {
                param.data = CryptoJS.enc.Base64.stringify(param.data);
            }
            return true;
        }
    },
    "json": {
        preRequest(type, param, c, tac) {
            param.data = JSON.stringify(param.data);
            return true;
        }
    }
}


export {CaptchaConfig, wrapConfig, wrapStyle}
