import "../common/common.scss"
import "@/captcha/slider/slider.scss"
import "./concat.scss"
import $ from "jquery"
import {CommonCaptcha, clearAllPreventDefault, down, initConfig} from "../common/common.js"


const TYPE  = "CONCAT";
const template =
    `
    <div id="tianai-captcha" class="tianai-captcha-slider tianai-captcha-concat">
    <div class="slider-tip">
        <span id="tianai-captcha-slider-move-track-font">拖动滑块完成拼图</span>
    </div>
    <div class="content">
        <div class="tianai-captcha-slider-concat-img-div" id="tianai-captcha-slider-concat-img-div">
            <img id="tianai-captcha-slider-concat-slider-img" src="" alt/>
        </div>
        <div class="tianai-captcha-slider-concat-bg-img"></div>
         <div class="tianai-captcha-tips" id="tianai-captcha-tips">验证失败，请重新尝试</div>
    </div>
    <div class="slider-move">
        <div class="slider-move-track">
            <div id="tianai-captcha-slider-move-track-mask"></div>
            <div class="slider-move-shadow"></div>
        </div>
        <div class="slider-move-btn" id="tianai-captcha-slider-move-btn">
        </div>
    </div>
</div>
    `;
class Concat extends CommonCaptcha{
    constructor(divId, styleConfig) {
        super();
        this.boxEl = $(divId);
        this.styleConfig = styleConfig;
        this.type = TYPE;
        this.currentCaptchaData = {}
    }
    init(captchaData, endCallback, loadSuccessCallback) {
        // 重载样式
        this.destory();
        this.boxEl.append(template);
        this.el = $(this.boxEl.find("#tianai-captcha"));
        this.loadStyle();
        // 按钮绑定事件
        this.el.find("#tianai-captcha-slider-move-btn").mousedown(down);
        this.el.find("#tianai-captcha-slider-move-btn").on("touchstart", down);
        clearAllPreventDefault(this.el);
        // 绑定全局
        window.currentCaptcha = this;
        // 载入验证码
        this.loadCaptchaForData(this, captchaData);
        this.endCallback = endCallback;
        if (loadSuccessCallback) {
            // 加载成功
            loadSuccessCallback(this);
        }
        return this;
    }
    destory () {
        const existsCaptchaEl = this.boxEl.children("#tianai-captcha");
        if (existsCaptchaEl) {
            existsCaptchaEl.remove();
        }
    }
    doMove() {
        const moveX = this.currentCaptchaData.moveX;
        this.el.find("#tianai-captcha-slider-move-btn").css("transform", "translate(" + moveX + "px, 0px)")
        this.el.find("#tianai-captcha-slider-concat-img-div").css("background-position-x", moveX + "px");
        this.el.find("#tianai-captcha-slider-move-track-mask").css("width", moveX + "px")
    }
    loadStyle () {
        let sliderImg = "";
        let bgImg = "";
        let moveTrackMaskBorderColor = "#00f4ab";
        let moveTrackMaskBgColor = "#a9ffe5";
        let logoUrl = "images/logo.png"
        const styleConfig = this.styleConfig;
        if (styleConfig) {
            sliderImg = styleConfig.btnUrl;
            bgImg = styleConfig.bgUrl;
            moveTrackMaskBgColor = styleConfig.moveTrackMaskBgColor;
            moveTrackMaskBorderColor = styleConfig.moveTrackMaskBorderColor;
            if (styleConfig.logoUrl) {
                logoUrl = this.styleConfig.logoUrl;
            }
        }
        this.el.find("#tianai-captcha-logo").attr("src", logoUrl);
        this.el.find("#tianai-captcha-bg-img").css("background-image", "url(" + bgImg + ")");
        this.el.find(".slider-move .slider-move-btn").css("background-image", "url(" + sliderImg + ")");
        // this.el.find("#tianai-captcha-slider-move-track-font").text(title);
        this.el.find("#tianai-captcha-slider-move-track-mask").css("border-color", moveTrackMaskBorderColor);
        this.el.find("#tianai-captcha-slider-move-track-mask").css("background-color", moveTrackMaskBgColor);
    }
    loadCaptchaForData (that, data) {
        const bgImg = that.el.find(".tianai-captcha-slider-concat-bg-img");
        const sliderImg = that.el.find("#tianai-captcha-slider-concat-img-div");
        bgImg.css("background-image", "url(" + data.captcha.backgroundImage + ")");
        sliderImg.css("background-image", "url(" + data.captcha.backgroundImage + ")");
        sliderImg.css("background-position", "0px 0px");
        var backgroundImageHeight = data.captcha.backgroundImageHeight;
        var height = ((backgroundImageHeight - data.captcha.data.randomY) / backgroundImageHeight) * 180;
        sliderImg.css("height", height)

        that.currentCaptchaData = initConfig(bgImg.width(), bgImg.height(), sliderImg.width(), sliderImg.height(), 300 - 63 + 5);
        that.currentCaptchaData.currentCaptchaId = data.id;
    }
}

export default Concat;
