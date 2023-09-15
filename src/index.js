import {TianAiCaptcha, CaptchaConfig} from "./captcha/captcha";
import $ from "jquery";
window.TAC = TianAiCaptcha;
window.CaptchaConfig = CaptchaConfig;
$(function () {
    // 样式配置
    const config = {
        requestCaptchaDataUrl: "http://localhost:8083/gen/random",
        validCaptchaUrl: "http://localhost:8083/check3",
        bindEl: "#captcha-box"
    }
    new TAC(config).init();
});
