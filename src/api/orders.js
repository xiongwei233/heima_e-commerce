// 1.7.1. 参数列表
import request from '@/utils/request'

export const getOrdersList = (params) => {
    return request({
        url: `orders`,
        method: "GET",
        params
    })
}
// 1.10.3. 查看订单详情
export const showOrdersList = (id) => {
    return request({
        url: `orders/${id}`,
        method: "GET",
    })
}


// 1.10.2. 修改订单状态
export const editOrdersList = (id, data) => {
    return request({
        url: `orders/${id}`,
        method: "PUT",
        data
    })
}