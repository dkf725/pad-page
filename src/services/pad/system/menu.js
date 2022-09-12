import {request, METHOD} from '@/utils/request'

export default {
    getMenuList,
    addMenu,
    delMenu,
    getMenu,
    editMenu
}

/**
 * 获取菜单列表
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getMenuList(queryParams){
    return request(
        '/pad/permission/list',
        METHOD.POST,
        queryParams
    )
}


/**
 * 添加菜单
 * @param form
 * @returns {Promise<AxiosResponse<T>>}
 */
export function addMenu(form){
    return request(
        '/pad/permission/add',
        METHOD.POST,
        form
    )
}

/**
 * 根据id删除菜单
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function delMenu(id){
    return request(
        `/pad/permission/${id}`,
        METHOD.DELETE
    )
}

/**
 * 根据id获取菜单
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getMenu(id){
    return request(
        `/pad/permission/${id}`,
        METHOD.GET
    )
}

/**
 * 修改菜单信息
 * @param from
 * @returns {Promise<AxiosResponse<T>>}
 */
export function editMenu(from){
    return request(
        `/pad/permission/edit`,
        METHOD.POST,
        from
    )
}
