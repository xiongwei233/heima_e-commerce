<template>
  <div>
    <el-button type="info" @click="logoOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logoOut() {
      window.sessionStorage.removeItem("token")
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>

</style>