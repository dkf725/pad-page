import {request, METHOD} from '@/utils/request'

export default {
    getRoleOptions,
    getRoleList
}

/**
 * 获取角色选择列表
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getRoleOptions(){
    return request('/pad/role/options',METHOD.GET)
}

/**
 * 角色列表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getRoleList(current,limit,queryParams){
    return request(
        `/pad/role/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}
