import { defaultConfig, animationConfigMerge } from "./config";
import type { AnimationConfig } from "./config";
import { preLoadImgs, getArrayRandom } from "./ulits";

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
export function animationInit(
   elQuery: string,
   config: Partial<AnimationConfig>,
): void {
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
}

/**
 * 动画执行完毕
 */
const animationEndListener: Function[] = [];
export function onAnimateEnd(fn: Function): void {
   if (typeof fn === "function") {
      animationEndListener.push(fn);
   }
}

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
         left,
         top,
         width,
         height,
         background,
         icon,
         backgroundSize,
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
         fillStyle = ctx.createLinearGradient(
            -bgRdius,
            -bgRdius,
            0,
            backgroundSize,
         );
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
      animationList = animationList.filter(
         (val, index) => !animationEndSet.has(index),
      );
   }

   // 是否继续执行动画
   if (animationList.length > 0) {
      requestAnimationFrame(render);
   }
};

/**
 * 添加一个动画
 */
export function animationDraw(): void {
   // 没有初始话
   if (!(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("animation is not init, use animationInit init");
   }

   const { iconSize, icons, backgrounds, backgroundSize } = animationConfig;

   // 动态获取图标
   const icon = getArrayRandom(icons);
   // 动态获取图标背景颜色
   const background = getArrayRandom(backgrounds);

   /**
    * 获取放大尺寸
    */
   //  function getScan(scale: number, top: number, height: number): number {
   //    const step = height / 10;
   //    const current = height - top;
   //    const result = 1;

   //    if (current >= step) {
   //       return result;
   //    }

   //    if (current < step / 2) {
   //       return 0.4;
   //    }
   //    return step;
   // }

   // 动画队列添加元素
   animationList.push({
      left: Math.floor(canvasWidth / 2 - 17),
      top: canvasHeight,
      width: iconSize,
      height: iconSize,
      icon,
      backgroundSize,
      background,
   });

   if (animationList.length === 1) {
      requestAnimationFrame(render);
   }
}
