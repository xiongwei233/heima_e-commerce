import request from '@/utils/request'
// 1.8.1. 商品列表数据
export const goodsList = params => {
    return request({
        url: "/goods",
        method: "GET",
        params
    })
}

// 1.8.3. 根据 ID 查询商品
export const goodsListId = id => {
    return request({
        url: `/goods/${id}`,
        method: "GET",
    })
}

// 1.8.4. 编辑提交商品 接口有问题
export const goodsListIdPut = (id, data) => {
    return request({
        url: `/goods/${id}`,
        method: "PUT",
        data
    })
}

// 1.8.5. 删除商品

export const goodsListIdDelete = id => {
    return request({
        url: `/goods/${id}`,
        method: "DELETE",
    })
}
