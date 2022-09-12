import {request, METHOD} from '@/utils/request'

export default {
    getBankList,
    getBankById,
    removeBank,
    addBank,
    editBank
}


/**
 * 银行列表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getBankList(current,limit,queryParams){
    return request(
        `/pad/bank/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}

/**
 * 根据银行id获取银行信息
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getBankById(id){
    return request(
        `/pad/bank/${id}`,
        METHOD.GET
    )
}


/**
 * 修改状态
 * @param form
 * @returns {*}
 */
export function removeBank(id){
    return request(
        `/pad/bank/${id}`,
        METHOD.DELETE
    )
}

export function addBank(form){
    return request(
        `/pad/bank/add`,
        METHOD.POST,
        form
    )
}

export function editBank(form){
    return request(
        `/pad/bank/update`,
        METHOD.PUT,
        form
    )
}