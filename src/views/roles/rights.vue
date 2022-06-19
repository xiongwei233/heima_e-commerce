<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="rightList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {rightsAPI} from '@/api'

export default {
  name: "rights",
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async rightListFn() {
      const {data: res} = await rightsAPI('list')
      if (res.meta.status !== 200) return this.$message.error('请求权限列表数据失败')
      this.rightList = res.data
      console.log(this.rightList)
    }
  },
  created() {
    this.rightListFn()
  }
}
</script>

<style lang="less" scoped>

</style>