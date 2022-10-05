<template>
  <a-card>
    <!--操作-->
    <el-table :data="approvalRecordList">
      <el-table-column label="审批记录编号" prop="id" />
      <el-table-column label="货款信息编号" prop="lid" />
      <el-table-column label="审核人物" prop="type">
        <template slot-scope="scope">
        <span v-if="scope.row.type==0">平台管理员</span>
        <span v-if="scope.row.type==1">银行管理员</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" prop="status" >
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">未审核</span>
          <span v-if="scope.row.status==1">审核通过</span>
          <span v-if="scope.row.status==-1">审核失败</span>

        </template>
      </el-table-column>
      <el-table-column label="审批说明" prop="message"  />
      <el-table-column label="创建时间" prop="createTime" :formatter="dateFormat"/>
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
import { getapprovalRecordList} from "@/services/pad/approvalRecord/approvalRecord";

export default {
  name: "index",
  data(){
    return{
      page:1,//当前页
      limit:3,//每页记录数
      total:0,//总记录数
      queryParams:{},//条件查询对象
      approvalRecordList:[],//留言列表
    }
  },
  created() {
    //初始化角色列表
    this.getList(this.page,this.limit)
  },
  methods:{
    // 时间格式化
    dateFormat: function(row) {
      var t = new Date(row.createTime)// row 表示一行数据, createTime 表示要格式化的字段名称
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
    //查询所有留言
    getList(page,limit){
      getapprovalRecordList(page,limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.approvalRecordList = res.data.data.approvalRecordList
            this.total = res.data.data.total
          })
    },

    //每页条数改变时
    handleSizeChange(size){
      this.getList(this.page,size)
    },
    //当前页数改变时
    handleCurrentChange(page){
      this.getList(page,this.limit)
    }
  }
}
</script>

<style scoped>

</style>