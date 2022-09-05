import {request, METHOD} from '@/utils/request'

export default {
    getUserList,
    addUser,
    changeStatus,
    editUser
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

/**
 * 添加后台用户
 * @param form
 * @returns {Promise<AxiosResponse<T>>}
 */
export function addUser(form){
    return request(
        `/pad/admin/add`,
        METHOD.POST,
        form
    )
}

/**
 * 修改状态
 * @param row
 * @returns {Promise<AxiosResponse<T>>}
 */
export function changeStatus(row){
    return request(
        `/pad/admin/changeStatus`,
        METHOD.PUT,
        row
    )
}

/**
 * 修改用户信息
 * @param from
 * @returns {Promise<AxiosResponse<T>>}
 */
export function editUser(from){
    return request(
        `/pad/admin/edit`,
        METHOD.PUT,
        from
    )
}
