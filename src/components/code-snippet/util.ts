export function getFileSpans(text: string) {
  // console.info(text)
  return text
    .split('/')
    .reduce((acc, val, i) => {
      if (i === 0) acc.push(val)
      else acc.push('/', val)
      return acc
    }, [] as string[])
}