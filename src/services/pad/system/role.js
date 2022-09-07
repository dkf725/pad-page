import {request, METHOD} from '@/utils/request'

export default {
    getRoleOptions,
    getRoleList,
    changeStatus,
    getRole,
    delRole
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

/**
 * 修改状态
 * @param row
 * @returns {Promise<AxiosResponse<T>>}
 */
export function changeStatus(row){
    return request(
        `/pad/role/changeStatus`,
        METHOD.PUT,
        row
    )
}

/**
 * 根据角色id获取角色信息
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getRole(id){
    return request(
        `/pad/role/${id}`,
        METHOD.GET
    )
}

/**
 * 根据角色id逻辑删除角色
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function delRole(id){
    return request(
        `/pad/role/${id}`,
        METHOD.DELETE
    )
}
