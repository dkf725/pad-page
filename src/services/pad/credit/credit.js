import {request, METHOD} from '@/utils/request'


export default {
    getCreditList,
    addCredit
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

export function addCredit(queryParams){
    return request(
        `/pad/credit/add`,
        METHOD.POST,
        queryParams)
}
