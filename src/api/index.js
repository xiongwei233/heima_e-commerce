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


