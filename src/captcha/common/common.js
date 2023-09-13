import $ from "jquery"

/** 是否打印日志 */
var isPrintLog = false;

function printLog(params) {
    if (isPrintLog) {
        console.log(JSON.stringify(params));
    }
}

/**
 * 清除默认事件
 * @param event event
 */
function clearPreventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
}
/**
 * 阻止某div默认事件
 * @param $div
 */
function clearAllPreventDefault($div) {
    $div.each(function (index, el) {
        el.addEventListener('touchmove', clearPreventDefault, {passive: false});
    });
}

function reductionAllPreventDefault($div) {
    $div.each(function (index, el) {
        el.removeEventListener('touchmove', clearPreventDefault);
    });
}

/**
 * 对于乱序背景图进行重组(暂时还有bug)
 * @param data 图片数据
 * @param canvasId canvas
 * @param imgId 对应的图片id
 * @param delay 延时
 */
function drawBgImage(data, canvasId, imgId, delay) {
    if (!data.data || !data.data.shuffle) {
        return;
    }
    var img = document.getElementById(imgId);
    if (img.width == 0 || img.height == 0) {
        setTimeout(drawBgImage(data, canvasId, imgId, delay), 50);
    }

    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");
    img = document.getElementById(imgId);
    c.width = img.width;
    c.height = img.height;

    const shuffle = data.data.shuffle;
    const sourceImageWidth = data.backgroundImageWidth;
    const sourceImageHeight = data.backgroundImageHeight;
    const canvasImageWidth = c.width;
    const canvasImageHeight = c.height;
    const xNum = shuffle.x;
    const yNum = shuffle.y;
    const pos = shuffle.pos;

    const sourceBlockX = sourceImageWidth / xNum;
    const sourceBlockY = sourceImageHeight / yNum;
    const blockX = canvasImageWidth / xNum;
    const blockY = canvasImageHeight / yNum;
    const sourceImageBlocks = [];
    const imageBlocks = [];
    for (let i = 0; i < yNum; i++) {
        for (let o = 0; o < xNum; o++) {
            sourceImageBlocks.push({
                startX: Math.floor(o * sourceBlockX),
                startY: Math.floor(i * sourceBlockY)
            });
            imageBlocks.push({
                startX: Math.round(o * blockX),
                startY: Math.round(i * blockY)
            });
        }
    }
    const evalFuns = []
    for (let i = 0; i < pos.length; i++) {
        const p = pos[i]
        const sourceBlock = sourceImageBlocks[p];
        const block = imageBlocks[i];
        evalFuns.push(() => {
            ctx.drawImage(img, sourceBlock.startX, sourceBlock.startY, sourceBlockX, sourceBlockY, block.startX, block.startY, blockX, blockY);
        });
    }
    evalFuns.sort((a, b) => {
        return Math.random() > .5 ? -1 : 1;
    });
    for (let i = 0; i < evalFuns.length; i++) {
        let fun = evalFuns[i]
        if (delay > 0) {
            setTimeout(fun, (i + 1) * delay);
        } else {
            fun();
        }
    }
}

/**
 * 获取当前坐标
 * @param event 事件
 * @returns {{x: number, y: number}}
 */
function getCurrentCoordinate(event) {
    if (event.pageX !== null && event.pageX !== undefined) {
        return {
            x: Math.round(event.pageX),
            y: Math.round(event.pageY)
        }
    }
    let targetTouches;
    if (event.changedTouches) {
        // 抬起事件
        targetTouches = event.changedTouches;
    } else if (event.targetTouches) {
        // pc 按下事件
        targetTouches = event.targetTouches;
    } else if (event.originalEvent && event.originalEvent.targetTouches) {
        // 鼠标触摸事件
        targetTouches = event.originalEvent.targetTouches;
    }
    if (targetTouches[0].pageX !== null && targetTouches[0].pageX !== undefined) {
        return {
            x: Math.round(targetTouches[0].pageX),
            y: Math.round(targetTouches[0].pageY)
        }
    }
    return {
        x: Math.round(targetTouches[0].clientX),
        y: Math.round(targetTouches[0].clientY)
    }
}

