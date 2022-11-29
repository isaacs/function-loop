const loop = (
  arr: ((...a: any) => any)[],
  cb: () => any,
  onerr: (er: any) => any
) => loop_(arr, cb, onerr, 0)

export default loop

const loop_ = <T extends () => any>(
  arr: ((...a: any[]) => any)[],
  cb: T,
  onerr: (er: any) => any,
  i: number
): ReturnType<T> | Promise<ReturnType<T>> => {
  while (i < arr.length) {
    const fn = arr[i]
    let ret = null
    try {
      ret = fn()
    } catch (er) {
      return onerr(er)
    }
    i++
    if (ret && typeof ret.then === 'function') {
      return ret.then(() => loop_(arr, cb, onerr, i), onerr)
    }
  }

  return cb()
}
