<template>
	<view class="content">
    <scroll-view
      :scroll-top="scrollTop"
      scroll-y="true"
      class="scroll-Y"
      @scrolltolower="lower"
    >
      <u-collapse :head-style="headStyle" :accordion="false">
        <u-collapse-item
          v-for="(item, fatherIndex) in orderList"
          :key="fatherIndex"
          :open="true"
          :title="`${item.date} 收：${item.income} 支：${item.pay} 余：${item.surplus}）`"
        >
          <u-swipe-action
            v-for="(data, index) in item.list"
            :key="data.id"
            :show="data.show"
            :index="index"
            @open="() => open(data.id)"
            @click="() => delOrder(fatherIndex, index)"
            :options="options"
          >
            <u-cell-item
              :arrow="false"
              :title="data.levelTwoName"
              :label="`${data.createTime.slice(-8, -3)} ${data.accountName} ${data.memberName}`"
              :value="data.money"
              @click="() => toDetailPage(data.id)"
            />
          </u-swipe-action>
        </u-collapse-item>
      </u-collapse>
    </scroll-view>

    <u-modal v-model="isDelShow" @confirm="delOrderConfirm" :content="content"></u-modal>
	</view>
</template>

<script>
import { sendDateTime } from '@/common/utils'
import { timeInterval } from '@/common/constants'
import { apiOrderList, apiDelOrder } from '@/apis/orders'

export default {
  data() {
    return {
      timeInterval: '',
      pageObj: {
        limit: 5,
        page: 0
      },
      orderList: [],
      headStyle: {
        paddingLeft: '32rpx',
        paddingRight: '32rpx'
      },
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ],
      isDelShow: false,
      content: '确定删除吗？',
      current: [],
      scrollTop: 0,
      canLoadMore: true
    }
  },
  onLoad(option) {
    this.timeInterval = option.timeInterval
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { startTime, endTime } = this._getTimeInterval(this.timeInterval)
      const res = await apiOrderList({
        startTime,
        endTime,
        limit: this.pageObj.limit,
        page: ++this.pageObj.page
      })
      this.orderList = [...this.orderList, ...res]
      this.canLoadMore = res.length >= this.pageObj.limit
    },
    delOrder(fatherIndex, index) {
      this.isDelShow = true
      this.current = [fatherIndex, index]
    },
    delOrderConfirm() {
      const [fatherIndex, childIndex] = this.current
      const item = this.orderList[fatherIndex]
      const tempList = JSON.parse(JSON.stringify(this.orderList))
      apiDelOrder(item.list[childIndex].id).then(() => {
        if (item.list.length === 1) {
          // 如果子列表长度为1，则直接删除父元素
          tempList.splice(fatherIndex, 1)
          this.orderList = tempList
        } else {
          // 如果子列表长度不为1，则删除对应下标元素
          tempList[fatherIndex].list.splice(childIndex, 1)
          this.orderList = tempList
        }
        uni.showToast({
          title: '删除成功！'
        })
      })
    },
    open(id) {
      console.log('id:::', id)
      const tempList = JSON.parse(JSON.stringify(this.orderList))
      tempList.forEach(item => {
        item.list.forEach(res => {
          if (id === res.id) {
            res.show = true
          } else {
            res.show = false
          }
        })
      })
      this.orderList = tempList
    },
    // 跳转详情页面
    toDetailPage(id) {
      wx.navigateTo({ url: `/pages/order/detail?id=${id}` })
    },
    // 加载数据
    lower() {
      if (this.canLoadMore) this.getOrderList()
    },
    /**
     * 获取时间间隔
     * @param {string} type - 时间间隔类型
     */
    _getTimeInterval(type) {
      const endTime = sendDateTime(new Date(), 'yyyy-MM-dd')
      let startTime = null
      const date = new Date()
      switch (type) {
        case timeInterval.DAY:
          startTime = sendDateTime(new Date(), 'yyyy-MM-dd')
          break
        case timeInterval.WEEK: {
          const temp = date.getDay()
          startTime = sendDateTime(new Date(+new Date() - temp * 86400000), 'yyyy-MM-dd')
          break
        }
        case timeInterval.MONTH:
          startTime = sendDateTime(new Date(+new Date() - (date.getDate() - 1) * 86400000), 'yyyy-MM-dd')
          break
        case timeInterval.YEAR:
          startTime = `${date.getFullYear()}-01-01`
          break
        default:
          startTime = sendDateTime(new Date(), 'yyyy-MM-dd')
          break
      }
      return { startTime, endTime }
    }
  }
}
</script>

<style lang="scss" scoped>
// 解决u-swipe-action和u-cell-item组件样式冲突问题
/deep/ .u-collapse-body{
  height: auto!important;
}
.scroll-Y {
  height: 100vh;
}
</style>
