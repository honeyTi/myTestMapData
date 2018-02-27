let panorama = function (data) {
    return panorama.prototype.init(data);
};

// panorama 基本属性

panorama.prototype = {
    version: '0.0.1',

    // 数据页面获取初始化方法
    init: function (data) {
        'use strict';
        const option = {
            container: data.container,
            containerWH: data.containerWH,
            color: data.color,
            tier: data.tier,
            nodeRadius: data.nodeRadius,
            node_data: data.nodes,
            node_links: data.links
        };

        let width = option.containerWH[0],
            height = option.containerWH[1];

        // 建立节点直接的关系
        function node2node(nodes, links) {
            links.forEach(function (e) {
                let sourceNode = nodes.filter(function (d) {
                    return e.source == d.id
                })[0];
                let targetNode = nodes.filter(function (d) {
                    return e.target == d.id
                })[0];
                e.source = sourceNode;
                e.target = targetNode
            });
            return links
        }

        //获取 input 输入的 字符串的 像素宽度
        function getLenPx(str, font_size) {
            var str_leng = str.replace(/[^\x00-\xff]/gi, 'aa').length;
            return str_leng * font_size / 2
        }

        // 颜色处理函数
        function getColor(nodes) {
            let node_color_index = 0;
            let node_color = new Array();
            let color = null;
            if (option.color.length > 0) {
                color = option.color;
            } else {
                color = ["#ff461f", "#fff143", "#75664d", "#cca4e3", "#8d4bbb", "#4b5cc4", "#00e500", "#274a78", "#544a47", "#ffb61e", "#0eb83a"];
            }
            for (let node_index = 0; node_index < nodes.length; ++node_index) {
                let first_label = nodes[node_index]["data"]["labels"][0];
                if (!node_color[first_label]) {
                    node_color[first_label] = color[node_color_index];
                    node_color_index += 1
                }
            }
            return node_color;
        }
        var node_color = getColor(option.node_data);
        // 缩放功能
        let zoom = d3.behavior.zoom()
            .scaleExtent([1 / 2, 20]) //缩放 比例范围
            .on("zoom", zoomed);

        function zoomed() {
            d3.select(this).attr("transform",
                "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
            );
        };

        let svg = d3.select(option.container).append("svg") //在body标签中添加 svg 标签
            .attr("width", width) // 设定svg 的宽度
            .attr("height", height) //设定 svg 的高度
            .call(zoom) //允许 svg 的拖动;
            .on("dblclick.zoom", null) //禁止 svg 的双击放大效果
            .on("click", function () {
                svg.selectAll("use").classed("pie_display", true);
            }, 'false');

        // 引力图设定
        let force = d3.layout.force() // 布局
            .nodes(option.node_data)
            .size([width, height]) //设定布局的范围
            .linkDistance(500) //节点之间距离
            .charge(-2500) //互斥力
            .start(); //开始转化普通数据为 d3 可用数据

        // 拖拽功能
        let drag = force.drag().on("dragstart", function (d, i) {
            d.fixed = true; // 拖动节点时，固定在鼠标停留位置
            d3.event.sourceEvent.stopPropagation(); // 解决drag和zoom 冲突。解决拖动节点时，整个svg 一起拖动的问题。
        });

        // 创建箭头
        let defs = svg.append("defs");
        let marker = defs.append("marker")
            .attr("id", "jiantou")
            .attr("markerHeight", "10")
            .attr("markerWidth", "10")
            .attr("markerUnits", "strokeWidth")
            .attr("refX", "22") //修改 marker 的偏移位置
            .attr("refY", "6") //修改 marker 的偏移位置
            .attr("orient", "auto")
            .attr("stroke", "black");
        let arrow_path = "M 2,2 L 10,6, L 2,10 L 6,6 L 2,2 ";
        marker.append("path")
            .attr("d", arrow_path);

        // 外圆轮廓---三个按钮
        let database = [1, 1, 1];
        let pie = d3.layout.pie();
        let piedata = pie(database);
        var arc = d3.svg.arc()
            .innerRadius(30)
            .outerRadius(60);
        let outer = defs.append("g")
            .attr("id", 'out_circle')
            .selectAll(".group")
            .data(piedata)
            .enter()
            .append("g")
            .attr("class", function (d, i) {
                return "action_" + i + " three_circle"
            });
        outer.append("path")
            .attr("d", function (d) {
                return arc(d)
            })
            .attr("fill", "#bbcdc5")
            .attr("stroke", "#f0f0f4")
            .attr("stroke-width", 2);
        outer.append("text")
            .attr("transform", function (d, i) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) {
                let zi = new Array()
                zi[0] = "释放";
                zi[1] = "扩展";
                zi[2] = "属性";
                return zi[i]
            })
            .attr("font-size", 10);
        // 三个按钮功能
        force.on('tick', function () {

            svg.selectAll(".groupstyle").on("click", function (d, i) {
                if (ACTION) {
                    switch (ACTION) {
                        case "FREE":
                            d.fixed = false;
                            ACTION = ''; //重置 ACTION
                            break;
                        case "PROPERTY":
                            // 增加属性展示功能
                            ACTION = '';
                            break;
                        case "EXTENDS":
                            let d_id = d.id;
                            // 扩展功能增加
                            ACTION = '';
                            break;
                    }
                }
            });

            /*---------------------- 三个动作------结束-----------------------*/

            let FONT_SIZE = 12; //字体大小
            let OUTER_R = 50; //外圆半径
            let INNER_R = 25; // 内圆半径

            let three_part_pie = svg.selectAll(".three_part_pie");
            let node_edge = svg.selectAll(".node_edge");
            let edge_text = svg.selectAll(".edge_text");
            let outer_circle_nodes = svg.selectAll(".outer_circle_nodes");
            let inner_circle_nodes = svg.selectAll(".inner_circle_nodes");
            let text_nodes = svg.selectAll(".text_nodes");

            /*-----限定 节点组 移动 范围开始------*/
            // 所有 节点的移动边界由此 限定
            let g_x = 50;
            let g_y = 50;
            three_part_pie.attr("x", function (d) {
                    if (d.x - g_x < 0) { //d.x 为节点的 x 轴坐标。如果 节点 x 轴坐标 - 某个数值 如果 < 0 ,说明，至少有一部分内容已经在显示边界之外了，
                        // 为了使全部的元素都显示在 限定范围内，所以作此限定。
                        d.x = g_x
                    } else if (d.x + g_x > width) { //同理，如果 d.x + g_x 如果大于 宽度，那么说明，有一部分已经在显示边界之外了。
                        d.x = width - g_x
                    }
                    return d.x
                })
                .attr("y", function (d, i) {
                    if (d.y - g_y < 0) { //同上
                        d.y = g_y
                    } else if (d.y + g_y > height) {
                        d.y = height - g_y
                    }
                    return d.y
                });

            /*-----限定 节点组 移动 范围结束------*/


            /*------动态调节 节点 间连线 --- 开始 ------*/
            // 此处函数为 动态创建 节点之间的 连线，使连线，随着 节点的移动而变化
            node_edge.attr("d", function (d, i) {
                let path = "M" + " " + d.source.x + " " + d.source.y + " " +
                    "L" + " " + d.target.x + " " + d.target.y;
                return path
            });

            /*------动态调节 节点 间连线 --- 结束 ------*/

            /* ----- 动态移动 节点间连线上的 文字 的位置 -- 开始 -- */

            edge_text.attr("x", function (d, i) {
                return d.source.x
            }).attr("y", function (d, i) {
                return d.source.y
            });
            /* ----- 动态移动 节点间连线上的 文字 的位置 -- 结束 -- */


            /* -------------------------动态调节 节点的位置  开始----------------------*/
            //这里也有对 内外圆 移动范围的限定，参考上面对整个 节点组 移动范围的限定。
            //配置外圆
            outer_circle_nodes.attr("cx", function (d, i) {
                if (d.x - OUTER_R < 0) {
                    d.x = out_r
                } else if (d.x + OUTER_R > width) {
                    d.x = width - out_r
                }
                return d.x
            }).attr("cy", function (d, i) {
                if (d.y - OUTER_R < 0) {
                    d.y = out_r
                } else if (d.y + OUTER_R > height) {
                    d.y = height - out_r
                }
                return d.y
            });
            // 配置内圆
            inner_circle_nodes.attr("cx", function (d, i) {
                // 设定 圆 不能超出 svg 的范围
                if (d.x - INNER_R < 0) {
                    d.x = INNER_R
                } else if (d.x + INNER_R > width) {
                    d.x = width - INNER_R
                }
                return d.x
            }).attr("cy", function (d, i) {
                if (d.y - INNER_R < 0) {
                    d.y = INNER_R
                } else if (d.y + INNER_R > height) {
                    d.y = height - INNER_R
                }
                return d.y
            });
            /* -------------------------动态调节 节点的位置  结束----------------------*/


            /*--------------动态调节 节点上文字的位置，使其随着节点的移动而移动----开始----------------*/
            
            //设定text的 坐标
            text_nodes.attr("x", function (d, i) {
                let strr = d.data.property.name;
                let str_px_len = getLenPx(strr, FONT_SIZE); //获取字符串的像素宽度
                return d.x - str_px_len / 2; // - 圆心相对于字符串右移，+ 圆心相对于字符串 左移；从而使字符串的中心在圆的中心。
            }).attr("y", function (d, i) {
                return d.y + 2
            });

            /*--------------动态调节 节点上文字的位置，使其随着节点的移动而移动----结束----------------*/


            /*------定义 ACTION -- 开始--------------------------------*/
            //根据 用户点击的外轮廓的不同位置， 决定采取哪种动作。给 action 赋值，配合其他函数进行操作。

            let ACTION = '';
            svg.selectAll(".action_0")
                .on("click", function (d, i) {
                    ACTION = "FREE"
                });

            svg.selectAll(".action_2").on("click", function (d, i) {
                ACTION = "PROPERTY"
            });
            svg.selectAll(".action_1").on("click", function (d, i) {
                ACTION = "EXTENDS"
            });
            /*-------- 定义 ACTION -- 结束--------------------------------------------------*/


            /*----监听事件 -- 结束  ----------------- 代码结束的位置*/
        });

        // 构造视图函数
        function update_view(node, link) {


            let links = [];
            if (link.length > 0) {
                if (typeof(link[0]["source"]) == "string") {
                    links = node2node(node, link);
                } else if (typeof(link[0]["source"]) == "object") {
                    links = link
                }
            }
    
    
            // let links = link;
            /* ---获取节点间连线 edge 的三个部分 update enter  exit  部分---用 path 构建- */
            let edge_line_update = svg.selectAll(".edge_line").data(links);
            let edge_line_enter = edge_line_update.enter();
            let edge_line_exit = edge_line_update.exit();
    
            /* --- 获取节点间连线上的文字（也就是节点上连线上的子） 的三个部分 update enter  exit ---用 text 构建-*/
            let edge_text_update = svg.selectAll(".text_edge").data(links);
            let edge_text_enter = edge_text_update.enter();
            let edge_text_exit = edge_text_update.exit();
    
            /*---获取整个 节点组 group。这里所说的整个节点组 包括如下部分：
             * 1.内部圆          默认显示的，比较小的 实心圆 ----用circle 构建
             * 2.内部圆上的文字   顾名思义，就是显示在内部圆上的文字，可以是节点的id。name。等内容，以便节点之间能够区分开。---用text 构建
             * 3.外部轮廓圆(环)   当鼠标悬浮内部实心圆圆时，会在实心圆的周围出现一个圆环，这就是外部轮廓圆(环)。其实它是一个完整的圆，而不是圆环，
             *                    只是因为渲染顺序被 内部圆所覆盖了而已。 -- 用 circle 构建。
             * 4.三瓣式圆(环)    就是单击实心圆时，在外部轮廓圆周围环绕的分成三部分的比较宽的圆环。这个其实饼形图，它不是由圆生成而是由path 生成，
             *                   并且，多个实心圆单击出现的这个三瓣式圆环，其实是对早已定义在defs中原始三瓣式圆环的 复用。  --用 path 构建
             * */
            let groups_update = svg.selectAll(".groupstyle").data(option.node_data);
            let groups_enter = groups_update.enter();
            let groups_exit = groups_update.exit();
    
            /*——————————————————————————————————————————————————————————————*/
            /*       截至到此，svg 标签下面的初级子标签的不同部分已经获取完成，对页面显示内容的操作，都是在这些节点上的操作(确切的是增、删)
             再接下来的部分就是对这些自标签的不同部分进行操作了。                */
            /*——————————————————————————————————————————————————————————————*/
            //
            //
            //  由于 svg 根据渲染顺序的先后， 在页面上呈现不同的覆盖效果，所以要合理安排 元素的 增/删  顺序
            //
            //
            /*------  操作节点连线 -----开始-----------------------------*/
            /*---  节点间 连线位于 最底层，所以先添加，使其首先得到渲染 -----*/
            //对于update更新来说，目前还没有任何操作的需求。所以略过
            //根据节点来添加相应的连线，其实是对 enter部分的操作。
            edge_line_enter.append("path") //根据绑定的 links 数据集，补全相应的 path 元素
                    .attr("stroke", "black") //设定 节点间连线的 颜色
                    .attr("stroke-width", 2) // 设定 节点间连线的 宽度
                    .attr("id", function (d, i) {  // 设定节点间连线的 id ，这个id 会被连线上的文字的属性所引用。用以设定文字样式。
                        return "line" + i
                    })
                    .attr("class", "node_edge")
                    .attr("marker-end", "url(#jiantou)"); // 连接defs中早已经配置好的箭头元素
            // 箭头某属性设定为:箭头大小根据 引用元素(本例即为：path) 的宽度 的变化而变化。所以，慎重调节 该元素的宽度。
            //对于多出的 连线部分，采取删除动作（此动作一般用于删除 ）
            edge_line_exit.remove();
            /*------  操作节点连线 -----结束-----------------------------*/
    
            /*----操作 节点连线上的文字 -----------开始-----------------*/
            // 暂时没有更新 节点连线上 文字的需求
            // 添加节点连线上的文字
            edge_text_enter.append("text")
                    .attr("dx", function (d) {
                        return 100
                    })
                    .attr("dy", function (d) {
                        return -8
                    })
                    /*以上两个 属性 为 配置edge上的文字，与节点之间的距离。
                     * todo：文字现在的位置是写死的，距离source节点的距离是始终是100，而不会随着节点之间的连线的增长或者是缩短而动态的调节
                     * todo：与两端节点之间的距离。需要改写成动态的。。这和下面的有一部分函数是相互作用的。
                     * */
                    .attr("fill", "#1685a9")
                    .append("textPath")
                    .attr("class", "edge_text")
                    .attr("xlink:href", function (d, i) {
                        return "#line" + i
                    })
                    .text(function (d) {
                        return d.labels
                    });
            // 多余的删除
            edge_text_exit.remove();
            /*----操作 节点连线上的文字 -----------结束-----------------*/
    
            /* ---操作 节点组 ---开始------*/
            // 暂时没有更新节点组的需求
            //根据数据集，创建新的节点组。
            let groups = groups_enter.append("g").attr("class", "groupstyle");
            //多余的节点组删除
            groups_exit.remove();
            /*----操作节点组 结束-----*/
    
            /*----节点组 中添加子元素----开始-------------*/
            //添加 三瓣式圆环
            let three_part_pie = groups.append("use") //  为每个节点组添加一个 use 子元素
                    .attr("xlink:href", "#out_circle") //  指定 use 引用的内容
                    .attr("id", function (d) {
                        return d.index
                    })
                    .attr("class", function (d, i) {
                        return "ingroup_pie_" + d.id + "   three_part_pie"
                    })
                    .classed("pie_display", true); //该 三瓣式 圆环 默认是不显示状态。
    
            // 添加外部轮廓圆
            let OUTER_R = 30; // 外部圆 半径 长度
            groups.append("circle").attr("class", "outer_node");//每个组中都添加一个 圆 子元素，属性是outer_node;
    
            svg.selectAll(".outer_node") // 选择所有的外部轮廓圆，对其属性设置。
                    .data(option.node_data)
                    .attr("r", OUTER_R)
                    .attr("class", function (d, i) {
                        return "outer_node" + " ingroup_out_" + d.id + "   outer_circle_nodes"
                    })
                    .style("stroke", "#e0f0e9")
                    .style("stroke-width", 11)
                    .style("opacity", 0.7)
                    .classed("pie_display", true);
    
            // 添加内部圆
            let INNER_R = 25; // 内部圆 半径 长度
            groups.append("circle").attr("class", "inner_node"); //每个组再次添加一个子元素，属性是 inner_node
    
            svg.selectAll(".inner_node")// 选择所有的内部圆，对其属性设置。
                    .data(option.node_data)
                    .attr("r", INNER_R)
                    .attr("class", function (d, i) {
                        return "inner_node" + " ingroup_inne_" + d.id + "   inner_circle_nodes"
                    })
                    .attr("fill", function (d, i) {
                        return node_color[d.data.labels[0]]
                    })
                    .attr("id", function (d, i) {
                        return d.id
                    })
                    .call(drag)
                    .on("mouseover", function (d, i) {  // 鼠标覆盖，显示外部轮廓圆
                        let curr_id = ".ingroup_out_" + d.id;
                        let out_node = svg.select(curr_id).classed("pie_display", false);
    
                    })
                    .on("mouseout", function (d, i) { // 鼠标离开，隐藏外部轮廓圆
                        let curr_id = ".ingroup_out_" + d.id;
                        let out_node = svg.select(curr_id).classed("pie_display", true);
                    })
                    .on("click", function (d, i) { // 单击 清除所有的显示状态的三瓣式圆环，只显示本节点的 三瓣式 圆环
                        let pie_id = ".ingroup_pie_" + d.id;
                        svg.selectAll("use").classed("pie_display", true);
                        let pie_node = svg.select(pie_id).classed("pie_display", false);
                    })
                    .on("dblclick", function (d, i) {  // 扩展 本节点
                        alert(d.id);
                        /* todo: 实现扩展方法
                         * */
                    });
            // 添加 节点上的 文字
            groups.append("text").attr("class", "text_nodes"); //每个节点组添加一个 文字 子元素
            let FONT_SIZE = 12;  // 节点文字的大小
            svg.selectAll(".text_nodes")
                    .data(option.node_data)
                    .attr("class", "text_nodes")
                    .attr("fill", "black")
                    .text(function (d, i) {
                        return d.data.property.name
                    })
                    .style("font-size", FONT_SIZE)
                    /* 以下动作和内部圆动作一致，因为如果不给它添加这些相同的动作，当鼠标处于这些文字时，上述定义的内部圆上的动作都会失效*/
                    .call(drag)
                    .on("mouseover", function (d, i) {
                        let curr_id = ".ingroup_out_" + d.id;
                        let out_node = svg.select(curr_id).classed("pie_display", false);
                    })
                    .on("mouseout", function (d, i) {
                        let curr_id = ".ingroup_out_" + d.id;
                        let out_node = svg.select(curr_id).classed("pie_display", true);
                    })
                    .on("click", function (d, i) {
                        let pie_id = ".ingroup_pie_" + d.id;
                        svg.selectAll("use").classed("pie_display", true);
                        let pie_node = svg.select(pie_id).classed("pie_display", false);
                    })
                    .on("dblclick", function (d, i) {
                        alert(d.id)
                    });
    
            /*----节点组 中添加子元素----结束-------------*/
    
    
        }

        update_view(option.node_data, option.node_links);
    },
    // 事件方法
    nodeClick: function () {

    },

    // 鼠标移入事件方法
    nodeHover: function () {

    }
};