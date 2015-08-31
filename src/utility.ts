export function bindAll(target, methods) {
  forEach<string>(methods, (method) => {
    if (typeof target[method] !== 'function') return;

    let func: Function = target[method];

    target[method] = function () {
      return func.apply(target, arguments);
    };
  });
}

function forEach<T>(arr: T[], callback: Function, ctx?: any) {
  let i   = 0;
  let max = arr.length;

  for (; i < max; i += 1) {
    callback.call(ctx, arr[i], i, arr);
  }
}
