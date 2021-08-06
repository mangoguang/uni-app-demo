<template>
	<view class="player-item">
    <u-cell-item icon="account" :title="detail.eastName" :value="detail.eastNum" :arrow="false"></u-cell-item>
    <u-cell-item icon="account" :title="detail.southName" :value="detail.southNum" :arrow="false"></u-cell-item>
    <u-cell-item icon="account" :title="detail.westName" :value="detail.westNum" :arrow="false"></u-cell-item>
    <u-cell-item icon="account" :title="detail.northName" :value="detail.northNum" :arrow="false"></u-cell-item>
	</view>
</template>

<script>

export default {
  props: {
    detail: {
      type: Object,
      value: () => {}
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    console.log('detial:::', this.detail)
  }
}
</script>

<style lang="scss" scoped>

</style>
