<template>
	<view class="content">
    <u-form :model="form" ref="playForm">
      <u-form-item label="地点" label-width="120rpx" left-icon="map"><u-input @click="() => select('playAddressType')" v-model="form.sex" type="select" disabled /></u-form-item>
      <view class="form-item-box">
        <u-form-item label="东" label-width="120rpx" left-icon="account-fill"><u-input @click="() => select('mahjongPlayer')" v-model="form.name" :clearable="false" disabled /></u-form-item>
        <u-form-item label="金额" label-width="120rpx" left-icon="rmb-circle-fill"><u-input v-model="form.name" :clearable="false" /></u-form-item>
      </view>
      <u-form-item label="南" label-width="120rpx" left-icon="account-fill"><u-input v-model="form.intro" /></u-form-item>
      <u-form-item label="西" label-width="120rpx" left-icon="rmb-circle-fill"><u-input v-model="form.sex" type="select" /></u-form-item>
      <u-button @click="add" :custom-style="customStyle" type="success">保存</u-button>
    </u-form>

    <u-select v-model="isSelectShow" :default-value="selectValue" :list="selectList" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
import { apiAddMahjong } from '@/apis/play'
import { apiDictList } from '@/apis/common'
import { dictType } from '@/common/constants'
import { _filterDictList } from '@/common/utils'

export default {
  data() {
    return {
      isSelectShow: false,
      selectValue: [0, 0],
      selectList: [],
      currentSelect: '',
      playAddressTypeList: [], // 地点数据字典
      mahjongPlayerList: [] // 牌局玩家数据字典
    }
  },
  mounted() {
    this.getDictList()
  },
  methods: {
    add() {
      apiAddMahjong()
    },
    select(type) {
      this.currentSelect = type
      this.selectList = this[`${type}List`]
      console.log('-----------', this.selectList, this.playAdressTypeList)
      this.isSelectShow = true
    },
    selectConfirm() {

    },
    async getDictList() {
      // 获取地点数据字典
      const playAddressTypeList = await apiDictList(dictType.PLAY_ADDRESS_TYPE)
      console.log('++++++++', playAddressTypeList)
      this.playAddressTypeList = _filterDictList(playAddressTypeList)
      // 牌局玩家数据字典
      const mahjongPlayerList = await apiDictList(dictType.MAHJONG_PLAYER)
      this.mahjongPlayerList = _filterDictList(mahjongPlayerList)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 32rpx;
}
.form-item-box {
  display: flex;
  flex-direction: row;
}
</style>
