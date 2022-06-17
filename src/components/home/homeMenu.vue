<template>
  <el-aside :width="isShow ? '64px':'200px'">
    <div class="shrink"><i :class=" isShow ? 'el-icon-s-unfold':'el-icon-s-fold'" @click="shrinkFn"></i></div>
    <el-menu
        :collapse="isShow"
        :collapse-transition="false"
        :default-active="$route.path"
        :unique-opened="true"
        active-text-color="#409eff"
        background-color="#002033"
        class="el-menu-vertical-demo"
        router
        text-color="#fff"
    >
      <!--   一级菜单   -->
      <el-submenu v-for="obj in menuList" :key="obj.id" :index="'/'+obj.path">
        <!--   一级菜单模板   -->
        <template slot="title">
          <i :class="iconList[obj.id]" class="icon-style"></i>
          <span slot="title">{{ obj.authName }}</span>
        </template>

        <!--   二级菜单模板   -->
        <el-menu-item v-for="objChi in obj.children" :index="'/'+objChi.path">
          <i :class="iconChildrenList[objChi.id]" class="icon-style"></i>
          <span slot="title">{{ objChi.authName }}</span>
        </el-menu-item>

      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import {HomeAPI} from "@/api"

export default {
  name: "homeMenu",
  data() {
    return {
      menuList: [],
      iconList: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-3702mima",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao",
      },
      iconChildrenList: {
        "110": "el-icon-s-claim",
        "111": "el-icon-s-custom",
        "112": "el-icon-s-check",
        "104": "el-icon-s-shop",
        "115": "el-icon-s-marketing",
        "121": "el-icon-s-cooperation",
        "107": "el-icon-s-release",
        "146": "el-icon-s-order",
      },
      isShow: false,
    }

  },
  methods: {
    // 导航栏请求
    async getMenuList() {
      const {data: res} = await HomeAPI()
      this.menuList = res.data
    },
    // 导航栏收缩按钮
    shrinkFn() {
      this.isShow = !this.isShow
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>

.el-aside {
  height: 100%;

  .shrink {
    height: 30px;
    background-color: #6176b3;
    text-align: center;
    font-size: 20px;
    line-height: 30px;
    color: white;
  }

  .el-menu-vertical-demo {
    background-color: #032a41;
    border: none;

    .icon-style {
      margin-right: 10px;
    }
  }

}


</style>