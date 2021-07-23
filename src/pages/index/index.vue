<template>
	<view class="content">
		<u-action-sheet :list="list" v-model="show"></u-action-sheet>
		<view>
			<text class="title">{{title}}</text>
			<u-button @click="vconsoleShow" type="primary">show Vconsole</u-button>

			<u-tabbar v-model="current" :list="tabbarList" :mid-button="true"></u-tabbar>
		</view>
	</view>
</template>

<script>
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
  onLoad() {

  },
  methods: {
    showSelect() {
      this.show = true
    },
    vconsoleShow() {
      if (this.count === 0) {
        this.start = Date.now()
      }
      console.log(123)
      this.count += 1
      if (this.count > 5) {
        const time = Date.now() - this.start
        if (time < 8800) {
          // 2s内点击6次
          this.count = -1000
          const vconsole = document.querySelector('#__vconsole')
          if (vconsole) {
            vconsole.style.display = 'block'
          }
        } else {
          // 超过2s重新计算
          this.count = 0
          this.start = 0
        }
      }
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
