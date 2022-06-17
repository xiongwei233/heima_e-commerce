// 文件名-尽量和模块页面文件名统一（方便查找)
import request from '@/utils/request'

export const users = params => {
    return request({
        url: "/users",
        method: "GET",
        params
    })
}

export const usersModify = (uId, type) => {
    return request({
        url: `/users/${uId}/state/${type}`,
        method: "PUT",
    })
}

export const usersAdd = data => {
    return request({
        url: "/users",
        method: "POST",
        data
    })
}

//1.3.5. 编辑用户提交
export const usersEdit = id => {
    return request({
        url: `/users/${id}`,
        method: "GET",
    })
}

// 1.3.5. 编辑用户提交
export const usersSubmit = (id, data) => {
    return request({
        url: `/users/${id}`,
        method: "PUT",
        data
    })
}

// 1.3.6. 删除单个用户
export const usersDelete = id => {
    return request({
        url: `/users/${id}`,
        method: "DELETE",
    })
}

// 1.3.7. 分配用户角色
export const editPermissions = (id, data) => {
    return request({
        url: `users/${id}/role`,
        method: "PUT",
        data
    })
}

// 1.5.1. 角色列表
export const showPermissions = () => {
    return request({
        url: `/roles`,
        method: "GET",
    })
}