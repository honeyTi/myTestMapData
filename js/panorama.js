
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
        // 页面处理，添加d3元素，增加内容
        function appendGraph(container) {
            svg = container.append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .call(d3.zoom().on('zoom', function () {
                    let scale = d3.event.transform.k,
                        translate = [d3.event.transform.x, d3.event.transform.y];
                }))
        }
    },

// 事件方法
    nodeClick: function () {

    },

// 鼠标移入事件方法
    nodeHover: function () {

    }
};