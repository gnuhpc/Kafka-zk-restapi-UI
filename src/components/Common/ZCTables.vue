<template>
  <div class="zc_tables_content" :id="'zctables'+id" >
    <!--表格部分-->
    <div class="zc_tables">
      <el-table ref="zctables"
                style="width: 100%"
                border
                :data="data"
                tooltip-effect="light"
                :cell-style="ZCTableCelStyle"
                :header-cell-style="ZCTableHeaderCellStyle"
                @selection-change="ZCTableSelectChange">

        <!--表格选择部分-->
        <el-table-column v-if="isSelect && data.length"
                         fixed
                         type="selection"
                         :label="$t('m.selectedAll')"
                         :width="selectColumnWidth">
        </el-table-column>

        <!--表格序号部分-->
        <el-table-column v-if="isIndex && data.length"
                         type="index"
                         :label="$t('m.index')"
                         :width="indexColumnWidth">
        </el-table-column>

        <!--表格主体部分-->
        <el-table-column v-for="(column,index) in category"
                         :prop="column.prop"
                         :label="column.label"
                         :key="column.prop"
                         :width="ZCTableColumnWidth(index)"
                         :show-overflow-tooltip="true"
                         :show-tooltip-when-overflow="true">
        </el-table-column>

        <!--表格操作部分-->
        <el-table-column v-if="handles && handles.length && data.length"
                         :label="$t('m.operate')"
                         :width="handleColumnWidth">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <span class="handleTitle">{{$t('m.moreOperations')}}<i class="el-icon-arrow-down"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in handles[scope.row.rowIndex]"
                                  :key="item.name" @click.native="ZCTableHandleDropdownClick(scope.row.rowIndex,index)">
                  {{item.name}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <!--分页部分-->
    <div ref="zc_tables_page" id="zc_tables_page" class="zc_tables_page" v-if="isPaging && data.length && total>currentPageSize">
      <el-pagination
        small
        layout="sizes,total,prev, pager, next,jumper"
        :page-sizes="pageSizes"
        :page-size="size?size:currentPageSize"
        :total="total?total:0"
        :current-page="currentPage"
        @current-change="ZCTableCurrentChange"
        @size-change="ZCTableSizeChange">
      </el-pagination>

    </div>

  </div>
</template>

<script>
  export default {
    name: "ZCTables",
    props: {
      /*数据区域*/
      id: {type: String, require: true},//控件ID
      data: {type: Array, require: true},//表格显示的数据集合
      category: {type: Array, require: true},//表格列集合
      total: {type: Number, require: false},//表格总数量
      size:{type:Number,require:false},//表格当前默认的条数
      handles:{type: Array, require: false},//表格操作数据

      /*功能区域*/
      isSelect: {type: Boolean, require: false},//是否包含选择框
      isPaging: {type: Boolean, require: false},//是否显示分页
      isIndex: {type: Boolean, require: false},//是否显示序号

    },
    computed:{
      selectColumnWidth(){
        return this.isSelect?50:0
      },
      indexColumnWidth(){
        return this.isIndex?50:0
      },
      handleColumnWidth(){
        return (this.handles && this.handles.length)?100:0
      }
    },
    data() {
      return {
        baseColor:'#ffc35b',
        baseHeaderCellStyle: {
          fontWeight: 900,
          // backgroundColor: '#F5F5F5',
          color: '#555555',
          padding: '5px 0',
          textAlign: 'center',
          fontSize: '12px',
        },
        baseCellStyle: {
          backgroundColor: '#fff',
          color: '#555555',
          padding: '5px 0',
          textAlign: 'center',
          fontSize: '12px',
        },

        /*分页相关数据*/
        currentPage:1,
        currentPageSize:10,
        pageSizes:[5,10,20,30,40]
      }
    },
    methods: {

      /*当前表格所有cell的样式*/
      ZCTableCelStyle({row, column, rowIndex, columnIndex}){
        row.rowIndex = rowIndex;
        column.columnIndex = columnIndex;

        //当表格有选择功能时候将columnIndex后移
        if(this.isSelect){
          column.columnIndex -= 1;
        }

        //当表格有序号功能时将columnIndex后移
        if(this.isIndex){
          column.columnIndex -= 1;
        }

        let cellStyle = Object.assign({}, this.baseCellStyle);

        this.category.forEach((item,index)=>{

          //自定义表格列总样式
          if(item.style && index===column.columnIndex) cellStyle = Object.assign(cellStyle, item.style);
          //自定义表格列行单独样式
          if(item.itemStyle && item.itemStyle.length){
            item.itemStyle.forEach((subItem,subIndex)=>{
              if(subItem.index === row.rowIndex && index === column.columnIndex) cellStyle = Object.assign(cellStyle, subItem.style);
            })
          }

        });
        return cellStyle;
      },

      /*当前表格表头样式*/
      ZCTableHeaderCellStyle({row, column, rowIndex, columnIndex}){
        row.rowIndex = rowIndex;
        column.columnIndex = columnIndex;

        //当表格有选择功能时候将columnIndex后移
        if(this.isSelect){
          column.columnIndex -= 1;
        }

        //当表格有序号功能时将columnIndex后移
        if(this.isIndex){
          column.columnIndex -= 1;
        }

        let headerCellStyle = Object.assign({}, this.baseHeaderCellStyle);

        this.category.forEach((item,index)=>{
          if (item.headerStyle && column.columnIndex === index){
            headerCellStyle = Object.assign(headerCellStyle, item.headerStyle);
          }

        });

        return headerCellStyle;
      },

      /*表格列宽设置*/
      ZCTableColumnWidth(index){
        let dom = document.getElementById('zctables'+this.id);
        // console.log(dom)
        if (dom){
          let tableTotalWidth = dom.offsetWidth - this.selectColumnWidth - this.indexColumnWidth - this.handleColumnWidth;
          let width = this.category[index].width;

          if(!width){
            return;
          }

          return parseInt(width/100 * tableTotalWidth); 
        }

        return;

      },



      //当表格具有批量操作功能时,对应的选择结果监听方法
      ZCTableSelectChange(selection){
        let result = [];
        selection.forEach((item,index)=>{
          result.push(item.rowIndex);
        });
        this.$emit('select-change',result);
      },



      //当表格具有操作列功能时候,对应的点击监听方法
      ZCTableHandleDropdownClick(rowIndex,index){
        let type = this.handles[rowIndex][index].type;
        this.$emit('handle-click',rowIndex,type)
      },




      /********************************分页相关方法*********************************/
      //当表格对应的分页控件数据更改时,对应的刷新监听方法
      ZCTableRefreshData(){
        this.$emit('refresh-data',this.currentPage,this.currentPageSize)
      },

      //当表格具有分页功能时,对应的当前页码变更监听方法
      ZCTableCurrentChange(pageNum){
        this.currentPage = pageNum;
        this.ZCTableRefreshData();
      },

      //当表格具有分页功能时,对应的每页数量变更监听方法
      ZCTableSizeChange(pageSize){
        this.currentPageSize = pageSize;
        this.ZCTableRefreshData();
      },


    },
    mounted() {
      window.addEventListener('resize',()=>{
        this.category.unshift({});
        this.category.shift();
      });
      this.ZCTableRefreshData();
    }
  }
</script>

<style scoped>
  .zc_tables_content {
    width: 100%;
  }
  .zc_tables {
    width: 100%;
  }

  /*表格*/


  .handleTitle{
    display: inline-block;
    font-size: 12px;
    background-color: #409EFF;
    border-radius: 3px;
    color: #fff;
    padding: 0 5px;
    cursor: pointer;
  }

  /*分页控制器*/
  #zc_tables_page{
    text-align: right;
    padding-top: 10px;
    font-size: 13px;
  }
  #zc_tables_page >>> .el-select .el-input__inner{
    padding: 0 25px 0 8px;
    width: 80px;
    height: 22px;
    font-size: 12px;
  }
  #zc_tables_page >>> .el-select .el-input__icon{
    line-height: 22px;
  }
  #zc_tables_page >>> .el-pagination__jump{
    margin-left: 10px;
  }


</style>
