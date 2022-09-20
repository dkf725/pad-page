<template>
<a-card>
  <div>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px; height: 400px"></div>
      </el-col>

      <el-col :span="12">
        <div id="line" style="width: 500px; height: 400px"></div>
      </el-col>

      <el-col :span="12">
        <div id="pie" style="width: 500px; height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</a-card>
</template>

<script>
import * as echarts from 'echarts'
import {getAnalyze, getLoanPurpose, getProfitTotal} from '@/services/pad/statistics/analyze'
export default {
  name: "analyze",
  data() {
    return {

    }
  },
  mounted() {  // 页面元素渲染之后再触发

    /*企业用户统计图表*/
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: '每个季度企业用户人数统计图表'
      },
      xAxis: {
        type: 'category',
        data: ['第一季度', '第二季度', '第三季度', '第四季度']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };

    getAnalyze().then(res =>{
      //console.log(res.data)
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data.data.userData
      // 数据准备完毕之后再set
      myChart.setOption(option);
    })


    /*每月平台收益折线统计图*/
    var chartDom2 = document.getElementById('line');
    var myChart2 = echarts.init(chartDom2);
    var option2;

    option2 = {
      dataset: [
        {
          id: 'dataset_raw',
          source: ''
        },
        {
          id: 'dataset_since_1950_of_germany',
          fromDatasetId: 'dataset_raw',
          transform: {
            type: 'filter',
            config: {
              and: [
                { dimension: 'Year', gte: 1950 },
                { dimension: 'Country', '=': 'Germany' }
              ]
            }
          }
        },
      ],
      title: {
        text: '每月平台收益的总金额'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle',
        data:['1','2','3','4','5','6','7','8','9','10','11','12']
      },
      yAxis: {
        name: 'Income'
      },
      series: [
        {
          type: 'line',
          datasetId: 'dataset_since_1950_of_germany',
          showSymbol: false,
          encode: {
            x: 'Year',
            y: 'Income',
            itemName: 'Year',
            tooltip: ['Income']
          }
        },
      ]
    };

    getProfitTotal().then(res =>{
      console.log(res.data.data.profitData)
      option2.series[0].data = res.data.data.profitData
      myChart2.setOption(option2);
    })


    /*饼图 贷款用途统计图*/
    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);
    var pieOption;

    // 饼图
    pieOption = {
      title: {
        text: '贷款用途统计',
        subtext: '比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name:'贷款用途统计',
          type: 'pie',
          radius: '70%',
          center: ['45%', '50%'],
          label:{            //饼图图形上的文本标签
            normal:{
              show:true,
              position:'inner', //标签的位置
              textStyle : {
                fontWeight : 300 ,
                fontSize : 14,    //文字的字体大小
                color: "#fff"
              },
              formatter:'{d}%'
            }
          },
          data: [],  // 填空，模拟的假数据
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
    };

    getLoanPurpose().then(res =>{
      //console.log(111111111111111111111111111111)
      let loanPurpose = res.data.data.loanPurpose
      pieOption.series[0].data=loanPurpose
      pieChart.setOption(pieOption);
    })
  }
}
</script>

<style scoped>

</style>
