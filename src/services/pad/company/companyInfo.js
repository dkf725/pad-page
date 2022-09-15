import {request, METHOD} from '@/utils/request'


export default {
    getCompanyInfoList,
    getCompanyInfoById,
    editCompanyInfo,
    removeCompanyInfo,
    addCompanyInfo
}

/**
 * 企业用户列表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getCompanyInfoList(current,limit,queryParams){
    return request(
        `/pad/company-info/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}

/**
 * 根据企业用户id获取企业用户基本信息
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getCompanyInfoById(id){
    return request(
        `/pad/company-info/findBy/${id}`,
        METHOD.GET
    )
}

export function editCompanyInfo(form){
    return request(
        `/pad/company-info/edit`,
        METHOD.PUT,
        form
    )
}

/**
 * 修改逻辑删除状态
 * @param form
 * @returns {*}
 */
export function removeCompanyInfo(cNo){
    return request(
        `/pad/company-info/${cNo}`,
        METHOD.DELETE
    )
}

export function addCompanyInfo(form){
    return request(
        `/pad/company-info/add`,
        METHOD.POST,
        form
    )
}
