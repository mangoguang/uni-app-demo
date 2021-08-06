<template>
	<view class="content">
    <u-collapse v-if="isShow" :head-style="{ padding: 0, borderBottom: '1px solid rgb(228, 231, 237)' }">
      <u-collapse-item
        v-for="(item, itemIndex) in dictList"
        :key="item.id"
        :index="itemIndex"
        :open="currentDictCode === item.dictCode"
        :title="item.dictName"
        @change="(e) => dictChange(e, item.dictCode)"
      >
        <u-cell-item
          slot="title"
          :title="item.dictName"
          :arrow="false"
          class="cell-item"
          :border-bottom="false"
        >
        </u-cell-item>
        <view class="dict-text-box">
          <u-swipe-action
            v-for="(dict, index) in item.childs" :key="dict.dictCode"
            :show="dict.show"
            :index="index"
            @click="() => delDict(dict.dictCode)"
            @open="() => open(itemIndex, index)"
            :options="options"
          >
            <view class="dict-text">{{ dict.dictName }}</view>
            <u-line color="rgb(228, 231, 237)" />
          </u-swipe-action>
          <view @click="() => showModel(item.dictCode)" class="dict-text">+ 新建</view>
          <u-line color="rgb(228, 231, 237)" />
        </view>
      </u-collapse-item>
    </u-collapse>

    <u-modal
      v-model="isAddModelShow"
      :show-cancel-button="true"
      title="新增数据字典"
      @confirm="addDict"
    >
			<view class="slot-content">
				<u-field v-model="dict" placeholder="请输入数据字典名称"></u-field>
			</view>
		</u-modal>
	</view>
</template>

<script>
import { apiDictList, apiAddDict, apiDelDict } from '@/apis/common'

export default {
  data() {
    return {
      currentDictCode: '',
      dictType: '',
      isShow: true,
      isAddModelShow: false,
      dict: '',
      fatherCode: '',
      dictList: [],
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
  onLoad(options) {
    this.dictType = options.dictType
    console.log(options)
    this.getDictList(options.dictType)
    console.log('11111', this.dictList)
  },
  methods: {
    async getDictList(dictType) {
      this.dictList = await apiDictList(dictType)
    },
    showModel(fatherCode) {
      this.fatherCode = fatherCode
      this.isAddModelShow = true
    },
    // 新增数据字典
    async addDict() {
      console.log(`---${this.dict}---`)
      if (this.dict === '') {
        uni.showToast({ title: '输入不能为空!', icon: 'error' })
        this.isAddModelShow = true
        return false
      }
      const params = {
        dictName: this.dict,
        fatherCode: this.fatherCode
      }
      await apiAddDict(params)
      uni.showToast({ title: '新增成功!' })
      this.dictList = await apiDictList(this.dictType)
      this.isShow = false
      setTimeout(() => { this.isShow = true }, 0)
    },
    async delDict(dictCode) {
      await apiDelDict(dictCode)
      uni.showToast({ title: '删除成功!' })
      this.dictList = await apiDictList(this.dictType)
      this.isShow = false
      setTimeout(() => { this.isShow = true }, 0)
    },
    open(fatherIndex, childIndex) {
      const tempList = JSON.parse(JSON.stringify(this.dictList))
      tempList[fatherIndex].childs.forEach((item, index) => {
        item.show = index === childIndex
      })
      this.dictList = tempList
    },
    dictChange(e, dictCode) {
      if (e.show) this.currentDictCode = dictCode
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
  // .dict-text-box {
  //   padding: 0 32rpx;
  // }
  .dict-text {
    font-size: 24rpx;
    line-height: 50rpx;
    padding: 20rpx 32rpx;
  }
}
</style>
