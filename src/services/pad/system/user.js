import {request, METHOD} from '@/utils/request'

export default {
    getUserList
}


/**
 * 用户列表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getUserList(current,limit,queryParams){
    return request(
        `/pad/admin/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}
