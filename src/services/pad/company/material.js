import {request, METHOD} from '@/utils/request'

export default {
    getMaterialList,
    changeStatus,
    changeisDeleted
}

/**
 * 查询详细信息
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getMaterialList(cNo){
    return request(
        `/pad/company-material/findMaterialByPK/${cNo}`,
        METHOD.GET
    )
}

/**
 * 修改状态
 * @param row
 * @returns */
export function changeStatus(row){
    return request(
        `/pad/company-material/update`,
        METHOD.PUT,
        row
    )
}


/**
 * 修改逻辑删除
 * @param row
 * @returns */
export function changeisDeleted(cNo){
    return request(
        `/pad/company-material/modify/${cNo}`,
        METHOD.PUT,
    )
}
