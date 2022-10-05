import {request, METHOD} from '@/utils/request'


export default {
    getCreditList,
    addCredit,
    creditQuery
}

/**
 * 放款表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getCreditList(current,limit,queryParams){
    return request(
        `/pad/credit/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}

/**
 * 添加放款信息
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function addCredit(queryParams){
    return request(
        `/pad/credit/add`,
        METHOD.POST,
        queryParams)
}

/**
 * 查询是否放款 根据贷款编号查询 返回对应放款信息数量
 * @param id
 * @returns {Promise<AxiosResponse<T>>}
 */
export function creditQuery(id){
    return request(
        `/pad/credit/query/${id}`,
        METHOD.GET)
}
