// 文件名-尽量和模块页面文件名统一（方便查找)
import request from '@/utils/request'

export const categories = params => {
    return request({
        url: "/categories",
        method: "get",
        params
    })
}
// 1.6.2. 添加分类
export const addCategories = data => {
    return request({
        url: "/categories",
        method: "post",
        data
    })
}

//1.6.3. 根据 id 查询分类
export const categoriesId = id => {
    return request({
        url: `/categories/${id}`,
        method: "GET",
    })
}


//1.6.4. 编辑提交分类
export const editCategories = (id, data) => {
    return request({
        url: `/categories/${id}`,
        method: "PUT",
        data
    })
}

// 1.6.5. 删除分类
export const deleteCategories = id => {
    return request({
        url: `/categories/${id}`,
        method: "DELETE",
    })
}
