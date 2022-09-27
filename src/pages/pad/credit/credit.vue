<template>
  <a-card>

    <!--搜索框-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
      <el-form-item label="贷款编号" prop="lid">
        <el-input
            v-model="queryParams.lid"
            placeholder="请输入贷款编号"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        /><!--输入框回车时查询-->
      </el-form-item>
      <el-form-item label="还款方式" prop="returnMethod">
        <el-select
            v-model="queryParams.returnMethod"
            placeholder="请选择还款方式"
            clearable
            style="width: 240px"
        >
          <el-option
              :key="1"
              label="等额本息"
              :value="1"
          />
          <el-option
              :key="2"
              label="等额本金"
              :value="2"
          />
          <el-option
              :key="3"
              label="每月还息"
              :value="3"
          />
          <el-option
              :key="4"
              label="一次性还"
              :value="4"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="放款类型" prop="type">
        <el-select
            v-model="queryParams.type"
            placeholder="请选择放款类型"
            clearable
            style="width: 240px"
        >
          <el-option
              :key="0"
              label="现金"
              :value="0"
          />
          <el-option
              :key="1"
              label="汇款"
              :value="1"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="creditList" >
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="放款编号" prop="id" width="100" align="center"/>
      <el-table-column label="贷款信息编号" prop="lid" width="120" align="center"/>
      <el-table-column label="企业名称" prop="name" width="120" align="center"/>
      <el-table-column label="放款类型" prop="type" width="120" align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.type===0">现金</span>
            <span v-if="scope.row.type===1">汇款</span>
        </template>
      </el-table-column>
      <el-table-column label="还款方式" prop="returnMethod" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.returnMethod===1">等额本息</span>
          <span v-if="scope.row.returnMethod===2">等额本金</span>
          <span v-if="scope.row.returnMethod===3">每月还息</span>
          <span v-if="scope.row.returnMethod===4">一次性还</span>
        </template>
      </el-table-column>
      <el-table-column label="实际放款金额" prop="money" width="120" align="center"/>
      <el-table-column label="平台所收手续费" prop="service" width="120" align="center"/>
      <el-table-column label="创建时间" prop="createTime" width="120" align="center" :formatter="dateFormat"/>
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
import {getCreditList} from "@/services/pad/credit/credit";

export default {
  name: "credit",
  data(){
    return{
      page:1,//当前页
      limit:5,//每页记录数
      total:0,//总记录数
      creditList:[],  //放款信息列表
      queryParams:{},//条件查询对象
    }
  },
  created() {
    //初始化放款信息
    this.getList()
  },
  methods:{
    //搜索按钮
    handleQuery(){
      this.getList(this.page,this.limit);
    },
    //重置按钮
    resetQuery(){
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
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
    //每页条数改变时
    handleSizeChange(size){
      this.getList(this.page,size)
    },
    //当前页数改变时
    handleCurrentChange(page){
      this.getList(page,this.limit)
    },
    //查询所有放款信息
    getList(page=1){
      this.page = page
      getCreditList(this.page,this.limit,this.queryParams)
          .then(res=>{
            console.log(res.data)
            this.creditList = res.data.data.creditList
            this.total = res.data.data.total
          })
    },
  }
}
</script>

<style scoped>

</style>
