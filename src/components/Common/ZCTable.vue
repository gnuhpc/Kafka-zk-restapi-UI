<template>

  <div class="zc_tables_content">

    <div :id="id" class="zc_tables">

      <el-table :data="data"
                ref="zc_tables"
                style="width: 100%"
                :empty-text="$t('m.dataNull')"
                :header-cell-style="ZCHeaderCellStyle"
                :cell-style="ZCCellStyle"
                @cell-mouse-enter="ZCCellMouseEnter"
                @cell-mouse-leave="ZCCellMouseLeave"
                @cell-click="ZCCellClick"
                @select="ZCRowSelect"
                @select-all="ZCRowSelectAll">

        <!--表格选择部分-->
        <el-table-column v-if="isSelect && data.length"
                         type="selection"
                         :label="$t('m.selectedAll')"
                         width="50">
        </el-table-column>

        <!--表格主体部分-->
        <el-table-column v-for="column in category"
                         :prop="column.prop"
                         :label="column.label"
                         :text="column.label"
                         :key="column.prop"
                         :width="column.width">
        </el-table-column>

        <!--操作按钮部分-->
        <el-table-column v-if="operations.length && data.length"
                         :width="100">
          <template slot-scope="scope">

            <el-dropdown trigger="click">
              <span class="el-dropdown-link">{{$t('m.moreOperations')}}<i class="el-icon-arrow-down"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in operations"
                                  :key="item"
                                  @click="operationsClick(scope,index)">{{item}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>



            <!--<span class="operations"-->
                  <!--v-for="(item,index) in operations"-->
                  <!--v-text="item"-->
                  <!--@click="operationsClick(scope,index)">-->
            <!--</span>-->

          </template>
        </el-table-column>



      </el-table>

    </div>

    <div id="zc_tables_page" class="zc_tables_page" ref="zc_tables_page" v-if="showPageControl && total && data.length">

      <el-pagination
        small
        layout="sizes,total,prev, pager, next,jumper"
        :total="total?total:0"
        :page-size="size?size:10" @current-change="currentChange">
        <slot class="page_desc">
          <!--当前第{{(currentPage-1)*pageSize+1}}-{{currentPage*pageSize >total?total: currentPage*pageSize}}条 共计{{total}}条-->
          {{$t('m.total')}} {{total}} {{$t('m.pieces')}}
        </slot>
      </el-pagination>

    </div>

  </div>

</template>

<script>
  export default {
    name: "z-c-table",
    props: {
      id: {type: String, require: true},
      data: {type: Array, require: true},
      category: {type: Array, require: true},
      total: {type: Number, require: false},
      size: {type: Number, require: false},
      showPageControl: {
        type: Boolean, require: false,
      },
      isSelect: {type: Boolean, require: false},
      operations: {
        type: Array, require: false, default() {
          return []
        }
      },
    },
    data() {
      return {
        currentPage:1,

        pageSize:10,

        baseHeaderCellStyle: {
          fontWeight: 900,
          backgroundColor: '#F5F5F5',
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
        }
      }
    },
    methods: {

      /*编辑单元格表头样式*/
      ZCHeaderCellStyle({row, column, rowIndex, columnIndex}) {

        row.rowIndex = rowIndex;
        column.columnIndex = this.isSelect ? columnIndex - 1 : columnIndex;

        // 默认单元格表头样式
        let style = Object.assign({}, this.baseHeaderCellStyle);

        this.category.forEach(function (category, categoryIndex) {

          if (column.columnIndex === categoryIndex && category.headerStyle) {

            // 链接默认样式和自定义样式
            style = Object.assign(style, category.headerStyle);

          }

        });

        return style;

      },

      /*编辑单元格样式*/
      ZCCellStyle({row, column, rowIndex, columnIndex}) {

        row.rowIndex = rowIndex;
        column.columnIndex = this.isSelect ? columnIndex - 1 : columnIndex;

        let style = Object.assign({}, this.baseCellStyle);



        this.category.forEach(function (category, categoryIndex) {

          /*判断是否有全局style*/
          if (categoryIndex === column.columnIndex && category.style) {

            style = Object.assign(style, category.style);

          }

          /*判断是否有单独style*/
          if (categoryIndex === column.columnIndex && category.itemsStyle) {

            category.itemsStyle.forEach(function (item) {

              //*判断当前index和单独设置的index相等*/
              if (rowIndex === item.index) {

                style = Object.assign(style, item.style);

              }

            });

          }

          /*判断是否显示hover状态*/
          if (categoryIndex === column.columnIndex && category.showHover) {

            style = Object.assign(style, {cursor: 'pointer'})

          }

        });

        return style;

      },

      /*单元格高亮事件*/
      ZCCellMouseEnter(row, column, cell, event) {

        this.category.forEach(function (category, categoryIndex) {

          if (column.columnIndex === categoryIndex && category.showHover) {

            let tableCell = cell.children[0];

            tableCell.style.color = '#11B7D3';
            // tableCell.style.fontWeight = 'bolder';
            tableCell.style.textDecoration = 'underline';

          }
        });


      },

      /*单元格取消高亮事件*/
      ZCCellMouseLeave(row, column, cell, event) {

        this.category.forEach(function (category, categoryIndex) {

          let tableCell = cell.children[0];

          if(column.columnIndex === categoryIndex && category.showHover){

            tableCell.style.color = '#555555';
            // tableCell.style.fontWeight = 'normal';
            tableCell.style.textDecoration = 'none';

          }
        });

      },

      /*单元格点击事件*/
      ZCCellClick(row, column, cell, event) {

        this.category.forEach((category, categoryIndex)=> {

          if (column.label === category.label && category.showHover) {

            this.$emit('click-table-cell',row.rowIndex,column.columnIndex);

          }
        })

      },

      /*单元格行选中*/
      ZCRowSelect(selection){

        let selects = [];
        selection.forEach(function (item) {
          selects.push(item.rowIndex);
        });
        this.$emit('select-data',selects);

      },

      /*单元格行全选*/
      ZCRowSelectAll(selection){
        this.ZCRowSelect(selection)
      },


      /**************************分页控制器监听方法*********************/
      currentChange(pageNum){
        this.currentPage = pageNum;
        this.$emit('refresh-data',pageNum);
      },

      /***************************操作按钮监听方法************************/
      operationsClick(scope,index){
        this.$emit('operate-data',scope.row.rowIndex,index);
      }
    },

  }
</script>

<style scoped>

  .zc_tables_content {
    width: 100%;
  }

  .zc_tables {
    width: 100%;
  }

  .zc_tables >>> .is-leaf .cell {
    font-weight: bolder;
  }
  .zc_tables >>>.is-scrolling-none table{
    width: 100% !important;
  }
  .zc_tables >>>.is-scrolling-none table>tbody{
    width: 100% !important;
  }
  .zc_tables >>>.is-scrolling-none table >tbody tr{
    width: 100% !important;
  }
  .zc_tables >>> .cell{
    /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; */
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  /* .zc_tables >>>.is-scrolling-none .cell::after{
    content: "...";
    position: absolute;
    bottom: 0;
    right: 0;
    padding-left: 40px;
    background: -webkit-linear-gradient(left, transparent, red 50%);
    background: -o-linear-gradient(right, transparent, red 50%);
    background: -moz-linear-gradient(right, transparent, red 50%);
    background: linear-gradient(to right, transparent, red 50%);
  } */
  .zc_tables >>> .el-checkbox__inner{
    background-color: #fff;
    border-color: #1D2088;
  }
  .zc_tables >>> .is-checked .el-checkbox__inner{
    background-color: #1D2088;
  }


  /*分页控制器*/
  .zc_tables_page{
    text-align: right;
    padding: 10px;
    background-color: #fff;
  }

  .zc_tables_page >>> .el-pagination{
    padding: 0;
    color:#666;
    font-weight: 600;
  }

  .zc_tables_page >>> .el-pagination .page_desc{
    margin-right: 10px;
    color: #666;
    font-weight: 600;
  }

  /*分页控制器--上一页下一页*/
  .zc_tables_page >>> .btn-prev i,.zc_tables_page >>> .btn-next i{
    border: 1px solid #BCBCBC;
    padding: 1px;
    border-radius: 5px;
  }

  .zc_tables_page >>> .el-pagination__jump{
    color: #666;
    font-weight: 600;
  }

  /*分页控制器--数字样式*/
  .zc_tables_page >>> .el-pager .number{
    color:#CDCDCD
  }

  /*分页控制器--当前页码样式*/
  .zc_tables_page >>> .el-pager .active{
    color:#000E3A;
    font-weight: 600;
  }

  /*分页控制器--输入框样式*/
  .zc_tables_page >>> .el-input{
    width: 35px;
  }

  .zc_tables_page >>> input{
    height: 15px!important;
    width: 25px;
    font-size: 12px;
    margin: 0;
  }



  /*操作按钮样式*/
  .operations{
    display: inline-block;
    padding: 0;
    background-color: #fff;
    border: 1px solid #1D2088;
    border-radius: 5px;
    width: 40px;
    height: 20px;
    line-height: 20px;
    color: #1D2088;
    cursor: pointer;
  }

  .operations:not(:first-child){
    margin-left: 5px;
  }
</style>
