/**
 * 图片预加载
 * @param imgs 图片地址
 */
const preLoadImgs = (imgs) => {
    imgs.forEach((val) => {
        const image = new Image();
        image.src = val;
    });
};
/**
 * 点赞效果初始化
 * @param elQuery
 * @param imgs
 */
// canvas
let canvas;
// ctx
let ctx;
// canvas size
let canvasWidth = 0;
let canvasHeight = 0;
export const animationInit = (elQuery, imgs) => {
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
    const context = canvas.getContext("2d");
    if (context) {
        ctx = context;
    }
    else {
        throw new Error("ctx is not CanvasRenderingContext2D");
    }
    // 如果含有自定义表情
    if (Array.isArray(imgs) && imgs.length > 0) {
        preLoadImgs(imgs);
    }
};
/**
 * 动画执行完毕
 */
// animationCallback
const animationEndListener = [];
export const onAnimateEnd = (fn) => {
    if (typeof fn === "function") {
        animationEndListener.push(fn);
    }
};
let animationList = [];
/**
 * 渲染
 */
const render = () => {
    // 已完成的渲染索引
    const animationEndSet = new Set();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    animationList.forEach((options, index) => {
        const { left, top, width, height, background = "red", } = options;
        const { floor, min } = Math;
        const centerX = left + floor(width / 2);
        const centerY = top + floor(height / 2);
        const scale = min((canvasHeight - top) / 60, 1);
        // 渲染元素
        ctx.save();
        ctx.fillStyle = background;
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        ctx.fillRect(-floor(width / 2), -floor(height / 2), width, height);
        // 未完成动画
        if (top >= -height) {
            options.top -= 2;
            // 存储已经运动完成数组索引
        }
        else {
            animationEndSet.add(index);
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
    // 是否继续执行动画
    if (animationList.length > 0) {
        requestAnimationFrame(render);
    }
};
/**
 * 添加一个动画
 */
export const animationDraw = () => {
    // 没有初始话
    if (!(ctx instanceof CanvasRenderingContext2D)) {
        throw new Error("animation is not init, use animationInit init");
    }
    // 动画队列添加元素
    animationList.push({
        left: Math.floor(canvasWidth / 2 - 20),
        top: canvasHeight,
        width: 40,
        height: 40,
        background: "green",
    });
    if (animationList.length === 1) {
        requestAnimationFrame(render);
    }
};
/**
 * 随机点
 */
// const createRandom = (min: number, max: number, len: number) => {
//    const arr = new Array(len).fill(1);
//    const result = arr.map(() => {
//       const { random, floor } = Math;
//       return min + floor(random() * (max - min));
//    });
//    return result;
// };
// const randomPosition = createRandom(20, 60, canvasHeight);
