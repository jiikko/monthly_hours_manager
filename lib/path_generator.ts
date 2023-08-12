const PathGenerator = (() => {
  return function () {
    function monthPath(year: number, month: number, queryParam: string) {
      if(queryParam) {
        return `/${year}/${month}?${queryParam}`
      } else {
        return `/${year}/${month}`
      }
    }

    function rootPath(queryParam: string) {
      if(queryParam) {
        return `/?${queryParam}`
      } else {
        return `/`
      }
    }

    function editPath(queryParam: string) {
      if(queryParam) {
        return `/edit?${queryParam}`
      } else {
        return `/edit`
      }
    }

    return { monthPath, editPath, rootPath }
  }
})();

export { PathGenerator };
