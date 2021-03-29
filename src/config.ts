export interface AnimationConfig {
   /** 图标 */
   icons: string[];
   /** 图标大小 */
   iconSize: number;
   /** 背景  */
   backgrounds: string[];
   /** 背景大小 */
   backgroundSize: number;
   /** 速度 */
   speed: number;
}

/** 配置 */
export const defaultConfig: AnimationConfig = {
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
export function animationConfigMerge(
   target: AnimationConfig,
   source: Partial<AnimationConfig>,
): void {
   const getSourceType = <K>(val: K) => Object.prototype.toString.call(val);

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
