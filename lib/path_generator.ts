const PathGenerator = (() => {
  return function () {
    function monthPath(year: number, month: number, queryParam: string) {
      if(queryParam) {
        return `/${year}/${month}?${queryParam}`
      } else {
        return `/${year}/${month}`
      }
    }

    function monthPathV2(calendar_id: string, year: number, month: number) {
      return `/v2/calendars/${calendar_id}/${year}/${month}`
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

    function loginPath(queryParam: string) {
      if(queryParam) {
        return `/login?${queryParam}`
      } else {
        return `/login`
      }
    }

    return { monthPath, monthPathV2, editPath, rootPath, loginPath }
  }
})();

export { PathGenerator };
