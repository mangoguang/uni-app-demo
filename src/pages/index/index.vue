<template>
	<view class="content">
		<u-action-sheet :list="list" v-model="show"></u-action-sheet>
		<view>
			<text class="title">{{title}}</text>
			<u-button @click="getPlays" type="primary">get plays</u-button>
			<u-button @click="smsVerify" type="primary">短信验证</u-button>

			<u-tabbar v-model="current" :list="tabbarList" :mid-button="true"></u-tabbar>
		</view>
	</view>
</template>

<script>
import { apiLogin } from '@/apis/common'
import MD5 from 'crypto-js/md5'
import { localStorageKeys } from '@/common/constants'
import { apiGetMahjongList } from '@/apis/play'

export default {
  data() {
    return {
      title: 'Hello',
      list: [{
        text: '点赞',
        color: 'blue',
        fontSize: 28
      }, {
        text: '分享1'
      }, {
        text: '评论'
      }],
      show: false,
      tabbarList: [{
        iconPath: 'home',
        selectedIconPath: 'home-fill',
        text: '首页',
        count: 2,
        isDot: true,
        customIcon: false
      },
      {
        iconPath: 'photo',
        selectedIconPath: 'photo-fill',
        text: '放映厅',
        customIcon: false
      },
      {
        iconPath: 'https://cdn.uviewui.com/uview/common/min_button.png',
        selectedIconPath: 'https://cdn.uviewui.com/uview/common/min_button_select.png',
        text: '发布',
        midButton: true,
        customIcon: false
      },
      {
        iconPath: 'play-right',
        selectedIconPath: 'play-right-fill',
        text: '直播',
        customIcon: false
      },
      {
        iconPath: 'account',
        selectedIconPath: 'account-fill',
        text: '我的',
        count: 23,
        isDot: false,
        customIcon: false
      }
      ],
      current: 0,
      count: 0,
      start: 0
    }
  },
  mounted() {
    this.login()
  },
  onLoad() {

  },
  methods: {
    showSelect() {
      this.show = true
    },
    async login() {
      const loginData = await apiLogin('guang', { password: MD5('427815').toString(), uuid: '123456' })
      uni.setStorageSync(localStorageKeys.TOKEN, `Bearer ${loginData.token}`)
    },
    async getPlays() {
      const res = await apiGetMahjongList({ limit1: 100, page1: 1 })
      console.log('牌局：', res)
    },
    async smsVerify() {
      // const uniID = require('uni-id')
      // exports.main = async function(event, context) {
      //   const {
      //     mobile
      //   } = event
      //   // 生成验证码可以按自己的需求来，这里以生成6位数字为例
      //   const randomStr = '00000' + Math.floor(Math.random() * 1000000)
      //   const code = randomStr.substring(randomStr.length - 6)
      //   const res = await uniID.sendSmsCode({
      //     mobile,
      //     code,
      //     type: 'login'
      //   })
      //   return res
      // }

      // const res = await uniCloud.sendSms({
      //   appid: '__UNI__6D1BF02',
      //   smsKey: '1d0ee99dfc0e9db5368c4c29f11ea7d0',
      //   smsSecret: '8b95ce43f72212c916cff3f9f6748649',
      //   phone: '13392834870',
      //   templateId: 'uniID_code',
      //   data: {
      //     name: 'DCloud',
      //     code: '123468',
      //     action: '注册',
      //     expMinute: '3'
      //   }
      // })
      // console.log('短信验证调用成功。', res)
    }
  }
}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
