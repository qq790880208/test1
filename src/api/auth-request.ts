import { AxiosPromise } from 'axios';
import http from "@/utils/axios"
import { formData } from '@/utils/main';


export const login = function (data: requestData): AxiosPromise<responseData> {
  return http({
    url: '/frame/loginController/login',
    method: 'post',
    data: formData(data,'1')
  })
}
