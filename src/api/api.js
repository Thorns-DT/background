import request from '@/utils/request'
const baseUrl = 'http://localhost:8081';
export function findPage(params) {
    return request({
        url: baseUrl + `/user/page`,
        method: 'get',
        params
    })
}