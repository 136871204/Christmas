const Player = require('Player');
const Star = require('Star');
const luobo = require('luobo');
const zhadan = require('zhadan');
const yuebing = require('yuebing');

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: Player
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 得分音效资源
        explosionAudio: {
            default: null,
            url: cc.AudioClip
        },
        
        btnNode: {
            default: null,
            type: cc.Node
        },
        overview: {
            default: null,
            type: cc.Node
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        controlHintLabel: {
            default: null,
            type: cc.Label
        },
        keyboardHint: {
            default: '',
            multiline: true
        },
        touchHint: {
            default: '',
            multiline: true
        },
        luobo: {
            default: null,
            type: cc.Prefab
        },
        zhadan: {
            default: null,
            type: cc.Prefab
        },
        yuebing: {
            default: null,
            type: cc.Prefab
        },
        //倒计时60秒
        timesDisplay: {
            default: null,
            type: cc.Label
        },
        
        
    },

    // use this for initialization
    onLoad: function () {
        this.gameOverNode.active = false;
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        
        // store last star's x position
       // this.currentStar = null;
        //this.currentStarX = 0;
        
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        
        // is showing menu or running game
        this.isRunning = false;
        
        // initialize control hint
        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;
        
        // initialize star and score pool
        //this.starPool = new cc.NodePool('Star');
        //this.scorePool = new cc.NodePool('ScoreFX');
    },
    
    onStartGame: function () {
        
        // 初始化计分
        this.resetScore();
        // set game state to running
        this.isRunning = true;
        // set button and gameover text out of screen
        this.btnNode.setPositionX(3000);
        this.gameOverNode.active = false;
        this.overview.active=false;
        // reset player position and move speed
        this.player.startMoveAt(cc.p(0, this.groundY));
        // spawn star
        //this.spawnNewStar();
        
        this.times = 60;//定义倒计时60秒
        this.schedule(this.updateOne, 1);   //1秒更新一次
        this.schedule(this.updateLuobo, 1.7);   //每XX秒钟更新一个萝卜
        this.schedule(this.updateYuebing, 3);   //每xx秒钟更新一个月饼
        this.schedule(this.updateZhadan, 2.7);   //每XX秒钟更新一个炸弹
    },
    
    //每秒钟更新
    updateOne:function(dt)
    {
        this.times -= 1;
        this.timesDisplay.string =  this.times.toString();
        
        //判断时间是否结束
        if(this.times <= 0)
        {
            this.gameOver();//
        }
       
    },
    //每XX秒钟更新一个萝卜
    updateLuobo:function(dt)
    {
       var tmpluobo = this.NewLuobo();
    },
    //每xx秒钟更新一个月饼
    updateYuebing:function(dt)
    {
       var tmpyuebing = this.NewYuebing();
    },
    //每XX秒钟更新一个炸弹
    updateZhadan:function(dt)
    {
       var tmpzhadan = this.NewZhadan();
    },
    
    //创建萝卜
    NewLuobo: function() {
          // 使用给定的模板在场景中生成一个新节点
        var newluobo = cc.instantiate(this.luobo);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newluobo,88);
        // pass Game instance to star
        newluobo.getComponent('luobo').init(this);
        // 为xx设置一个随机位置
        newluobo.setPosition(this.getNewStartPosition());
        var moveto = cc.moveTo(3.8, cc.p(newluobo.getPositionX(), -this.node.height/2 - 50));
        var finish = cc.callFunc(newluobo.removeFromParent, newluobo);
        var myAction = cc.sequence(moveto, finish);
        //return newluobo;
        newluobo.runAction(myAction);
    },
    //创建月饼
    NewYuebing: function() {
          // 使用给定的模板在场景中生成一个新节点
        var newyuebing = cc.instantiate(this.yuebing);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newyuebing,88);
        // pass Game instance to star
        newyuebing.getComponent('yuebing').init(this);
        // 为xx设置一个随机位置
        newyuebing.setPosition(this.getNewStartPosition());
        var moveto = cc.moveTo(2.3, cc.p(newyuebing.getPositionX(), -this.node.height/2 - 50));
        var finish = cc.callFunc(newyuebing.removeFromParent, newyuebing);
        var myAction = cc.sequence(moveto, finish);

        newyuebing.runAction(myAction);
    },
    //创建炸弹
    NewZhadan: function() {
          // 使用给定的模板在场景中生成一个新节点
        var newzhadan = cc.instantiate(this.zhadan);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newzhadan,88);
        // pass Game instance to star
        newzhadan.getComponent('zhadan').init(this);
        // 为xx设置一个随机位置
        newzhadan.setPosition(this.getNewStartPosition());
        var moveto = cc.moveTo(3.3, cc.p(newzhadan.getPositionX(), -this.node.height/2 - 50));
        var finish = cc.callFunc(newzhadan.removeFromParent, newzhadan);
        var myAction = cc.sequence(moveto, finish);
        newzhadan.runAction(myAction);
    },
    
    //动态生成坐标
    getNewStartPosition: function () {
        // 随机得到一个物品的 y 坐标
        var randX = cc.random0To1() * 400 - 180;
        //var randX = 100;
        // 根据屏幕宽度，随机得到一个物品 x 坐标
        var randY = this.node.height/2 + 100;
        //cc.log("物品创建坐标"+cc.p(randX, randY));
        // 返回坐标
        return cc.p(randX, randY);
    },
    
    addScore: function(tmpscore)
    {
        this.score += tmpscore;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放特效
        //var fx = this.spawnScoreFX();
        // 播放得分音效
        if(tmpscore<0)
        {
            cc.audioEngine.playEffect(this.explosionAudio, false);
        }else
        {
            cc.audioEngine.playEffect(this.scoreAudio, false);
        }
        
        
    },
    
    
    /*spawnNewStar: function() {
        var newStar = null;
        // 使用给定的模板在场景中生成一个新节点
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this); // this will be passed to Star's reuse method
        }else {
            newStar = cc.instantiate(this.starPrefab);
        }
        
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // pass Game instance to star
        newStar.getComponent('Star').init(this);
        // start star timer and store star reference
        this.startTimer();
        this.currentStar = newStar;
    },*/
    
    
    
    /*despawnStar (star) {
        this.starPool.put(star);
        this.spawnNewStar();
    },*/
    
    /*startTimer: function () {
        // get a life duration for next star
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },*/
    
    /*getNewStarPosition: function () {
        // if there's no star, set a random x pos
        if (!this.currentStar) {
            this.currentStarX = cc.randomMinus1To1() * this.node.width/2;
        }
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;
        // 根据屏幕宽度和上一个星星的 x 坐标，随机得到一个新生成星星 x 坐标
        var maxX = this.node.width/2;
        if (this.currentStarX >= 0) {
            randX = -cc.random0To1() * maxX;
        } else {
            randX = cc.random0To1() * maxX;
        }
        this.currentStarX = randX;
        // 返回星星坐标
        return cc.p(randX, randY);
    },
    
    gainScore: function (pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放特效
        //var fx = this.spawnScoreFX();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },*/
    
    /*spawnScoreFX: function () {
        var fx;
        if (this.scorePool.size() > 0) {
            //fx = this.scorePool.get();
        }
    },*/
    
     resetScore: function () {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },
    

    /*update: function (dt) {
        if (!this.isRunning) return;
        
        
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },*/
    
    gameOver: function () {
        this.unscheduleAllCallbacks();
        //this.gameOverNode.active = true;
        this.overview.active=true;
        
        this.player.enabled = false;
        this.player.stopMove();
        //this.currentStar.destroy();
        this.isRunning = false;
        this.btnNode.setPositionX(0);
        this.btnNode.y=-150;
    },
});
