import {request, METHOD} from '@/utils/request'


export default {
    getOverdueList,
    refreshOverdueList
}

/**
 * 逾期表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getOverdueList(current,limit,queryParams){
    return request(
        `/pad/overdue/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}


/**
 * 检查逾期
 * @returns {Promise<AxiosResponse<T>>}
 */
export function refreshOverdueList(){
    return request(
        `/pad/overdue/add`,
        METHOD.GET)
}
