var tmppalyer = require("Player");

cc.Class({
    extends: cc.Component,

    properties: {
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        }
    },

    // use this for initialization
    onLoad: function () {

    },


    // use this for initialization
    init: function (game) {
        this.game = game;
    },
    
    noteBox: function(){
        return this.node.getBoundingBoxToWorld();
    },  
    
    
    onPicked: function() {
        
        var pos = this.node.getPosition();
        // 调用 Game 脚本的得分方法
        this.game.addScore(10);
        
        
        this.node.removeFromParent();
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var hero = cc.find("Canvas/Player").getComponent(tmppalyer);
        
        // 每帧判断和主角之间的距离是否小于收集距离
        if(cc.rectIntersectsRect(hero.node.getBoundingBoxToWorld(), this.noteBox())){
            // 调用收集行为
            this.onPicked();
            return;
        }
    },
});
