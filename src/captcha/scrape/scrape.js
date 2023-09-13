import "@/captcha/slider/slider.scss"
import "./scrape.scss"
import $ from "jquery"
import {
    CommonCaptcha,
    clearAllPreventDefault,
    closeTips,
    down,
    drawBgImage,
    initConfig,
    showTips
} from "../common/common.js"

/**
 * 滑动验证码
 */

const TYPE = "SCRAPE"
const template =
    `
<div id="tianai-captcha" class="tianai-captcha-slider tianai-captcha-scrape">
    <div class="slider-tip">
        <span id="tianai-captcha-slider-move-track-font">拖动滑块出现完整的
            <img id="tianai-captcha-scrape-tip-img" src="" alt/>
        后就松开</span>
    </div>
    <div class="content">
        <div class="bg-img-div">
            <img id="tianai-captcha-slider-bg-img" src="" alt/>
            <canvas id="tianai-captcha-slider-bg-canvas"></canvas>
            <div class="slider-img-div" id="tianai-captcha-slider-img-div">      
        </div>
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
class Scrape extends CommonCaptcha{
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
    showTips(msg, type,callback) {
        showTips(this.el, msg,type, callback)
    }
    closeTips(callback) {
        closeTips(this.el, callback)
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
        this.el.find("#tianai-captcha-slider-img-div").css("transform", "translate(" + (currentCaptcha.left + moveX) + "px, 0px)")
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
        const bgImg = that.el.find("#tianai-captcha-slider-bg-img");
        bgImg.attr("src", data.captcha.backgroundImage);
        that.el.find("#tianai-captcha-scrape-tip-img").attr("src", data.captcha.templateImage);
        const left = data.captcha.data.blockWidth;
        const zoom = data.captcha.backgroundImageWidth / that.el.find("#tianai-captcha-slider-img-div").width();
        that.left = left / zoom;
        that.el.find("#tianai-captcha-slider-img-div").css("transform","translate("+that.left+"px, 0px)")
        bgImg.on("load",() => {
            that.currentCaptchaData = initConfig(bgImg.width(), bgImg.height(), 0,0, 300 - 55);
            that.currentCaptchaData.currentCaptchaId = data.id;
            // 重组
            drawBgImage(data.captcha, "tianai-captcha-slider-bg-canvas", "tianai-captcha-slider-bg-img", 50);
        });
    }
}

export default Scrape;