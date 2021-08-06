<template>
	<view class="content">
		<view>
      <!-- 头像 -->
      <view class="head-box">
        <view class="head-img">
          <u-avatar
            :src="userInfo.avatarUrl"
            mode="circle"
            show-sex="true"
            sex-icon="man"
            sex-bg-color="man-primary"
            size="large"
          ></u-avatar>
          <text>guang</text>
        </view>
        <view class="pay-info">
          <text class="first">7月●支出：{{ payInfo.monthPay }}</text>
          <view>
            <text>本月可用：{{ payInfo.monthBalance }}</text>
            <u-icon @click="editMonthQuota" color="#19be6b" name="edit-pen"></u-icon>
          </view>
          <text>本月收入：{{ payInfo.monthIncome }}</text>
        </view>
      </view>

      <u-cell-group class="order-sum">
        <u-cell-item
          v-for="(item, index) in list"
          :key="index" :arrow="true"
          :value="`支/收：${item.pay}/${item.income}`"
          arrow-direction="right"
          @click="() => toListPage(item.timeInterval)"
        >
          <view class="title" slot="title">
            <text>{{item.title}}</text>
            <text>{{item.date}}</text>
          </view>
        </u-cell-item>
      </u-cell-group>
		</view>

    <u-modal
      v-model="isEditShow"
      :show-cancel-button="true"
      title="额度设置"
      @confirm="setMonthQuota"
    >
			<view class="slot-content">
				<u-field v-model="monthQuota" label="金额" placeholder="请输入每月可用额度"></u-field>
			</view>
		</u-modal>

		<u-icon @click="toAddPage" :custom-style="plusIconStyle" name="plus-circle-fill" color="#2979ff" size="100"></u-icon>
	</view>
</template>

<script>
// import { apiLogin } from '@/apis/common'
// import MD5 from 'crypto-js/md5'
import { uuid, sendDateTime } from '@/common/utils'
import { localStorageKeys, weappInfo, timeInterval } from '@/common/constants'
import { apiPayInfo, apiGetUserInfoByCode, apiSetMonthQuota } from '@/apis/users'
const date = new Date()
const day = date.getDay()

export default {
  data() {
    return {
      timeInterval,
      userInfo: {
        monthPay: 0,
        monthIncome: 0,
        monthBalance: 0
      },
      monthQuota: 0,
      list: [{
        title: '今天',
        date: sendDateTime(date, 'MM月dd日'),
        pay: '',
        income: '',
        timeInterval: timeInterval.DAY
      }, {
        title: '本周',
        date: `${sendDateTime(new Date(+new Date() - (day * 24 * 60 * 60 * 1000)), 'MM月dd日')}-${sendDateTime(new Date(+new Date() + ((7 - day) * 24 * 60 * 60 * 1000)), 'MM月dd日')}`,
        pay: '',
        income: '',
        timeInterval: timeInterval.WEEK
      }, {
        title: '本月',
        date: sendDateTime(date, 'yyyy年MM月'),
        pay: '',
        income: '',
        timeInterval: timeInterval.MONTH
      }, {
        title: '今年',
        date: sendDateTime(date, 'yyyy'),
        pay: '',
        income: '',
        timeInterval: timeInterval.YEAR
      }],
      isEditShow: false,
      payInfo: {},
      plusIconStyle: {
        position: 'fixed',
        bottom: '50rpx',
        right: '32rpx'
      }
    }
  },
  mounted() {
    this.login()
  },
  onShow() {
    this.getPayInfo()
  },
  methods: {
    async login() {
      // const loginData = await apiLogin('guang', { password: MD5('427815').toString(), uuid: '123456' })
      // uni.setStorageSync(localStorageKeys.TOKEN, `Bearer ${loginData.token}`)
      // this.getPayInfo()

      const _this = this
      const promise = new Promise((resolve, reject) => {
        wx.login({
          async success(res) {
            console.log('登陆成功：：：', apiGetUserInfoByCode)
            apiGetUserInfoByCode({ weappName: weappInfo.MANGOGUANG, jsCode: res.code, uuid: uuid() }).then(userInfo => {
              uni.setStorageSync(localStorageKeys.TOKEN, `Bearer ${userInfo.token}`)
              resolve({ res, userInfo })
            }).catch(() => {
              resolve({})
            })
          },
          fail() {
            console.log('登陆失败：：：')
            _this.isLoadingShow = false
            // Notify({ type: 'success', message: '登陆成功！' })
          }
        })
      })
      promise.then(res => {
        this.userInfo = res.userInfo
        this.getPayInfo()
      }).catch(() => { this.isLoadingShow = false })
    },
    // 获取用户收支情况
    async getPayInfo() {
      const res = await apiPayInfo()
      const list = this.list
      const payInfo = this.payInfo
      payInfo.monthPay = Number(res.monthPay.toFixed(2))
      payInfo.monthIncome = Number(res.monthIncome.toFixed(2))
      payInfo.monthBalance = Number((res.monthQuota - res.monthPay).toFixed(2))
      this.monthQuota = res.monthQuota
      list[0].pay = res.dayPay
      list[0].income = res.dayIncome
      list[1].pay = res.weekPay
      list[1].income = res.weekIncome
      list[2].pay = res.monthPay
      list[2].income = res.monthIncome
      list[3].pay = res.yearPay
      list[3].income = res.yearIncome
      list.forEach(element => {
        element.pay = Number(element.pay.toFixed(2))
        element.income = Number(element.income.toFixed(2))
      })
    },
    // 修改用户月度可用额度
    editMonthQuota() {
      this.isEditShow = true
      console.log('修改用户月度可用额度')
    },
    async setMonthQuota() {
      await apiSetMonthQuota({ monthQuota: this.monthQuota })
      uni.showToast({
        title: '设置成功!',
        success: () => this.getPayInfo()
      })
    },
    // 跳转收支记录页面
    toListPage(timeInterval) {
      wx.navigateTo({ url: `/pages/order/list?timeInterval=${timeInterval}` })
    },
    toAddPage() {
      uni.navigateTo({
        url: '/pages/order/add'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	.head-box {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    justify-content: flex-end;
    height: 450rpx;
    background: url("/static/images/home/bg_b.png") no-repeat left top;
    background-size: 100%;
    .head-img {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 32rpx;
      text {
        margin-left: 20rpx;
        font-size: 52rpx;
        color: $uni-text-color-main;
      }
    }
    .pay-info {
      display: flex;
      flex-direction: column;
      padding: 26rpx 32rpx;
      background: linear-gradient(180deg, #FFF3F2 0%, #FFFFFF 100%);
      font-size: $uni-font-size-lg;
      color: $uni-text-color;
      text.first {
        font-size: 42rpx;
        color: $uni-color-success;
      }
      text {
        line-height: 1.8em;
        margin-right: 10rpx;
      }
    }
	}
  .order-sum {
    .title {
      display: flex;
      flex-direction: column;
      text {
        line-height: 1.5em;
      }
      text:first-child {
        font-size: $uni-font-size-lg;
        color: $uni-text-color;
      }
      text:last-child {
        font-size: $uni-font-size-sm;
        color: $uni-text-color-grey;
      }
    }
  }
</style>
