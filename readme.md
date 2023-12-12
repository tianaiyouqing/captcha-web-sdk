# 						(captcha-web-sdk) 

# 是一个([TIANAI-CAPTCHA)](https://gitee.com/tianai/tianai-captcha)验证码前端脚手架工具

## 原生HTML使用方法

​	**注：tac.min.js`和`tac.css` 作者已经打包好放到（gitee）release中，可自行下载使用**

1. 导入`tac.min.js`和`tac.css`和`jquery`

   ```html
   <link href="styles/tac.css" rel="stylesheet">
   <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
   <script src="tac.min.js"></script>
   ```

2. 创建一个div快用于渲染验证码

   ```html
    <div id="captcha-box"></div>
   ```

3. 在需要调用验证码的时候执行加载验证码方法

   ```js
   const config = {
       // 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
       requestCaptchaDataUrl: "/gen",
       // 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
       validCaptchaUrl: "/check",
       // 验证码绑定的div块 (必选项,必须配置)
       bindEl: "#captcha-box",
       // 验证成功回调函数(必选项,必须配置)
       validSuccess: (res, c, tac) => {
           console.log("验证成功，后端返回的数据为", res);
           alert("验证成功");
           // 销毁验证码服务
           tac.destroyWindow();
       },
       // 验证失败的回调函数(可忽略，如果不自定义 validFail 方法时，会使用默认的)
       validFail: (res, c, tac) => {
           // 验证失败后重新拉取验证码
           tac.reloadCaptcha();
       }
   }
    // 创建 TAC 启动验证码服务,调用该方法后会在指定的div块中渲染出验证码
   new TAC(config).init();
   ```

## VUE2使用方法

导入`tac.min.js`和`tac.css`和`jquery` 后和原生使用方法调用即可

```vue
<template>
  <div class="login-div">
    <div class="kuang"><span class="kuang-left">用户名</span>天爱有情</div>
    <div class="kuang"><span class="kuang-left">密码</span>*********</div>
    <div id="login-btn" @click="loginBtn">登录</div>
    <div id="captcha-div"></div>
  </div>
</template>

<script>
    import "@/assets/captcha/css/tac.css" // 验证码css
    import "@/assets/captcha/js/jquery.min.js"; // 验证码js
    import "@/assets/captcha/js/tac.min.js"; // 验证码js
    
    export default {
        methods: {
            loginBtn() {
                // 样式配置
                const config = {
                    requestCaptchaDataUrl: "http://localhost:8083/gen/random",
                    validCaptchaUrl: "http://localhost:8083/check3",
                    bindEl: "#captcha-div",
                    // 验证成功回调函数
                    validSuccess:(res,c,tac)=> {
                        this.login();
                        tac.destroyWindow();
                    }
                }
                new window.TAC(config).init();
            },
            login() {
                alert("登录成功")
            }
        }
    }
</script>
```

## 其它框架使用方法

### 导入写好的`tac.min.js`和`tac.css`即可， 或者把该项目复制到自己项目用使用即可

## 一些扩展功能

### 去除或者替换默认的logo

```js
let config ={...}
let style = {logoUrl: null}// 去除logo             
//let style = {logoUrl: "/xx/xx/xxx.png"}// 替换成自定义的logo             
new TAC(config,style).init();
```

### 对滑块的按钮和背景设置为自定义的一些样式

```js
// 这里分享一些作者自己调的样式供参考
const style =    {
    	// 按钮样式
        btnUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3.png",
    	// 背景样式
        bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
    	// logo地址
        logoUrl: "https://minio.tianai.cloud/public/static/captcha/images/logo.png",
 		// 滑动边框样式
    	moveTrackMaskBgColor: "#f7b645",
        moveTrackMaskBorderColor: "#ef9c0d"
    }
new TAC(config,style).init();
```

