import request from '@/utils/request'

// 1.5.5. 删除角色
export const addAttributes = (id, data) => {
    return request({
        url: `categories/${id}/attributes`,
        method: "POST",
        data
    })
}

// 1.7.5. 编辑提交参数
export const editAttributes = (id, cateId, data) => {
    return request({
        url: `categories/${id}/attributes/${cateId}`,
        method: "PUT",
        data
    })
}

// 1.7.3. 删除参数
export const deleteAttributes = (id, cateId) => {
    return request({
        url: `categories/${id}/attributes/${cateId}`,
        method: "DELETE",
    })
}