function down(event) {
    const coordinate = getCurrentCoordinate(event);
    let startX = coordinate.x;
    let startY = coordinate.y;
    currentCaptcha.currentCaptchaData.startX = startX;
    currentCaptcha.currentCaptchaData.startY = startY;

    const pageX = currentCaptcha.currentCaptchaData.startX;
    const pageY = currentCaptcha.currentCaptchaData.startY;
    const startTime = currentCaptcha.currentCaptchaData.startTime;
    const trackArr = currentCaptcha.currentCaptchaData.trackArr;
    trackArr.push({
        x: pageX - startX,
        y: pageY - startY,
        type: "down",
        t: (new Date().getTime() - startTime.getTime())
    });
    printLog(["start", startX, startY])
    // pc
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    // 手机端
    window.addEventListener("touchmove", move, false);
    window.addEventListener("touchend", up, false);
    if (window.currentCaptcha.doDown) {
        window.currentCaptcha.doDown(event,window.currentCaptcha)
    }
}

function move(event) {
    if (event.touches && event.touches.length > 0) {
        event = event.touches[0];
    }
    const coordinate = getCurrentCoordinate(event);
    let pageX = coordinate.x;
    let pageY = coordinate.y;
    const startX = window.currentCaptcha.currentCaptchaData.startX;
    const startY = window.currentCaptcha.currentCaptchaData.startY;
    const startTime = window.currentCaptcha.currentCaptchaData.startTime;
    const end = window.currentCaptcha.currentCaptchaData.end;
    const bgImageWidth = window.currentCaptcha.currentCaptchaData.bgImageWidth;
    const trackArr = window.currentCaptcha.currentCaptchaData.trackArr;
    let moveX = pageX - startX;
    const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "move",
        t: (new Date().getTime() - startTime.getTime())
    };
    trackArr.push(track);
    if (moveX < 0) {
        moveX = 0;
    } else if (moveX > end) {
        moveX = end;
    }
    window.currentCaptcha.currentCaptchaData.moveX = moveX;
    window.currentCaptcha.currentCaptchaData.movePercent = moveX / bgImageWidth;
    if (window.currentCaptcha.doMove) {
        window.currentCaptcha.doMove(event,currentCaptcha);
    }
    printLog(["move", track])
}

function up(event) {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", up);
    const coordinate = getCurrentCoordinate(event);
    currentCaptcha.currentCaptchaData.stopTime = new Date();
    let pageX = coordinate.x;
    let pageY = coordinate.y;
    const startX = currentCaptcha.currentCaptchaData.startX;
    const startY = currentCaptcha.currentCaptchaData.startY;
    const startTime = currentCaptcha.currentCaptchaData.startTime;
    const trackArr = currentCaptcha.currentCaptchaData.trackArr;

    const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "up",
        t: (new Date().getTime() - startTime.getTime())
    }

    trackArr.push(track);
    printLog(["up", track])
    if (window.currentCaptcha.doUp) {
        window.currentCaptcha.doUp(event, window.currentCaptcha)
    }
    window.currentCaptcha.endCallback(currentCaptcha.currentCaptchaData,currentCaptcha);
}

function initConfig(bgImageWidth, bgImageHeight, sliderImageWidth, sliderImageHeight, end) {
    const currentCaptchaConfig = {
        startTime: new Date(),
        trackArr: [],
        movePercent: 0,
        clickCount: 0,
        bgImageWidth: bgImageWidth,
        bgImageHeight: bgImageHeight,
        sliderImageWidth: sliderImageWidth,
        sliderImageHeight: sliderImageHeight,
        end: end
    }
    printLog(["init", currentCaptchaConfig]);
    return currentCaptchaConfig;
}

function closeTips(el, callback) {
    const tipEl = $(el.find("#tianai-captcha-tips"));
    tipEl.removeClass("tianai-captcha-tips-on")
    // tipEl.removeClass("tianai-captcha-tips-success")
    // tipEl.removeClass("tianai-captcha-tips-error")
    // 延时
    if (callback) {
        setTimeout(callback, .35);
    }
}

function showTips(el, msg, type, callback) {
    const tipEl = $(el.find("#tianai-captcha-tips"));
    tipEl.text(msg);
    if (type === 1) {
        // 成功
        tipEl.removeClass("tianai-captcha-tips-error")
        tipEl.addClass("tianai-captcha-tips-success")
    } else {
        // 失败
        tipEl.removeClass("tianai-captcha-tips-success")
        tipEl.addClass("tianai-captcha-tips-error")
    }
    tipEl.addClass("tianai-captcha-tips-on");
    // 延时
    setTimeout(callback, 1000);
}
class CommonCaptcha {
    showTips(msg, type, callback) {
        showTips(this.el, msg, type, callback)
    }
    closeTips(msg, callback) {
        closeTips(this.el, msg, callback)
    }
}

export {
    CommonCaptcha,
    drawBgImage,
    clearAllPreventDefault,
    down,
    move,
    up,
    initConfig,
    showTips,
    closeTips
}
