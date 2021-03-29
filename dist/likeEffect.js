/** 配置 */
const defaultConfig = {
    icons: [],
    iconSize: 40,
    backgroundSize: 72,
    speed: 3,
    backgrounds: [
        "#ff839b, #fbd8b8",
        "#6a82fc, #cea8fd",
        "#43bbed, #38edc0",
        "#888efc, #43e2e6",
        "#f48d62, #fed1aa",
        "#fcd39b, #ffe87e",
        "#ffa7d3, #ffe2e8",
    ],
};
/**
 * 配置合并
 * TO DO 需要更详细合并规则
 */
function animationConfigMerge(target, source) {
    const getSourceType = (val) => Object.prototype.toString.call(val);
    if (getSourceType(target) !== "[object Object]") {
        throw new Error("target is not Object");
    }
    if (getSourceType(source) !== "[object Object]") {
        throw new Error("target is not Object");
    }
    Object.assign(target, source);
    // Object.keys(source).forEach((key: T) => {
    //    if (key in target && getSourceType(target[key]) === getSourceType(source[key])) {
    //    }
    // });
}

/**
 * 图片预加载
 * @param imgs 图片地址
 */
function preLoadImgs(imgs) {
    if (!imgs) {
        return;
    }
    /**
     * 加载图片
     * @param img
     */
    const load = (img) => {
        const image = new Image();
        image.src = img;
    };
    // 多个图片和单个图片加载
    if (Array.isArray(imgs)) {
        imgs.forEach(load);
    }
    else if (typeof imgs === "string") {
        load(imgs);
    }
}
/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
function getRandom(min, max) {
    const { floor, random } = Math;
    return min + floor(random() * (max - min));
}
/**
 * 获取数据随机值
 * @param arg 数据
 * @returns
 */
function getArrayRandom(arg) {
    const randomIndex = getRandom(0, arg.length);
    return arg[randomIndex];
}

// canvas
let canvas;
// ctx
let ctx;
// canvas size
let canvasWidth = 0;
let canvasHeight = 0;
// 配置
const animationConfig = { ...defaultConfig };
/**
 * 点赞效果初始化
 * @param elQuery
 * @param imgs
 */
function animationInit(elQuery, config) {
    // 如果参数为空
    if (!elQuery) {
        throw new Error("elQuery is undefined");
    }
    const elem = document.querySelector(elQuery);
    const devicePixelRatio = window.devicePixelRatio || 1;
    // canvas元素
    if (elem instanceof HTMLCanvasElement) {
        canvas = elem;
        ({ width: canvasWidth, height: canvasHeight } = canvas);
        const canvasShowWidth = Math.floor(canvasWidth / devicePixelRatio);
        const canvasShowHeight = Math.floor(canvasHeight / devicePixelRatio);
        canvas.style.cssText = `width: ${canvasShowWidth}px; height: ${canvasShowHeight} px`;
    }
    else {
        throw new Error("elQuery is not HTMLCanvasElement");
    }
    // 创建2D渲染上下文
    const context = canvas.getContext("2d");
    if (context) {
        ctx = context;
    }
    else {
        throw new Error("ctx is not CanvasRenderingContext2D");
    }
    // 合并参数
    animationConfigMerge(animationConfig, config);
    // 预加载图标
    preLoadImgs(animationConfig.icons);
}
/**
 * 动画执行完毕
 */
const animationEndListener = [];
function onAnimateEnd(fn) {
    if (typeof fn === "function") {
        animationEndListener.push(fn);
    }
}
let animationList = [];
/**
 * 渲染
 */
function render() {
    // 已完成的渲染索引
    const animationEndSet = new Set();
    /**
     * 获取大小
     * @param progress
     */
    function getScale(progress) {
        // 基础大小
        const baseScale = 0.2;
        return Math.min(baseScale + progress * 2, 1);
    }
    /**
     * 获取透明度
     * @param progress 距离边缘进度
     */
    function getOpacity(progress) {
        const showBase = 0.6;
        const showEndProgress = 0.3;
        const fadeStartProgress = 0.9;
        let opacity = 1;
        if (progress < showEndProgress) {
            opacity = showBase + (progress / 0.3) * (1 - showBase);
        }
        else if (progress > showEndProgress) {
            if (progress >= 1) {
                opacity = 0;
            }
            else {
                opacity = (1 - progress) / (1 - fadeStartProgress);
            }
        }
        return Math.min(opacity, 1);
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    animationList.forEach((options, idx) => {
        const { index, width, height, horizontalRange, background, icon, backgroundSize, speed, } = options;
        const { floor } = Math;
        const bgRdius = floor(backgroundSize / 2);
        const centerX = canvasWidth / 2 + Math.cos(index / 10) * horizontalRange;
        const centerY = canvasHeight - speed * index;
        const edgeProgress = (speed * index) / (canvasHeight - bgRdius);
        const scale = getScale(edgeProgress);
        const opacity = getOpacity(edgeProgress);
        // 渲染元素
        ctx.save();
        ctx.fillStyle = background;
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        // 透明度设置
        ctx.globalAlpha = opacity;
        // 绘制背景样式
        let fillStyle = "";
        // 如果是渐变
        if (background.includes(",")) {
            const [gradientStart = "", gradientEnd = ""] = background.split(",");
            fillStyle = ctx.createLinearGradient(-bgRdius, -bgRdius, 0, backgroundSize);
            fillStyle.addColorStop(0, gradientStart.trim());
            fillStyle.addColorStop(1, gradientEnd.trim());
        }
        else {
            fillStyle = background;
        }
        // 绘制背景
        ctx.beginPath();
        ctx.arc(0, 0, bgRdius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        // 绘制图标
        ctx.drawImage(icon, -floor(width / 2), -floor(height / 2), width, height);
        // 未完成动画
        if (centerY >= -backgroundSize) {
            options.index += 1;
            // 存储已经运动完成数组索引
        }
        else {
            animationEndSet.add(idx);
            if (animationEndListener.length > 0) {
                animationEndListener.forEach((fn) => fn());
            }
        }
        ctx.restore();
    });
    // 如果含有完成的元素则移除动画队列
    if (animationEndSet.size > 0) {
        animationList = animationList.filter((val, index) => !animationEndSet.has(index));
    }
    // // 是否继续执行动画
    if (animationList.length > 0) {
        requestAnimationFrame(render);
    }
}
/**
 * 添加一个动画
 */
function animationDraw() {
    // 没有初始话
    if (!(ctx instanceof CanvasRenderingContext2D)) {
        throw new Error("animation is not init, use animationInit init");
    }
    const { iconSize, icons, backgrounds, backgroundSize, speed, } = animationConfig;
    // 动态获取图标
    const icon = getArrayRandom(icons);
    // 动态获取图标背景颜色
    const background = getArrayRandom(backgrounds);
    // 水平移动最大范围
    const horizontalRange = getRandom(10, 60);
    const img = new Image();
    img.src = icon;
    // 动画队列添加元素
    animationList.push({
        index: 0,
        horizontalRange,
        width: iconSize,
        height: iconSize,
        icon: img,
        backgroundSize,
        background,
        speed,
    });
    if (animationList.length === 1) {
        requestAnimationFrame(render);
    }
}

export { animationDraw, animationInit, onAnimateEnd };
