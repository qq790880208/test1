export const formData = function (data: requestData, code: string = '3'): FormData {
  switch (code) {
    case '0':
      break;
    case '1':
      data.companyId = localStorage.getItem('companyId') || '';
      break;
    case '2':
      data.userId = localStorage.getItem('userId') || '';
      break;
    default:
      data.companyId = localStorage.getItem('companyId') || '';
      data.userId = localStorage.getItem('userId') || '';
  }
  const formDate = new FormData();
  for (const key in data) {
    formDate.set(key, data[key]);
  }
  return formDate;
};

export const mockPromise = function (): Promise<responseData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: "",
        message: "",
        success: true,
        result: [],
        token: ""
      })
    }, 2000)
  })
}
