<template>
  <view class="form-box">
    <!-- 支出表单 start -->
    <u-form :model="form" ref="payForm" :error-type="errorType">
      <u-form-item prop="money">
        <u-input
          v-model="form.money"
          type="digit"
          clearable
          focus="true"
          :custom-style="{ color: orderType === 1 ? '#2979ff' : '#19be6b', fontSize: '52rpx' }"
          placeholder="请输入金额"
          :disabled="isCanEdit()"
        />
        <!-- <u-icon slot="right" @click="edit" :name="disabled ? 'lock-fill' : 'lock-opened-fill'" color="#19be6b" :size="pageType === 'detail' ? '50rpx' : '0'"></u-icon> -->
      </u-form-item>
      <!-- <u-form-item v-if="orderType" label="分类" prop="incomeType"><u-input v-model="form.incomeType" @click="() => select('incomeType')" disabled type="select" /></u-form-item> -->
      <u-form-item label="分类" prop="classifyType"><u-input v-model="form.classifyType" @click="() => select('classifyType', dictType.PAY_TYPE)" disabled type="select" /></u-form-item>
      <u-form-item label="账户" prop="accountType"><u-input v-model="form.accountType" @click="() => select('accountType', dictType.ACCOUNT_TYPE)" disabled type="select" /></u-form-item>
      <u-form-item label="时间"><u-input v-model="form.date" @click="selectTime" disabled /></u-form-item>
      <u-form-item label="成员"><u-input v-model="form.memberType" @click="() => select('memberType', dictType.MEMBER_TYPE)" disabled type="select" /></u-form-item>
      <u-form-item label="项目"><u-input v-model="form.projectType" @click="() => select('projectType', dictType.PROJECT_TYPE)" disabled type="select" /></u-form-item>
      <u-form-item label="备注:" label-position="top"><u-input v-model="form.remark" type="textarea" :disabled="isCanEdit()" /></u-form-item>
      <u-form-item>
        <u-upload
          :action="action"
          :header="headerObj"
          @on-success="imgUploadSuccess"
          :max-count="maxCount"
          :max-size="isCanEdit() ? 1 : 2000000"
          :deletable="!isCanEdit()"
          :show-progress="!isCanEdit()"
          ref="imgUpload"
          :file-list="fileList"
          width="180rpx"
          height="180rpx"
        ></u-upload>
      </u-form-item>
      <u-button v-if="isCanEdit()" @click="edit" :type="orderType ? 'primary' : 'success'">编辑</u-button>
      <u-button v-else :disabled="isCanEdit()" @click="submit" :type="orderType ? 'primary' : 'success'">保存</u-button>
    </u-form>
    <!-- 支出表单 end -->

    <view @click="addDict" v-if="isSelectShow" class="add-btn-box"><text>新增分类</text></view>

    <u-select v-model="isSelectShow" :default-value="selectValue" mode="mutil-column-auto" :list="selectList" @confirm="selectConfirm"></u-select>
    <u-picker mode="time" @confirm="timeConfirm" v-model="isTimeShow" :params="params"></u-picker>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { apiDictList } from '@/apis/common'
import { apiAddOrder, apiUpdateOrder } from '@/apis/orders'
import { dictType } from '@/common/constants'
import { sendDateTime, _filterDictList } from '@/common/utils'
import { localStorageKeys } from '@/common/constants'
import { baseURL, imgPath } from '@/common/request'

