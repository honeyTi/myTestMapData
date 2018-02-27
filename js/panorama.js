
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
        let svg, svgScale, svgTranslate, svgRelationships, svgNodes, node, layout, relationship;

        //方法的定义
        function update_view(dataset, linkset) {
            
            
            var links = [];
            if (linkset.length > 0) {
                //if (typeof(linkset[0]["source"]) == "string") {
                    linkset.forEach(function (e) {
                        var sourceNode = dataset.filter(function (d) {
                            return e.source == d.id
                        })[0];
                        var targetNode = dataset.filter(function (d) {
                            return e.target == d.id
                        })[0];
                        e.source = sourceNode;
                        e.target = targetNode;
                    });
                    links =  linkset;
                console.log(links);
            }
        }

        // 监听每帧的变化
        update_view(nodes, nodeRelationships);
    },

// 事件方法
    nodeClick: function () {
        
    },

// 鼠标移入事件方法
    nodeHover: function () {

    }
};