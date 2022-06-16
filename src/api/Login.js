// 文件名-尽量和模块页面文件名统一（方便查找)
import request from '@/utils/request'

export const login = data => {
    return request({
        url: "/login",
        method: "POST",
        data
    })
}