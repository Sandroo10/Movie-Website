export function paginationPages(current: number, last: number): (number | 'ellipsis')[] {
  const pages = [...new Set([1, last, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= last)
    .sort((a, b) => a - b)
  const result: (number | 'ellipsis')[] = []
  for (let index = 0; index < pages.length; index++) {
    if (index && pages[index] - pages[index - 1] > 1) result.push('ellipsis')
    result.push(pages[index])
  }
  return result
}
