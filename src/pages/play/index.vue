<template>
	<view class="content">
    <u-collapse>
      <u-collapse-item v-for="(item, index) in itemList" :key="index" :open="item.open" :disabled="item.disabled">
        <u-cell-item
          slot="title" icon="map"
          :title="item.addressName"
          :label="sendDateTime(item.createTime, 'MM月dd日 hh:mm')"
          :value="123"
          :arrow="false"
          :border-bottom="false"
          class="cell-item"
        >
          <u-icon slot="right-icon" name="rmb"></u-icon>
        </u-cell-item>
        <player-item />
      </u-collapse-item>
    </u-collapse>

		<u-icon @click="toAddPlayPage" :custom-style="plusIconStyle" name="plus-circle-fill" color="#2979ff" size="100"></u-icon>
	</view>
</template>

<script>
import { apiGetMahjongList } from '@/apis/play'
import { playerItem } from './components/player-item'
import { sendDateTime } from '@/common/utils'

export default {
  components: { playerItem },
  data() {
    return {
      sendDateTime,
      plusIconStyle: {
        position: 'fixed',
        bottom: '80rpx',
        right: '32rpx'
      },
      itemList: []
    }
  },
  mounted() {
  },
  onLoad() {
    this.getPlays()
  },
  methods: {
    async getPlays() {
      const res = await apiGetMahjongList({ limit1: 100, page1: 1 })
      this.itemList = res
    },
    toAddPlayPage() {
      uni.navigateTo({
        url: '/pages/play/add'
      })
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
