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
export const animationConfigMerge = (target:AnimationConfig, source: AnimationConfig): void => {
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
