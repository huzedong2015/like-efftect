/**
 * 图片预加载
 * @param imgs 图片地址
 */
export function preLoadImgs(imgs: string[] | undefined | string): void {
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
}

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function getRandom(min: number, max: number): number {
   const { floor, random } = Math;
   return min + floor(random() * (max - min));
}

/**
 * 获取数据随机值
 * @param arg 数据
 * @returns
 */
export function getArrayRandom<T>(arg: Array<T>): T {
   const randomIndex = getRandom(0, arg.length);

   return arg[randomIndex];
}
