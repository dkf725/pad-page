import {request, METHOD} from '@/utils/request'

export default {
    getDetailList,
    modifyStatus
}

/**
 * 查询详细信息
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getDetailList(cNo){
    return request(
        `/pad/company-detail/findDetailByPK/${cNo}`,
        METHOD.GET
    )
}

/**
 * 修改用户认证状态
 * @param cNo
 * @param authStatus
 * @returns {Promise<AxiosResponse<T>>}
 */
export function modifyStatus(cNo,authStatus){
    return request(
        `/pad/company-info/modify/${cNo}/${authStatus}`,
        METHOD.PUT
    )
}


/**
 * 修改用户认证状态
 * @param cNo
 * @param authStatus
 * @returns {Promise<AxiosResponse<T>>}
 */
export function changeStatus(cNo){
    return request(
        `/pad/company-info/update/${cNo}`,
        METHOD.PUT
    )
}
