<template>
  <a-card>
    <el-table :data="overdueList" >
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="逾期编号" prop="id" width="100" align="center"/>
      <el-table-column label="还款编号" prop="rid" width="120" align="center"/>
      <el-table-column label="逾期利率" prop="overdueRate" width="120" align="center"/>
      <el-table-column label="逾期金额" prop="money" width="120" align="center"/>
      <el-table-column label="逾期开始时间" prop="beginTime" width="120" align="center" :formatter="dateFormat"/>
      <el-table-column label="逾期结束时间" prop="endTime" width="120" align="center" :formatter="dateFormat2"/>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-auth:permission="`company:loanInfo:edit`"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`company:loanInfo:remove`"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <!--分页-->
    <el-pagination
        style="padding:30px 0;text-align:center;"
        :total="total"
        :current-page="page"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />

  </a-card>
</template>

<script>
import {getOverdueList} from "@/services/pad/overdue/overdue";

export default {
  name: "overdue",
  data(){
    return{
      page:1,//当前页
      limit:5,//每页记录数
      total:0,//总记录数
      overdueList:[]  //企业用户基本信息列表
    }
  },
  created() {
    //初始化贷款信息
    this.getList()
  },
  methods:{
    // 时间格式化
    dateFormat: function(row) {
      var t = new Date(row.beginTime)// row 表示一行数据, createTime 表示要格式化的字段名称
      if(!t){
        return ''
      }
      let year = t.getFullYear()
      let month = this.dateIfAddZero(t.getMonth()+1)
      let day = this.dateIfAddZero(t.getDate())
      return year + '-' + month + '-' + day
    },
    dateIfAddZero : function (time) {
      return time < 10 ? '0'+ time : time
    },
    dateFormat2: function(row) {
      var t = new Date(row.endTime)// row 表示一行数据, createTime 表示要格式化的字段名称
      if(!t){
        return ''
      }
      let year = t.getFullYear()
      let month = this.dateIfAddZero(t.getMonth()+1)
      let day = this.dateIfAddZero(t.getDate())
      return year + '-' + month + '-' + day
    },
    //每页条数改变时
    handleSizeChange(size){
      this.getList(this.page,size)
    },
    //当前页数改变时
    handleCurrentChange(page){
      this.getList(page,this.limit)
    },
    //查询所有企业用户基本信息
    getList(page=1){
      this.page = page
      getOverdueList(this.page,this.limit)
          .then(res=>{
            console.log(res)
            this.overdueList = res.data.data.overdueList
            this.total = res.data.data.total
          })
    },
  }
}
</script>

<style scoped>

</style>
