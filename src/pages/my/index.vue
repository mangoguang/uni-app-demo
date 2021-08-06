<template>
	<view class="content">
    <u-collapse :head-style="{ padding: 0 }" :body-style="{ backgroundColor: '#fcfcfc' }">
      <u-swipe-action
        v-for="(item, index) in itemList"
        :key="index"
        :show="item.show"
        :index="index"
        @open="() => open(index)"
        @click="() => delPlay(index)"
        :options="options"
      >
        <u-collapse-item :open="item.open" :disabled="item.disabled">
          <u-cell-item
            slot="title" icon="map"
            :title="item.addressName"
            :label="sendDateTime(item.createTime, 'MM月dd日 hh:mm')"
            :value="Math.max(item.eastNum, item.southNum, item.westNum, item.northNum)"
            :arrow="false"
            :border-bottom="false"
            class="cell-item"
          >
          </u-cell-item>
        </u-collapse-item>
      </u-swipe-action>
    </u-collapse>

		<u-icon @click="toAddPlayPage" :custom-style="plusIconStyle" name="plus-circle-fill" color="#2979ff" size="100"></u-icon>
    <u-empty v-if="itemList.length === 0" text="暂无数据，下拉刷新" mode="data"></u-empty>
	</view>
</template>

<script>
import { apiGetMahjongList, apiDelMahjong } from '@/apis/play'
import { sendDateTime } from '@/common/utils'

export default {
  data() {
    return {
      sendDateTime,
      plusIconStyle: {
        position: 'fixed',
        bottom: '50rpx',
        right: '32rpx'
      },
      itemList: [],
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ]
    }
  },
  mounted() {
  },
  onShow() {
    this.getPlays()
  },
  async onPullDownRefresh() {
    this.itemList = await apiGetMahjongList({ limit1: 100, page1: 1 })
    uni.stopPullDownRefresh()
  },
  methods: {
    async getPlays() {
      apiGetMahjongList({ limit1: 100, page1: 1 }).then(res => {
        this.itemList = res
      }).catch(() => {
        uni.showToast({ title: '加载失败!', icon: 'error' })
      })
    },
    toAddPlayPage() {
      uni.navigateTo({
        url: '/pages/play/add'
      })
    },
    open(currentIndex) {
      const tempList = JSON.parse(JSON.stringify(this.itemList))
      tempList.forEach((item, index) => {
        item.show = currentIndex === index
      })
      this.itemList = tempList
    },
    async delPlay(index) {
      await apiDelMahjong(this.itemList[index].id)
      uni.showToast({ title: '删除成功!' })
      this.getPlays()
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
  .cell-item {
    width: 100%;
  }
}
</style>
