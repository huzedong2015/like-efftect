/**
 * 渲染
 */
const render = 

const likeEffect = (elQuery: string) => {
   // 如果参数为空
   if (!elQuery) {
      throw new Error("elQuery is undefined");
   }

   const canvas = document.querySelector(elQuery);

   // 非canvas元素
   if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("elQuery is not HTMLCanvasElement");
   }

   const ctx = canvas.getContext("2d");

   if (!ctx) {
      return;
   }

   render(ctx, {
      left: 0,
      top: 0,
      background: "red",
   });
};

export {
   likeEffect,
};
