<template>
	<view class="content">
		<!-- 支出表单 -->
      <add-form :pageType="'detail'" :formData="formData" :orderType="orderType" />
	</view>
</template>

<script>
import AddForm from './components/add-form.vue'
import { apiOrderDetail } from '@/apis/orders'
import { imgPath } from '@/common/request'

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
      current: 0,
      formData: {},
      orderType: ''
    }
  },
  onLoad(option) {
    this.getFormData(option.id)
  },
  methods: {
    async getFormData(id) {
      const res = await apiOrderDetail(id)
      const imgList = res.imgUrl ? res.imgUrl.split(',').map(res => {
        return { url: `${imgPath}${res}` }
      }) : ''
      const { money, remark } = res
      this.formData = {
        money,
        remark,
        imgList,
        classifyType: res.levelTwoName,
        accountType: res.accountName,
        memberType: res.memberName,
        projectType: res.projectName,
        date: res.createTime,
        id: res.id
      }
      this.orderType = res.orderType
    },
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
