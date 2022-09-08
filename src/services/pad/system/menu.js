import {request, METHOD} from '@/utils/request'

export default {
    getMenuList,
    addMenu
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
