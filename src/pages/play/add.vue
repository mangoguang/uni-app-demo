<template>
	<view class="content">
    <u-form :model="form" ref="playForm" :error-type="errorType">
      <u-form-item prop="addressName" label="地点" label-width="120rpx" left-icon="map"><u-input @click="() => select('playAddressType', dictType.PLAY_ADDRESS_TYPE, 'addressName', 'addressCode')" v-model="form.addressName" type="select" disabled /></u-form-item>
      <u-form-item label="时间"><u-input v-model="form.date" @click="selectTime" disabled /></u-form-item>
      <view class="form-item-box">
        <u-form-item prop="eastName" label="东" label-width="120rpx" left-icon="account-fill"><u-input @click="() => select('mahjongPlayer', dictType.MAHJONG_PLAYER, 'eastName', 'eastId')" v-model="form.eastName" :clearable="false" disabled /></u-form-item>
        <u-form-item prop="eastNum" label="金额" label-width="120rpx" left-icon="rmb-circle-fill"><u-input v-model="form.eastNum" :clearable="false" /></u-form-item>
      </view>
      <view class="form-item-box">
        <u-form-item prop="southName" label="南" label-width="120rpx" left-icon="account-fill"><u-input @click="() => select('mahjongPlayer', dictType.MAHJONG_PLAYER, 'southName', 'southId')" v-model="form.southName" :clearable="false" disabled /></u-form-item>
        <u-form-item prop="southNum" label="金额" label-width="120rpx" left-icon="rmb-circle-fill"><u-input v-model="form.southNum" :clearable="false" /></u-form-item>
      </view>
      <view class="form-item-box">
        <u-form-item prop="westName" label="西" label-width="120rpx" left-icon="account-fill"><u-input @click="() => select('mahjongPlayer', dictType.MAHJONG_PLAYER, 'westName', 'westId')" v-model="form.westName" :clearable="false" disabled /></u-form-item>
        <u-form-item prop="westNum" label="金额" label-width="120rpx" left-icon="rmb-circle-fill"><u-input v-model="form.westNum" :clearable="false" /></u-form-item>
      </view>
      <view class="form-item-box">
        <u-form-item prop="northName" label="北" label-width="120rpx" left-icon="account-fill"><u-input @click="() => select('mahjongPlayer', dictType.MAHJONG_PLAYER, 'northName', 'northId')" v-model="form.northName" :clearable="false" disabled /></u-form-item>
        <u-form-item prop="northNum" label="金额" label-width="120rpx" left-icon="rmb-circle-fill"><u-input v-model="form.northNum" :clearable="false" /></u-form-item>
      </view>
      <u-button @click="add" :custom-style="{ marginTop: '100rpx' }" type="success">保存</u-button>
    </u-form>

    <u-select v-model="isSelectShow" :default-value="selectValue" mode="mutil-column-auto" :list="selectList" @confirm="selectConfirm"></u-select>
    <u-picker mode="time" @confirm="timeConfirm" v-model="isTimeShow" :params="params"></u-picker>
    <view @click="addDict" v-if="isSelectShow" class="add-btn-box"><text>新增</text></view>
	</view>
</template>

<script>
import { apiAddMahjong } from '@/apis/play'
import { apiDictList } from '@/apis/common'
import { dictType } from '@/common/constants'
import { sendDateTime, _filterDictList } from '@/common/utils'

export default {
  data() {
    return {
      dictType,
      form: {
        date: sendDateTime(new Date(), 'yyyy/MM/dd hh:mm:ss'),
        addressName: '',
        eastName: '',
        eastNum: '',
        southName: '',
        southNum: '',
        westName: '',
        westNum: '',
        northName: '',
        northNum: ''
      },
      isSelectShow: false,
      selectValue: [0, 0],
      selectList: [],
      currentSelect: '',
      currentDictType: '',
      playAddressTypeList: [], // 地点数据字典
      mahjongPlayerList: [], // 牌局玩家数据字典
      isTimeShow: false,
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true
      },
      errorType: ['toast'],
      rules: {
        addressName: [{ required: true, message: '请选择牌局地点' }],
        eastName: [{ required: true, message: '请选择玩家（东）' }],
        eastNum: [{ required: true, message: '请输入金额（东）' }],
        southName: [{ required: true, message: '请选择玩家（南）' }],
        southNum: [{ required: true, message: '请输入金额（南）' }],
        westName: [{ required: true, message: '请选择玩家（西）' }],
        westNum: [{ required: true, message: '请输入金额（西）' }],
        northName: [{ required: true, message: '请选择玩家（北）' }],
        northNum: [{ required: true, message: '请输入金额（北）' }]
      }
    }
  },
  onShow() {
    this.getDictList()
  },
  onReady() {
    this.$refs.playForm.setRules(this.rules)
  },
  methods: {
    add() {
      this.$refs.playForm.validate(valid => {
        console.log('123123132', valid)
        if (valid) {
          apiAddMahjong(this.form).then(() => {
            uni.showToast({
              title: '新增成功!',
              success: () => setTimeout(() => {
                uni.navigateBack()
              }, 600)
            })
          })
        }
      })
    },
    select(type, dictType, name, code) {
      this.currentSelect = { name, code }
      this.selectList = this[`${type}List`]
      this.currentDictType = dictType
      this.isSelectShow = true
    },
    selectConfirm(e) {
      this.form[this.currentSelect.name] = e[1].label
      this.form[this.currentSelect.code] = e[1].value
    },
    selectTime() {
      this.isTimeShow = true
    },
    timeConfirm(e) {
      this.form.date = `${e.year}/${e.month}/${e.day} ${e.hour}:${e.minute}:${e.second}`
    },
    async getDictList() {
      // 获取地点数据字典
      const playAddressTypeList = await apiDictList(dictType.PLAY_ADDRESS_TYPE)
      this.playAddressTypeList = _filterDictList(playAddressTypeList)
      // 牌局玩家数据字典
      const mahjongPlayerList = await apiDictList(dictType.MAHJONG_PLAYER)
      this.mahjongPlayerList = _filterDictList(mahjongPlayerList)
    },
    addDict() {
      this.isSelectShow = false
      uni.navigateTo({
        url: `/pages/dictionary/list?type=${this.currentSelect}&dictType=${this.currentDictType}`
      })
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
.add-btn-box {
  display: flex;
  justify-content: center;
  width: 50vw;
  position: fixed;
  bottom: 20rpx;
  right: 0rpx;
  z-index: 10099;
  text {
    font-size: 32rpx;
    width: 100%;
    line-height: 68rpx;
    text-align: center;
    color: $uni-color-primary;
  }
}
</style>
