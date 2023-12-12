import $ from "jquery"
import "./captcha.scss"
import Slider from "./slider/slider"
import Rotate from "./rotate/rotate";
import Concat from "./concat/concat";
import WordImageClick from "./word_image_click/word_image_click";
import {CaptchaConfig, wrapConfig, wrapStyle} from "./config/config";

const template =
    `
    <div id="tianai-captcha-parent">
        <div id="tianai-captcha-bg-img"></div>
        <div id="tianai-captcha-box">
            <img id="tianai-captcha-loading" class="loading" style="display: block" src="data:image/gif;base64,R0lGODlhZABkALMPAOP49Jzk2Lns46Pm2/X8+33aytX07pTh1Kvo3sTv6Nz28ef59vH7+g+9oPr+/f///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjZERUE3QkNBNUY0MTFFOUJCQTZFOUY4NkU2MDExMjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjZERUE3QkRBNUY0MTFFOUJCQTZFOUY4NkU2MDExMjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNkRFQTdCQUE1RjQxMUU5QkJBNkU5Rjg2RTYwMTEyMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyNkRFQTdCQkE1RjQxMUU5QkJBNkU5Rjg2RTYwMTEyMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t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" alt="loading">
        </div>
        <!-- 底部 -->
        <div class="slider-bottom">
            <img class="logo" id="tianai-captcha-logo" src="https://minio.tianai.cloud/public/static/captcha/images/logo.png" id="tianai-captcha-logo"></img>
            <div class="close-btn" id="tianai-captcha-slider-close-btn"></div>
            <div class="refresh-btn" id="tianai-captcha-slider-refresh-btn"></div>
        </div>
    </div>
    `;
function createCaptchaByType(type, styleConfig) {
    switch (type) {
        case "SLIDER":
            return new Slider("#tianai-captcha-box", styleConfig);
        case "ROTATE":
            return new Rotate("#tianai-captcha-box", styleConfig);
        case "CONCAT":
            return new Concat("#tianai-captcha-box", styleConfig);
        case "WORD_IMAGE_CLICK":
            return new WordImageClick("#tianai-captcha-box", styleConfig);
        default:
            return null;
    }
}
class TianAiCaptcha {
    constructor(config, style) {
        this.config = wrapConfig(config);
        this.style = wrapStyle(style);
    }

    init() {
        this.destroyWindow();
        this.config.$bindEl.append(template);
        this.loadStyle();
        // 绑定按钮事件
        this.config.$bindEl.find("#tianai-captcha-slider-refresh-btn").click(() => {
            this.reloadCaptcha();
        });
        this.config.$bindEl.find("#tianai-captcha-slider-close-btn").click(() => {
            this.destroyWindow();
        });
        // 加载验证码
        this.reloadCaptcha();
        return this;
    }

    reloadCaptcha() {
        this.showLoading();
        this.destroyCaptcha(() => {
            this.createCaptcha();
        })
    }
    showLoading() {
        this.config.$bindEl.find("#tianai-captcha-loading").css("display", "block");
    }
    closeLoading() {
        this.config.$bindEl.find("#tianai-captcha-loading").css("display", "none");
    }
    loadStyle() {
        // 设置样式
        const bgUrl = this.style.bgUrl;
        const logoUrl = this.style.logoUrl;
        if (bgUrl) {
            // 背景图片
            this.config.$bindEl.find("#tianai-captcha-bg-img").css("background-image", "url(" + bgUrl + ")");
        }
        if (logoUrl && logoUrl !== "") {
            // logo
            this.config.$bindEl.find("#tianai-captcha-logo").attr("src", logoUrl);
        }else {
            // 删除logo
            this.config.$bindEl.find("#tianai-captcha-logo").attr("display", "none");
        }
    }

    destroyWindow() {
        window.currentCaptcha = undefined;
        this.config.$bindEl.find("#tianai-captcha-parent").remove();
    }

    openCaptcha() {
        setTimeout(() => {
            window.currentCaptcha.el.css("transform", "translateX(0)")
        }, 10)
    }

    createCaptcha() {
        this.config.requestCaptchaData().then(data => {
            this.closeLoading();
            const captcha = createCaptchaByType(data.captcha.type, this.style);
            if (captcha == null) {
                throw new Error("[TAC] 未知的验证码类型[" + data.captcha.type + "]");
            }
            captcha.init(data, (d, c) => {
                // 验证
                const currentCaptchaData = c.currentCaptchaData;
                const data = {
                    bgImageWidth: currentCaptchaData.bgImageWidth,
                    bgImageHeight: currentCaptchaData.bgImageHeight,
                    sliderImageWidth: currentCaptchaData.sliderImageWidth,
                    sliderImageHeight: currentCaptchaData.sliderImageHeight,
                    startSlidingTime: currentCaptchaData.startTime,
                    endSlidingTime: currentCaptchaData.stopTime,
                    trackList: currentCaptchaData.trackArr
                };
                if (c.type === 'ROTATE_DEGREE' || c.type === 'ROTATE') {
                    data.bgImageWidth = c.currentCaptchaData.end;
                }
                // 清空
                const id = c.currentCaptchaData.currentCaptchaId;
                c.currentCaptchaData = undefined;
                // 调用验证接口
                this.config.validCaptcha(id, data, c, this)
            })
            this.openCaptcha()
        });
    }

    destroyCaptcha(callback) {
        if (window.currentCaptcha) {
            window.currentCaptcha.el.css("transform", "translateX(300px)")
            setTimeout(() => {
                window.currentCaptcha.destroy();
                if (callback) {
                    callback();
                }
            }, 500)
        } else {
            callback();
        }
    }


}

export {TianAiCaptcha, CaptchaConfig}
