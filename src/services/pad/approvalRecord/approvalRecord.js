import {request, METHOD} from '@/utils/request'


export default {
    getapprovalRecordList,
}

/**
 * 审查记录分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getapprovalRecordList(current,limit,queryParams){
    return request(
        `/pad/approval-record/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}
