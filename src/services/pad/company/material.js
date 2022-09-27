import {request, METHOD} from '@/utils/request'

export default {
    getMaterialList,
    changeStatus,
    changeIsDeleted
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
 * 驳回
 * @param cNo
 * @param id
 * @param status
 * @param message
 * @param type
 * @returns {Promise<AxiosResponse<T>>}
 */
export function changeIsDeleted(cNo,id,status,message,type){
    return request(
        `/pad/company-material/modify`,
        METHOD.PUT,
        {cNo,id,status,message,type}
    )
}