export default {
  props: {
    orderType: {
      type: Number,
      default: 0
    },
    formData: {
      type: Object,
      default: () => {}
    },
    // 页面类型，组件供新增和详情页面使用，新增：add, 详情：detail
    pageType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      dictType,
      // 表单变量
      form: {
        money: '',
        classifyType: '',
        accountType: '',
        memberType: '',
        projectType: '',
        date: sendDateTime(new Date(), 'yyyy/MM/dd hh:mm:ss'),
        remark: ''
      },
      errorType: ['toast'],
      rules: {
        money: [
          {
            required: true,
            message: '请输入金额'
          }
        ],
        classifyType: [
          {
            required: true,
            message: '请选择支付方式'
          }
        ],
        accountType: [
          {
            required: true,
            message: '请选择账户'
          }
        ]
      },
      action: `${baseURL}/v1/file`,
      fileList: [],
      headerObj: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: uni.getStorageSync(localStorageKeys.TOKEN)
      },
      maxCount: 3,
      isSelectShow: false,
      selectList: [],
      classifyTypeList: [], // 支付类型数据字典
      // incomeTypeList: [], // 收入类型数据字典
      accountTypeList: [], // 账户分类数据字典
      memberTypeList: [], // 成员数据字典
      projectTypeList: [], // 项目据字典
      currentSelect: '',
      currentDictType: '',
      isTimeShow: false,
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true
      },
      selectValue: '',
      disabled: false
    }
  },
  onReady() {
    this.$refs.payForm.setRules(this.rules)
    this.getDictList()
    if (this.pageType === 'detail') {
      this.disabled = true
    }
  },
  methods: {
    edit() {
      this.disabled = !this.disabled
      this.maxCount = 3
    },
    isCanEdit() {
      return this.pageType === 'detail' && this.disabled
    },
    selectTime() {
      if (this.isCanEdit()) return // 详情页使用时，初始状态不可编辑
      this.isTimeShow = true
    },
    select(type, dictType) {
      if (this.isCanEdit()) return // 详情页使用时，初始状态不可编辑
      if (type === 'accountType') {
        this.selectValue = [3, 0]
      } else {
        this.selectValue = [0, 0]
      }
      this.currentSelect = type
      this.currentDictType = dictType
      this.selectList = this[`${type}List`]
      this.isSelectShow = true
    },
    async getDictList() {
      // 获取支付类型数据字典
      const classifyTypeList = await apiDictList(this.orderType ? dictType.INCOME_TYPE : dictType.PAY_TYPE)
      this.classifyTypeList = _filterDictList(classifyTypeList)
      // // 获取收入类型数据字典
      // const incomeTypeList = await apiDictList(dictType.INCOME_TYPE)
      // this.incomeTypeList = this._filterDictList(incomeTypeList)
      // 获取账号类型数据字典
      const accountTypeList = await apiDictList(dictType.ACCOUNT_TYPE)
      this.accountTypeList = _filterDictList(accountTypeList)
      // 获取成员数据字典
      const memberTypeList = await apiDictList(dictType.MEMBER_TYPE)
      this.memberTypeList = _filterDictList(memberTypeList)
      // 获取项目数据字典
      const projectTypeList = await apiDictList(dictType.PROJECT_TYPE)
      this.projectTypeList = _filterDictList(projectTypeList)

      this.setData()
    },
    setData() {
      if (this.pageType === 'detail') {
        this.form = this.formData
        this.fileList = this.formData.imgList
        this.maxCount = this.fileList.length
      } else {
        this.resetForm()
      }
    },
    // 重置表单
    resetForm() {
      const form = {
        money: '',
        classifyType: `${this.classifyTypeList[0]?.children[0]?.label}`,
        // incomeType: `${this.incomeTypeList[0]?.children[0]?.label}`,
        accountType: `${this.accountTypeList[3]?.children[0]?.label}`,
        memberType: '',
        projectType: `${this.projectTypeList[0]?.children[0]?.label}`,
        date: sendDateTime(new Date(), 'yyyy/MM/dd hh:mm:ss'),
        remark: ''
      }
      this.form = form
    },
    selectConfirm(e) {
      this.form[this.currentSelect] = e[1].label
    },
    timeConfirm(e) {
      console.log(e)
      this.form.date = `${e.year}/${e.month}/${e.day} ${e.hour}:${e.minute}:${e.second}`
    },
    // 新增支出记录
    submit() {
      // 获取上传图片列表
      let files = []
      // 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100)
      files = this.$refs.imgUpload.lists.filter(val => {
        return val.progress === 100
      })
      files.forEach(item => {
        if (!item.imgUrl) {
          item.imgUrl = item.url.replace(imgPath, '')
        }
      })
      const imgUrl = files.map(item => item.imgUrl).join(',')
      if (this.pageType === 'detail') {
        // 编辑更新
        this.update(imgUrl)
      } else {
        // 新增
        this.add(imgUrl)
      }
    },
    add(imgUrl) {
      this.$refs.payForm.validate(valid => {
        if (valid) {
          // orderType=0表示支出,1表示收入
          apiAddOrder({ ...this.form, orderType: this.orderType, imgUrl }).then(() => {
            uni.showToast({
              title: '新增成功!'
            })
            this.$refs.imgUpload.clear()
            this.resetForm()
          })
        }
      })
    },
    async update(imgUrl) {
      const { id, money, classifyType, accountType, date, memberType, projectType, remark } = this.form
      const params = { money, classifyType, accountType, date, memberType, projectType, remark, imgUrl }
      apiUpdateOrder(id, params).then(() => {
        uni.showToast({
          title: '更新成功!'
        })
        this.disabled = true
        this.maxCount = this.fileList.length
      })
    },
    imgUploadSuccess(res, index, lists, name) {
      const { url } = res.data
      lists[index].imgUrl = url
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
.form-box {
  padding: 20rpx 32rpx;
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
