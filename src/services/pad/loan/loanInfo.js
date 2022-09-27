import {request, METHOD} from '@/utils/request'

export default {
    getLoanInfoList,
    getLoanInfoById,
    removeLoanInfo,
    editLoanInfo,
    addLoanInfo,
    modifyStatus
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
 * 按主键查询每个贷款信息
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

/**
 * 修改贷款审核状态
 * @param id
 * @param authStatus
 * @returns {Promise<AxiosResponse<T>>}
 */
export function modifyStatus(id,status,message,type){
    return request(
        `/pad/loan-info/changeStatus`,
        METHOD.GET,
        {id,status,message,type}
    )
}
