
var panorama = function (data,type) {
    return panorama.prototype.init(data,type);
};

// panorama 基本属性

panorama.prototype = {
    version: '0.0.1',

// 数据页面获取初始化方法
    init: function (data,type) {
        
        'use strict';
        const container = data.container,
              color = data.color,
              tier = data.tier,
              nodeRadius = data.nodeRadius;
        let mapData = null;
        // 数据获取与判断
        if (type === "neo4jData") {
            mapData = data.data;
        } else {
            
        }
        // 用到的变量
        let svg, svgScale, svgTranslate, svgRelationships, svgNodes, node;
        
        // 页面处理，添加d3元素，增加内容
        function appendGraph(container) {
            console.log('创建画布元素');
            svg = container.append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .call(d3.zoom().on('zoom', function () {
                    var scale = d3.event.transform.k,
                        translate = [d3.event.transform.x, d3.event.transform.y];

                    if (svgTranslate) {
                        translate[0] += svgTranslate[0];
                        translate[1] += svgTranslate[1];
                    }

                    if (svgScale) {
                        scale *= svgScale;
                    }

                    svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
                }))
                .on('dblclick.zoom', null)
                .append('g')
                .attr('width', '100%')
                .attr('height', '100%');
            
            svgRelationships = svg.append('g')
                .attr('class', 'relationships');

            svgNodes = svg.append('g')
                .attr('class', 'nodes');
        }
        function appendNodeToGraph() {
            alert(23857983468934689);
            var n = appendNode();

            appendRingToNode(n);
            
            appendOutlineToNode(n);

            if (data.icons) {
                appendTextToNode(n);
            }

            if (data.images) {
                appendImageToNode(n);
            }

            return n;
        }
        function appendNode() {
            return node.enter()
                .append('g')
                .attr('class', function (d) {
                    var highlight, i,
                        classes = 'node',
                        label = d.labels[0];

                    if (icon(d)) {
                        classes += ' node-icon';
                    }

                    if (image(d)) {
                        classes += ' node-image';
                    }

                    if (data.highlight) {
                        for (i = 0; i < data.highlight.length; i++) {
                            highlight = data.highlight[i];

                            if (d.labels[0] === highlight.class && d.properties[highlight.property] === highlight.value) {
                                classes += ' node-highlighted';
                                break;
                            }
                        }
                    }
                    return classes;
                })
                // .on('click', function (d) {
                //     d.fx = d.fy = null;
                //     var nowRadius = options.radius.baseRadius / Math.pow(options.radius.multiple, (d.level - 1));
                //     //如果用户自己定义了单击事件，则调用用户定义的事件
                //     if (typeof options.onNodeClick === 'function') {
                //         options.onNodeClick(d);
                //     }
                //     //否则执行默认的clickAction方法，显示功能按钮
                //     else return clickAction(this, nowRadius); //设置默认单击事件
                // })
                .call(d3.drag()
                    .on('start', dragStarted)
                    .on('drag', dragged)
                    .on('end', dragEnded));
        }

        function appendRingToNode(n){
            return node.append('circle')
            .attr('class', 'ring')
            .attr('r', function (d) {
                return data.radius.baseRadius / Math.pow(data.radius.multiple, (d.level - 1)) * 1.16;
            })
            .append('title').text(function (d) {
                return toString(d);
            });
        }
        function appendOutlineToNode(n){}
        function appendTextToNode(n){}
        function appendImageToNode(n){}
        function updateNodes() {
            node = svgNodes.selectAll('.node')
            .data(nodes, function (d) {
                return d.id;
            });
            console.log(node);
            var nodeEnter = appendNodeToGraph();
            node = nodeEnter.merge(node);
        }

        appendGraph(d3.select(container));
    },

// 事件方法
    nodeClick: function () {
        
    },

// 鼠标移入事件方法
    nodeHover: function () {

    }
};