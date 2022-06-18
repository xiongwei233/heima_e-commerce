// 文件名-尽量和模块页面文件名统一（方便查找)
import request from '@/utils/request'

//1.4.1. 所有权限列表
export const rights = type => {
    return request({
        url: `/rights/${type}`,
        method: "GET",
    })
}

// 1.5.2. 添加角色
export const roles = data => {
    return request({
        url: `/roles`,
        method: "POST",
        data
    })
}

// 1.5.4. 编辑提交角色
export const editRoles = (id, data) => {
    return request({
        url: `/roles/${id}`,
        method: "PUT",
        data
    })
}

// 1.5.5. 删除角色
export const removeRoles = id => {
    return request({
        url: `/roles/${id}`,
        method: "DELETE",
    })
}

//1.5.6. 角色授权
export const permissionsRoles = (id, data) => {
    return request({
        url: `roles/${id}/rights`,
        method: "POST",
        data
    })
}

// 1.5.7. 删除角色指定权限
export const removeTagRoles = (id, rid) => {
    return request({
        url: `roles/${id}/rights/${rid}`,
        method: "DELETE",
    })
}