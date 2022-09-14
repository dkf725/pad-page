import {request, METHOD} from '@/utils/request'

export default {
    getLoanInfoList,
    getLoanInfoById,
    removeLoanInfo,
    editLoanInfo,
    addLoanInfo
}

/**
 * 贷款列表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getLoanInfoList(current,limit,queryParams){
    return request(
        `/pad/loan-info/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}

/**
 * 根据企业用户id获取企业用户基本信息
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getLoanInfoById(id){
    return request(
        `/pad/loan-info/findBy/${id}`,
        METHOD.GET
    )
}

export function editLoanInfo(form){
    return request(
        `/pad/loan-info/edit`,
        METHOD.PUT,
        form
    )
}

/**
 * 修改逻辑删除状态
 * @param form
 * @returns {*}
 */
export function removeLoanInfo(id){
    return request(
        `/pad/loan-info/${id}`,
        METHOD.DELETE
    )
}

export function addLoanInfo(form){
    return request(
        `/pad/loan-info/add`,
        METHOD.POST,
        form
    )
}
