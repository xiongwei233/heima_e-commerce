<template>
  <el-container class="container">
    <el-header class="header_style">
      <div class="header_left">
        <img alt="" src="../../assets/logo.png">
        <h1>电商后台管理系统</h1>
      </div>

      <div class="header_right">
        <el-avatar fit="cover" src="https://imgapi.cn/api.php?fl=dongman&gs=images">
          <img alt="" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
        </el-avatar>

        <el-dropdown class="dropdowns">
          <span class="el-dropdown-link">用户名<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>个人中心</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button class="logoOut" type="info" @click="logoOut">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <home-menu></home-menu>
      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script>
import homeMenu from '@/components/home/homeMenu'

export default {
  name: "Home",
  components: {
    homeMenu
  },
  methods: {
    logoOut() {
      window.sessionStorage.removeItem("token")
      this.$router.push("/login")
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;

  .header_style {
    background-color: white;
    box-shadow: 0 0 7px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header_left {
      img {
        width: 40px;
        height: 40px;
        float: left;
        padding-top: 5px;
        padding-right: 15px;
      }

      h1 {
        font-size: 20px;
        float: left;
      }
    }

    .header_right {
      width: 250px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }

  .el-aside {
    background-color: #002033;
  }
}

</style>