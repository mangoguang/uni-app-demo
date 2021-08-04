<template>
	<view class="content">
		<u-tabs :list="list" :active-color="activeColor" :is-scroll="false" :current="current" @change="change"></u-tabs>
    <view class="form-box">
      <!-- 支出表单 -->
      <add-form :orderType="0" v-if="current !== 1" />

      <!-- 收入表单 start -->
      <add-form :orderType="1" v-else />
      <!-- 收入表单 end -->

    </view>
	</view>
</template>

<script>
import AddForm from './components/add-form.vue'

export default {
  components: { AddForm },
  data() {
    return {
      // tabs变量
      activeColor: '#19be6b',
      list: [{
        name: '支出'
      }, {
        name: '收入'
      }],
      current: 0
    }
  },
  methods: {
    change(index) {
      if (index) {
        this.activeColor = '#2979ff'
      } else {
        this.activeColor = '#19be6b'
      }
      this.current = index
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  padding: 20rpx 32rpx;
}
</style>
