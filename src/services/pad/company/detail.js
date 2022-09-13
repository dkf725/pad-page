import {request, METHOD} from '@/utils/request'

export default {
    getDetailList,
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
