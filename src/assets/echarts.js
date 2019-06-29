const option={
        title: {//标题组件
            text: '',
            left:'45%',//标题的位置 默认是left，其余还有center、right属性
            top:'20px',
            textStyle: {    
            //color: "#436EEE",    
            fontSize: 17,   
            }
        },
        tooltip : { //提示框组件
            trigger: 'item', //触发类型(饼状图片就是用这个)
            formatter: "{a} <br/>{b} : {c} ({d}%)" //提示框浮层内容格式器
        },
        //color:['#48cda6','#fd87fb','#11abff','#ffdf6f','#968ade'],  //手动设置每个图例的颜色
        color:['#48cda6','#ffdf6f'],
        legend: {  //图例组件
            //right:100,  //图例组件离右边的距离
            orient : 'horizontal',  //布局  纵向布局 图例标记居文字的左边 vertical则反之
            width:40,      //图行例组件的宽度,默认自适应
            x : 'center',   //图例显示在右边
            y: 'bottom',   //图例在垂直方向上面显示居中
            itemWidth:10,  //图例标记的图形宽度
            itemHeight:10, //图例标记的图形高度
           // data:['正常','异常'],
           data:[],
            textStyle:{    //图例文字的样式
                color:'#333',  //文字颜色
                fontSize:12    //文字大小
            }
        },
        graphic: {	        
            type: 'text',// [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,	        
            top: 'center',// 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。	        
            left: '50%', // 同上	        
            style: {	            
            text: '正常',       // 文本块文字。可以使用 \n 来换行。[ default: '' ]	            
            fill: 'black',           // 填充色。	            fontSize: 16,           // 字体大小	            
            fontWeight: 'bold'		// 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'	
            }        
        },
        series : [ //系列列表
            {
                name:'',  //系列名称
                type:'pie',   //类型 pie表示饼图
                center:['55%','50%'], //设置饼的原心坐标 不设置就会默认在中心的位置
                radius : ['50%', '60%'],  //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
                itemStyle : {  //图形样式
                    normal : { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                        label : {  //饼图图形上的文本标签
                            show : false,  //平常不显示
                            position:'center',
                            distance:8,
                            textStyle:{
                                color:"#333",
                                fontSize:14
                            },
                            // formatter:function(){
                            //     return this.draw.size.normal+"/n"+"正常"
                            // }
                        },
                        labelLine : {     //标签的视觉引导线样式
                            show : false  //平常不显示
                        }
                    },
                    emphasis : {   //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                        label : {  //饼图图形上的文本标签
                            show : false,
                            position : 'center',
                            textStyle : {
                                fontSize : '10',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data:[
                    // {value:50, name:'正常'},
                    // {value:20, name:'异常'}
                    
                ]
             }
        ]
    }
export default {option}