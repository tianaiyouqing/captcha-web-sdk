import "../common/common.scss"
import "./rotate_degree.scss"
import $ from "jquery"
import {CommonCaptcha,clearAllPreventDefault, down, drawBgImage, initConfig} from "../common/common.js"

/**
 * 滑动验证码
 */

const TYPE = "ROTATE_DEGREE"
const template =
  `
<div id="tianai-captcha" class="tianai-captcha-rotate2">
    <div class="slider-tip">
        <span id="tianai-captcha-slider-move-track-font">拖动滑块，使图片角度为正</span>
    </div>
    <div class="content">
        <div class="mask"></div>
        <div class="bg-img-div">
            <img id="tianai-captcha-slider-bg-img" src="" alt/>
            <canvas id="tianai-captcha-slider-bg-degree-canvas"></canvas>
            <img class="tianai-captcha-slider-bg-img-mask" />
        </div>
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
`
class RotateDegree extends CommonCaptcha{
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
    doDown() {
        this.el.find(".tianai-captcha-slider-bg-img-mask").css("display", "block")
    }
    doMove() {
        const moveX = this.currentCaptchaData.moveX;
        this.el.find("#tianai-captcha-slider-move-btn").css("transform", "translate(" + moveX + "px, 0px)")
        this.el.find("#tianai-captcha-slider-bg-img").css("transform", "rotate(" + (moveX / (currentCaptcha.currentCaptchaData.end / 360)) + "deg)")
        this.el.find("#tianai-captcha-slider-bg-degree-canvas").css("transform", "rotate(" + (moveX / (currentCaptcha.currentCaptchaData.end / 360)) + "deg)")
        this.el.find("#tianai-captcha-slider-move-track-mask").css("width", moveX + "px")
    }
    doUp() {
        this.el.find(".tianai-captcha-slider-bg-img-mask").css("display", "none")
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
        that.el.find("#tianai-captcha-slider-bg-img").attr("src", data.captcha.backgroundImage);
        that.el.find("#tianai-captcha-slider-bg-img").on("load",() => {
            const bgImg = that.el.find(".bg-img-div");
            that.currentCaptchaData = initConfig(bgImg.width(), bgImg.height(), 0, 0, 300 - 63 + 5);
            that.currentCaptchaData.currentCaptchaId = data.id;
            // 重组
            drawBgImage(data.captcha, "tianai-captcha-slider-bg-degree-canvas", "tianai-captcha-slider-bg-img", 30);
        });
    }
}

export default RotateDegree;
