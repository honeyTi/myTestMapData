
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
              nodeRadius = data.nodeRadius,
              nodes = data.data.nodes,
              nodeRelationships = data.data.nodeRelationships;
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
            var n = appendNode();

           // appendRingToNode(n);
            
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
            return svgNodes.selectAll('g')
                        .data(nodes)
                        .enter()
                        .append('g')
                        .attr('class','node')
                        .append('circle')
                        .attr('fill','#e4393c')
                        .attr('r', '20')
                        .append('text');
        }
        function appendOutlineToNode(){
            return svgNodes.selectAll('.node') 
                .append('circle')
                .attr('class', 'ring')
                .attr('r', function (d) {
                    return 25;
                })
                .append('title').text("ring");
        }
        function appendTextToNode(n){}
        function appendImageToNode(n){}
        appendGraph(d3.select(container));
        appendNodeToGraph();
    },

// 事件方法
    nodeClick: function () {
        
    },

// 鼠标移入事件方法
    nodeHover: function () {

    }
};