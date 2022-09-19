import {request, METHOD} from '@/utils/request'

export default {
    getAnalyze,
    getProfitTotal
}

/**
 * 企业用户统计图标
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getAnalyze(){
    return request(
        `/pad/company-info/userData`,
        METHOD.GET
    )
}

/**
 * 平台收益统计图表
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getProfitTotal(){
    return request(
        `/pad/profit/profitData`,
        METHOD.GET
    )
}


/**
 * 贷款用途统计
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getLoanPurpose(){
    return request(
        `/pad/loan-info/loanPurpose`,
        METHOD.GET
    )
}

