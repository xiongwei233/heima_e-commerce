import {login} from '@/api/Login'
import {home} from '@/api/Home'
import {
    editPermissions,
    showPermissions,
    users,
    usersAdd,
    usersDelete,
    usersEdit,
    usersModify,
    usersSubmit
} from "@/api/Users"
import {editRoles, permissionsRoles, removeRoles, removeTagRoles, rights, roles} from '@/api/Roles'
import {
    addProducts,
    categoriesAttrList,
    goodsList,
    goodsListId,
    goodsListIdDelete,
    goodsListIdPut
} from '@/api/Products'
import {addCategories, categories, categoriesId, deleteCategories, editCategories} from '@/api/categories'
import {addAttributes, deleteAttributes, editAttributes} from '@/api/params'
import {editOrdersList, getOrdersList, showOrdersList} from '@/api/orders'

/*
 * Login 请求
 */
export const LoginAPI = login

/*
 * Home 请求
 */
export const HomeAPI = home


/*
* Users 请求
*/
export const UsersAPI = users
export const usersModifyAPI = usersModify
export const usersAddAPI = usersAdd
export const usersEditAPI = usersEdit
export const usersSubmitAPI = usersSubmit
export const usersDeleteAPI = usersDelete
export const editPermissionsAPI = editPermissions
export const showPermissionsAPI = showPermissions

/*
* Rights 请求
*/
export const rightsAPI = rights
export const rolesAPI = roles
export const editRolesAPI = editRoles
export const removeRolesAPI = removeRoles
export const permissionsRolesAPI = permissionsRoles
export const removeTagRolesAPI = removeTagRoles

/*
* Products 请求
*/
export const goodsListAPI = goodsList
export const goodsListIdAPI = goodsListId
export const goodsListIdPutAPI = goodsListIdPut
export const goodsListIdDeleteAPI = goodsListIdDelete
export const categoriesAttrListAPI = categoriesAttrList
export const addProductsAPI = addProducts

/*
* Categories 请求
*/
export const categoriesAPI = categories
export const editCategoriesAPI = editCategories
export const deleteCategoriesAPI = deleteCategories
export const categoriesIdAPI = categoriesId
export const addCategoriesAPI = addCategories


/*
* Params 请求
*/
export const addAttributesAPI = addAttributes
export const editAttributesAPI = editAttributes
export const deleteAttributesAPI = deleteAttributes


/*
* Orders 请求
*/
export const getOrdersListAPI = getOrdersList
export const editOrdersListAPI = editOrdersList
export const showOrdersListAPI = showOrdersList

