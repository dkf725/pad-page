import {request, METHOD} from '@/utils/request'

export default {
    getMessageList,
    removeMessage,
    addMessage
}

/**
 * 留言列表分页显示
 * @param current
 * @param limit
 * @param queryParams
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getMessageList(current,limit,queryParams){
    return request(
        `/pad/message/list/${current}/${limit}`,
        METHOD.POST,
        queryParams)
}

export function addMessage(form){
    return request(
        `/pad/message/add`,
        METHOD.POST,
        form
    )
}

export function removeMessage(id){
    return request(
        `/pad/message/${id}`,
        METHOD.DELETE
    )
}