// import { defaultConfig, animationConfigMerge } from "./config";
// import type { AnimationConfig } from "./config";
// import { preLoadImgs, getArrayRandom } from "./ulits";
/**
 * 图片预加载
 * @param imgs 图片地址
 */
export const preLoadImgs = (imgs: string[] | undefined | string) => {
   if (!imgs) {
      return;
   }

   /**
    * 加载图片
    * @param img
    */
   const load = (img: string) => {
      const image = new Image();

      image.src = img;
   };

   // 多个图片和单个图片加载
   if (Array.isArray(imgs)) {
      imgs.forEach(load);
   } else if (typeof imgs === "string") {
      load(imgs);
   }
};

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export const getRandom = (min: number, max: number): number => {
   const { floor, random } = Math;
   return min + floor(random() * (max - min));
};

/**
 * 获取数据随机值
 * @param arg 数据
 * @returns
 */
export const getArrayRandom = <T>(arg:Array<T>): T => {
   const randomIndex = getRandom(0, arg.length);

   return arg[randomIndex];
};

export interface AnimationConfig {
   /** 图标 */
   icons: string[];
   /** 背景  */
   background: string[];
   /** 速度 */
   speed: number
}

/** 配置 */
export const defaultConfig: AnimationConfig = {
   icons: [],
   speed: 100,
   background: [
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
export const animationConfigMerge = (target:AnimationConfig, source: Partial<AnimationConfig>): void => {
   const getSourceType = <K>(val: K) => Object.prototype.toString.call(val);

   if (getSourceType(target) === "[object Object]") {
      throw new Error("target is not Object");
   }

   if (getSourceType(source) === "[object Object]") {
      throw new Error("target is not Object");
   }

   Object.assign(target, source);

   // Object.keys(source).forEach((key: T) => {
   //    if (key in target && getSourceType(target[key]) === getSourceType(source[key])) {

   //    }
   // });
};

// canvas
let canvas: HTMLCanvasElement;
// ctx
let ctx: CanvasRenderingContext2D;
// canvas size
let canvasWidth: number = 0;
let canvasHeight: number = 0;
// 配置
const animationConfig = { ...defaultConfig };

/**
 * 点赞效果初始化
 * @param elQuery
 * @param imgs
 */
export const animationInit = (elQuery: string, config: Partial<AnimationConfig>) => {
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
   } else {
      throw new Error("elQuery is not HTMLCanvasElement");
   }

   // 创建2D渲染上下文
   const context = canvas.getContext("2d");

   if (context) {
      ctx = context;
   } else {
      throw new Error("ctx is not CanvasRenderingContext2D");
   }

   // 合并参数
   animationConfigMerge(animationConfig, config);

   // 预加载图标
   preLoadImgs(animationConfig.icons);
};

/**
 * 动画执行完毕
 */
// animationCallback
const animationEndListener: Function[] = [];
export const onAnimateEnd = (fn: Function): void => {
   if (typeof fn === "function") {
      animationEndListener.push(fn);
   }
};

let animationList: Array<{
   /** 左偏移 */
   left: number;
   /** 右偏移 */
   top: number;
   /** 宽度 */
   width: number;
   /** 高度 */
   height: number;
   /** 图标 */
   icon: string;
   /** 背景颜色 */
   background: string;
   /** 背景大小 */
   backgroundSize: number;
}> = [];

/**
 * 渲染
 */
const render = () => {
   // 已完成的渲染索引
   const animationEndSet: Set<number> = new Set();

   ctx.clearRect(0, 0, canvasWidth, canvasHeight);

   animationList.forEach((options, index) => {
      const {
         left, top, width, height, background, icon, backgroundSize,
      } = options;

      const img = new Image();
      img.src = icon;

      const { floor, min } = Math;
      const bgRdius = floor(backgroundSize / 2);
      const centerX = left + floor(width / 2);
      const centerY = top + floor(height / 2);
      const scale = min(0.3 + (canvasHeight - top) / (canvasHeight / 3), 1);
      // const opacity = min(top / (canvasHeight / 8), 1);

      // 渲染元素
      ctx.save();
      ctx.fillStyle = background;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);

      // 透明度设置
      // ctx.globalAlpha = opacity;

      // 绘制背景样式
      let fillStyle: string | CanvasGradient = "";

      // 如果是渐变
      if (background.includes(",")) {
         const [gradientStart = "", gradientEnd = ""] = background.split(",");
         fillStyle = ctx.createLinearGradient(-bgRdius, -bgRdius, 0, backgroundSize);
         fillStyle.addColorStop(0, gradientStart.trim());
         fillStyle.addColorStop(1, gradientEnd.trim());
      } else {
         fillStyle = background;
      }

      // 绘制背景
      ctx.beginPath();
      ctx.arc(0, 0, bgRdius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();

      // 绘制图标
      ctx.drawImage(img, -floor(width / 2), -floor(height / 2), width, height);

      // 未完成动画
      if (top >= -backgroundSize) {
         options.top -= 3;
         // 存储已经运动完成数组索引
      } else {
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
export const animationDraw = (): void => {
   // 没有初始话
   if (!(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("animation is not init, use animationInit init");
   }

   // 动态获取图标
   const icon = getArrayRandom(animationConfig.icons);
   // 动态获取图标背景颜色
   const background = getArrayRandom(animationConfig.background);

   // 动画队列添加元素
   animationList.push({
      left: Math.floor(canvasWidth / 2 - 17),
      top: canvasHeight,
      width: 44,
      height: 44,
      icon,
      backgroundSize: 72,
      background,
   });

   if (animationList.length === 1) {
      requestAnimationFrame(render);
   }
};
