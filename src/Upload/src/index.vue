<template>
  <div>
    <el-button>22222</el-button>
  </div>
</template>

<script>
  import { Button as ElButton } from 'element-ui'
  export default {
    name: 'my-button',
    components: {
      ElButton
    },
    methods: {
      
    }
  }
</script>

<style>
  .button-styles {
    border: 1px solid #eee;
    border-radius: 3px;
    background-color: #FFFFFF;
    cursor: pointer;
    font-size: 15pt;
    padding: 3px 10px;
    margin: 10px;
  }
</style>