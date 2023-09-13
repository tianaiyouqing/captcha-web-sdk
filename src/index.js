import {TianAiCaptcha, CaptchaConfig} from "./captcha/captcha";
window.TAC = TianAiCaptcha;
window.TAC.enc = {};
window.CaptchaConfig = CaptchaConfig;
TAC.enc.rsaPublicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDArgKannXgSG/WTmHP5ZdCsIhvSxZQxZ2sQt9wXBm9SJyCN0nc3h6TL6fwaJJwELWwkJiVd/Fp2qtZPVsCk09opKQiXtbkxk+9ZzgxbYe5rrOXAPj+PZz+2b3J1L009FZ0W32bR3wuY6TDoyzKmmLceJMcHDTK7g0RBcPvdUtWfQIDAQAB";
//
// $(function () {
//     // 样式配置
//     const styleConfig = {
//         // 按钮图片
//         btnUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3.png",
//         // 背景图片
//         bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
//         // logo图片
//         logoUrl: "https://minio.tianai.cloud/public/static/captcha/images/logo.png",
//         // 移动时滑动边框样式
//         moveTrackMaskBgColor: "#f7b645",
//         moveTrackMaskBorderColor: "#ef9c0d"
//     }
//     const config = {
//         requestCaptchaDataUrl: "http://localhost:8083/gen?type=SCRAPE",
//         validCaptchaUrl: "http://localhost:8083/check3",
//         bindEl: "#captcha-box",
//         chainString: "json>rsaaes>base64"
//     }
//     new TAC(config).init();
//
// });
