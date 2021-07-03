let canvas = d('motaCanvas'),backCanvas = d('motaBackCanvas');
context = canvas.getContext('2d');          //定义layer图层canvas
backContext = backCanvas.getContext('2d');  //定义back图层canvas

let Width = 640,Height = 640;   //定义画布宽度,定义画布高度
canvas.width = Width;           //画布宽度赋值
canvas.height = Height;         //画布高度赋值
backCanvas.width = Width;       //背景画布宽度赋值
backCanvas.height = Height;     //背景画布高度赋值

let thisState = {
    Floor: 0,       //楼层
    Level: 1,       //主角级别
    Hp: 1000,       //生命值
    Atk: 10,        //攻击力
    Def: 10,        //防御力
    Exp: 0,         //经验值
    Gold: 0,        //金币
    YellowKey: 0,   //黄钥匙
    BlueKey: 0,     //蓝钥匙
    RedKey: 0,      //红钥匙
    GreenKey: 0,    //绿钥匙
    Tips: '',       //提示语
    goal: {},       //当前碰触的目标数据
    Monster: {},    //参与战斗的怪物临时属性
    MonsterCode: [],//当前层数怪物Code合集
}
thatState = objMonitor(thisState);

let dataMapBackFloor = dataMapBack[thatState.Floor];    //获取当前层的背景图层数据
let dataMaplayerFloor = dataMaplayer[thatState.Floor];  //获取当前层的渲染图层数据

//备注区域
//anMiteImage('image/Other07.png',dataMaplayer,14,0,cxt);          //绘制青草地
//anMiteImage('image/Event01-Wall01.png',dataMaplayer,1,1,cxt);    //绘制石头墙
//anMiteImage('image/Event01-Wall01.png',dataMaplayer,2,3,cxt);    //绘制土墙
//anMiteImage('image/Actor01-Braver01.png',dataMaplayer,1,8,cxt);  //绘制英雄
//anMiteImage('image/Actor01-Braver17.png',dataMaplayer,1,5,cxt);  //绘制精灵
//anMiteImage('image/Item01-01.png',dataMaplayer,3,11,cxt);         //绘制黄色色钥匙
//anMiteImage('image/Event01-Door01.png',dataMaplayer,3,12,cxt);   //绘制黄色门
//anMiteImage('image/Item01-01.png',dataMaplayer,3,13,cxt);         //绘制蓝色钥匙
//anMiteImage('image/Event01-Door01.png',dataMaplayer,14,17,cxt);   //绘制蓝色门
//anMiteImage('image/Item01-01.png',dataMaplayer,3,15,cxt);         //绘制红色钥匙
//anMiteImage('image/Event01-Door01.png',dataMaplayer,3,16,cxt);   //绘制红色门
//anMiteImage('image/Item01-01.png',dataMaplayer,3,17,cxt);         //绘制所有钥匙+1
//anMiteImage('image/Item01-10.png',dataMaplayer,10,14,cxt);       //绘制上楼
//anMiteImage('image/Item01-10.png',dataMaplayer,7,15,cxt);        //绘制下楼
let ElementArr = [  //元素添加表
    {   //青草地:0
        num: 14,
        code: 0,
        url: 'image/Other07.png',
    },{ //界墙:1
        num: 1,
        code: 1,
        url: 'image/Event01-Wall01.png',
    },{ //地面:2
        num: 1,
        code: 2,
        url: 'image/Other09.png',
    },{ //土墙:3
        num: 2,
        code: 3,
        url: 'image/Event01-Wall01.png',
    },{ //石墙:4
        num: 3,
        code: 4,
        url: 'image/Event01-Wall01.png',
    },{ //英雄:8
        num: 1,
        code: 8,
        url: 'image/Actor01-Braver01.png',
    },{ //精灵:10
        num: 1,
        code: 10,
        url: 'image/Actor01-Braver17.png',
    },{ //上楼:14
        num: 10,
        code: 14,
        url: 'image/Item01-10.png',
    },{ //下楼:15
        num: 7,
        code: 15,
        url: 'image/Item01-10.png',
    },{ //怪物手册:16
        num: 1,
        code: 16,
        url: 'image/Item01-05.png',
    },{ //笔记本:17
        num: 2,
        code: 17,
        url: 'image/Item01-05.png',
    },{ //黄钥匙:21
        num: 1,
        code: 21,
        url: 'image/Item01-01.png',
    },{ //蓝钥匙:22
        num: 2,
        code: 22,
        url: 'image/Item01-01.png',
    },{ //红钥匙:23
        num: 3,
        code: 23,
        url: 'image/Item01-01.png',
    },{ //绿钥匙:24
        num: 4,
        code: 24,
        url: 'image/Item01-01.png',
    },{ //黄色门:25
        num: 1,
        code: 25,
        url: 'image/Event01-Door01.png',
    },{ //蓝色门:26
        num: 2,
        code: 26,
        url: 'image/Event01-Door01.png',
    },{ //红色门:27
        num: 3,
        code: 27,
        url: 'image/Event01-Door01.png',
    },{ //守卫门:28
        num: 4,
        code: 28,
        url: 'image/Event01-Door01.png',
    },{ //监狱门:29
        num: 4,
        code: 29,
        url: 'image/Event01-Wall02.png',
    },{ //所有钥匙+1:30
        num: 5,
        code: 30,
        url: 'image/Item01-01.png',
    },{ //攻击水晶(小):31
        num: 1,
        code: 31,
        url: 'image/Item01-Gem01.png',
        name: '攻击水晶(小)',
    },{ //防御水晶(小):32
        num: 2,
        code: 32,
        url: 'image/Item01-Gem01.png',
        name: '防御水晶(小)'
    },{ //血瓶(小):33
        num: 1,
        code: 33,
        url: 'image/Item01-02.png',
        name: '血瓶(小)',
    },{ //血瓶(中):34
        num: 2,
        code: 34,
        url: 'image/Item01-02.png',
        name: '血瓶(中)',
    },{//金币:35
        num: 1,
        code: 35,
        url: 'image/Item01-11.png',
    },{ //小刀:51
        num: 1,
        code: 51,
        url: 'image/Item02-06.png',
    },{ //小盾:52
        num: 9,
        code: 52,
        url: 'image/Item02-06.png',
    },{ //绿史莱姆:61
        num: 1,
        code: 61,
        url: 'image/Monster01-01.png',
        name: '绿史莱姆',
        atk: 15,
        def: 5,
        hp: 20,
        exp: 1,
        gold: 1,
    },{ //红史莱姆:62
        num: 5,
        code: 62,
        url: 'image/Monster01-01.png',
        name: '红史莱姆',
        atk: 17,
        def: 5,
        hp: 30,
        exp: 2,
        gold: 3,
    },{ //小蝙蝠:63
        num: 1,
        code: 63,
        url: 'image/Monster03-01.png',
        name: '小蝙蝠',
        atk: 25,
        def: 2,
        hp: 30,
        exp: 3,
        gold: 5,
    },{ //蓝法师:64
        num: 1,
        code: 64,
        url: 'image/Monster06-01.png',
        name: '蓝法师',
        atk: 24,
        def: 10,
        hp: 40,
        exp: 5,
        gold: 7,
    },{ //骷髅怪:65
        num: 1,
        code: 65,
        url: 'image/Monster02-01.png',
        name: '骷髅怪',
        atk: 27,
        def: 8,
        hp: 50,
        exp: 7,
        gold: 8,
    },{ //精英骷髅怪:66
        num: 5,
        code: 66,
        url: 'image/Monster02-01.png',
        name: '精英骷髅怪',
        atk: 40,
        def: 15,
        hp: 80,
        exp: 10,
        gold: 15,
    }
]
function StartBack(){   //背景层渲染
    layerArr(dataMapBackFloor).map((item)=>{
        ElementArr.map((items)=>{
            if(items.code == item){
                anMiteImage(items.url,dataMapBackFloor,items.num,item,backContext);
            }
        })
    })
}

let props;
function prop(obj){
    props = creat('div');
    props.className = 'controller_list';
    props.style.backgroundImage = 'url("'+obj.url+'")';
    props.style.backgroundPosition = '-'+obj.data.imageObj.x+'px '+'-'+obj.data.imageObj.y+'px';
    props.onclick = obj.click;
    c('controller')[0].append(props);
}

c('right_panel')[0].onclick = function(){
    this.style.display = 'none';
}

let heroIndex = {}; //定位英雄位置
let heroX,heroY;    //英雄上一次走路使用x，y轴
function heroLocation(){   //定位英雄位置
    for(let i = 0; i < dataMaplayerFloor.length; i++){
        for(let j = 0; j < dataMaplayerFloor[i].length; j++){
            if(dataMaplayerFloor[i][j] === 8){
                heroIndex.x = j;
                heroIndex.y = i;
            }
        }
    }
}
//获取当前地图剩余元素集合
function layerArr(arr){
    let arrs = [];
    arr.map((item)=>{
        item.map((items)=>{
            if(arrs.indexOf(items) == -1){
                arrs.push(items);
            }
        })
    })
    return arrs;
}
let layerArrJson;
function Init(){    //layer层渲染
    clearLayer(heroIndex.x,heroIndex.y,context);  //英雄当前位置清空,防止出现叠模型
    layerArrJson = layerArr(dataMaplayerFloor);
    thatState.MonsterCode = [];
    layerArrJson.map(item => {
        if(item != 1&&item != 9) {
            ElementArr.map(items => {
                if(items.code === item){
                    anMiteImage(items.url,dataMaplayerFloor,items.num,item,context);
                    if(items.hp){
                        thatState.MonsterCode.push(items);
                    }
                    return;
                }
            })
        }
    })
    clearLayer(heroIndex.x-heroX,heroIndex.y-heroY,context);  //英雄移动过后清除英雄轨迹
}
function clearLayer(x,y,ctx){  //清除指定格子内容
    ctx.clearRect(x*32,y*32,32,32);
}
heroLocation(); //定位英雄位置
StartBack();    //渲染背景层
Init();         //渲染laery层

function prev(num){
    thatState.Floor = num;
    dataMapBackFloor = dataMapBack[thatState.Floor];
    dataMaplayerFloor = dataMaplayer[thatState.Floor];
    heroLocation();
    backContext.clearRect(0,0,Width,Height);
    context.clearRect(0,0,Width,Height);
}

//英雄移动事件
function heroMoveEven(x,y,num,hero){
    dataMaplayerFloor[heroIndex.y + y][heroIndex.x + x] = hero;
    dataMaplayerFloor[heroIndex.y][heroIndex.x] = num;
    heroX = x;
    heroY = y;
    heroIndex.x = heroIndex.x + x;
    heroIndex.y = heroIndex.y + y;
    Init();
}

//tips弹窗提示
let Timore;
function tips(text,time){
    clearTimeout(Timore);
    thatState.Tips = text;
    c('tips')[0].children[0].style.opacity = 1;
    Timore = setTimeout(function(){
        c('tips')[0].children[0].style.opacity = 0;
    },time?time:350);
}

//英雄撞击怪物触发战斗
function monsterAttr(num){  //先获取怪物属性
    let hp,monsterHp,result;
    for(let i of ElementArr){
        if(i.code == num){
            thatState.Monster = i;
            monsterHp = i.hp;
            function battle(obj){
                if(thatState.Atk > obj.def){
                    monsterHp = monsterHp - (thatState.Atk - obj.def);
                    hp = obj.atk - thatState.Def > 0?thatState.Hp - (obj.atk - thatState.Def):thatState.Hp;
                    if(monsterHp > 0&&hp > 0){
                        thatState.Hp = hp;
                        battle(obj);
                    }else if(monsterHp > 0 &&hp <= 0){
                        thatState.Hp = hp;
                        tips('勇士倒下了!');
                        result = false;
                    }else{
                        thatState.Gold += obj.gold;
                        thatState.Exp += obj.exp;
                        tips(`勇士获得了胜利! 经验+${obj.exp}、金币+${obj.gold}`);
                        result = true;
                    }
                }else{
                    tips('你无法对该怪物造成伤害!');
                    result = false;
                }
            }
            battle(i);
            return result;
        }
    }
}

//英雄行走触发各类事件
function heroMove(x,y){
    for(let i of ElementArr){   //获取当前碰撞的对象数据
        if(i.code === dataMaplayerFloor[heroIndex.y + y][heroIndex.x + x]){
            thisState.goal = i;
        }
    }
    switch(dataMaplayerFloor[heroIndex.y + y][heroIndex.x + x]){
        case 9:{    //普通行走
            heroMoveEven(x,y,9,8);
            break;
        }
        case 10:{    //碰到精灵事件
            tips('欢迎您，勇士！公主被魔王困于魔塔最上层，只有战胜自我的勇士才可以救出公主，拯救国家与危难之中，我身后有我花费大量法力生成的全部钥匙+1道具，可助您一臂之力，ps：铁剑在第5层、铁盾在第9层，得到它们将助您快速度过游戏前期，加油吧！',4500);
            dataMaplayerFloor[heroIndex.y + y][heroIndex.x + x] = 9;
            clearLayer(heroIndex.x + x,heroIndex.y + y,context);  //英雄移动过后清除英雄轨迹
            break;
        }
        case 14:{   //碰到上楼事件
            prev(thatState.Floor+1);
            StartBack();
            Init();
            break;
        }
        case 15:{   //碰到下楼事件
            prev(thatState.Floor-1);
            StartBack();
            Init();
            break;
        }
        case 16:{
            tips('获得怪物手册，点击左下角对应图标可以查看当前怪物的所有详细信息！',2000);
            heroMoveEven(x,y,9,8);
            prop({
                data: Images(thisState.goal.url,thisState.goal.num),
                url: thisState.goal.url,
                click: function(){
                    c('right_panel')[0].innerHTML = "";
                    let rightPanelItem,div,imageData;
                    log(thisState.MonsterCode);
                    for(let i of thisState.MonsterCode){
                        imageData = Images(i.url,i.num);
                        rightPanelItem = creat('div');
                        rightPanelItem.className = 'right_panel_item';
                        div = creats('div',7);
                        log(imageData);
                        div[0].innerHTML = '<div style="background-image: url('+i.url+');background-position: -'+imageData.imageObj.x+'px -'+imageData.imageObj.y+'px"></div>' +i.name;
                        div[1].innerHTML = '生命：'+i.hp;
                        div[2].innerHTML = '攻击：'+i.atk;
                        div[3].innerHTML = '防御：'+i.def;
                        div[4].innerHTML = '金币：'+i.gold;
                        div[5].innerHTML = '经验：'+i.exp;
                        div[6].innerHTML = '伤害：'+warDamage(thisState.Atk,thisState.Def,i.atk,i.def,i.hp);
                        rightPanelItem.setAppend(div);
                        c('right_panel')[0].append(rightPanelItem);
                    }
                    thisState.MonsterCode;
                    c('right_panel')[0].style.display = 'block';
                }
            });
            break;
        }
        case 17:{
            tips('获得笔记本，纪录所有的NPC对话，点击左下角对应图标即可查看！',2000);
            heroMoveEven(x,y,9,8);
            prop({
                data: Images(thisState.goal.url,thisState.goal.num),
                url: thisState.goal.url,
                click: function(){
                    log(123);
                }
            });
            break;
        }
        case 21:{   //碰到黄色钥匙
            tips('黄色钥匙+1');
            heroMoveEven(x,y,9,8);
            thatState.YellowKey++;
            break;
        }
        case 22:{   //碰到蓝色钥匙
            tips('蓝色钥匙+1');
            heroMoveEven(x,y,9,8);
            thatState.BlueKey++;
            break;
        }
        case 23:{   //碰到红色钥匙
            tips('红色钥匙+1');
            heroMoveEven(x,y,9,8);
            thatState.RedKey++;
            break;
        }
        case 24:{   //碰到绿色钥匙
            tips('绿色钥匙+1');
            heroMoveEven(x,y,9,8);
            thatState.GreenKey++;
            break;
        }
        case 30:{   //碰到所有钥匙+1
            tips('所有钥匙+1');
            heroMoveEven(x,y,9,8);
            thatState.YellowKey++;
            thatState.BlueKey++;
            thatState.RedKey++;
            thatState.GreenKey++;
            break;
        }
        case 25:{   //开启黄色门
            if(thatState.YellowKey>0){
                heroMoveEven(x,y,9,8);
                thatState.YellowKey--;
            }else{
                tips('黄钥匙不足');
            }
            break;
        }
        case 26:{   //开启蓝色门
            if(thatState.BlueKey>0){
                heroMoveEven(x,y,9,8);
                thatState.BlueKey--;
            }else{
                tips('蓝钥匙不足');
            }
            break;
        }
        case 27:{   //开启红色门
            if(thatState.RedKey>0){
                heroMoveEven(x,y,9,8);
                thatState.RedKey--;
            }else{
                tips('红钥匙不足');
            }
            break;
        }
        case 31:{   //吃到攻击水晶(小)
            heroMoveEven(x,y,9,8);
            thatState.Atk += 2;
            tips('攻击力+2');
            break;
        }
        case 32:{   //吃到防御水晶(小)
            heroMoveEven(x,y,9,8);
            thatState.Def += 2;
            tips('防御力+2');
            break;
        }
        case 33:{   //吃到血瓶(小)
            heroMoveEven(x,y,9,8);
            thatState.Hp += 50;
            tips('生命值+50');
            break;
        }
        case 34:{   //吃到血瓶(中)
            heroMoveEven(x,y,9,8);
            thatState.Hp += 200;
            tips('生命值+200');
            break;
        }
        case 35:{   //捡到金币
            heroMoveEven(x,y,9,8);
            thatState.Gold += 100;
            tips('金币+100');
            break;
        }
        case 51:{   //获得小刀
            tips('得到小刀，攻击力+5');
            heroMoveEven(x,y,9,8);
            thatState.Atk += 5;
            break;
        }
        case 52:{   //获得小盾
            tips('得到小盾，防御力+5');
            heroMoveEven(x,y,9,8);
            thatState.Def += 5;
            break;
        }
        case 61:{   //绿史莱姆
            if(monsterAttr(61)){
                heroMoveEven(x,y,9,8);
            }
            break;
        }
        case 62:{   //红史莱姆
            if(monsterAttr(62)){
                heroMoveEven(x,y,9,8);
            }
            break;
        }
        case 63:{   //小蝙蝠
            if(monsterAttr(63)){
                heroMoveEven(x,y,9,8);
            }
            break;
        }
        case 64:{   //蓝法师
            if(monsterAttr(64)){
                heroMoveEven(x,y,9,8);
            }
            break;
        }
        case 65:{   //骷髅怪
            if(monsterAttr(65)){
                heroMoveEven(x,y,9,8);
            }
            break;
        }
        case 66:{   //精英骷髅怪
            if(monsterAttr(66)){
                heroMoveEven(x,y,9,8);
            }
            break;
        }
        default: 
            break;
    }
}
//英雄移动事件
window.onkeydown = function(e){
    switch(e.keyCode){
        case 37:
            heroMove(-1,0);
            break;
        case 38:
            heroMove(0,-1);
            break;
        case 39:
            heroMove(1,0);
            break;
        case 40:
            heroMove(0,1);
            break;
    }
};


//战斗伤害计算方法
function warDamage(heroAtk,heroDef,monsterAtk,monsterDef,monsterHp){
    if(heroAtk > monsterDef){
        let count = 0;
        let settle;
        function war(atk,def,hp){
            if(hp > atk - def){
                hp = hp - atk + def;
                count ++;
                war(atk,def,hp);
            }else{
                settle = (monsterAtk - heroDef)*count;
            }
        }
        war(heroAtk,monsterDef,monsterHp);
        return settle >= 0?settle:0;
    }else{
        return '无法战胜';
    }
}

//绘制时调用方法   url为绘制的对象，arr为数据对象，num为需要渲染的图片序号，number为需要绘制的内容编号，cxt为绘制的画布对象
function anMiteImage(url,arr,num,number,cxt){
    let imageObjectB = Images(url,num);
    imageObjectB.image.onload = function(){
        for(let i = 0; i < arr.length; i++){
            for(let j = 0; j < arr[i].length; j++){
                switch(arr[i][j]){
                    case number:
                        cxt.drawImage(imageObjectB.image,imageObjectB.imageObj.x,imageObjectB.imageObj.y,32,32,32*j,32*i,32,32);
                        break;
                    default: break;
                }
            }
        }
    };
}

//绘制16阵列图案核心算法
function Images(url,num){
    let imageObject = {};
    let imageObj = {};
    let image = new Image();
    image.src = url;
    imageObject.image = image;
    switch(num){
        case 1:
            imageObj.x = 0;
            imageObj.y = 0;
            break;
        case 2:
            imageObj.x = 32;
            imageObj.y = 0;
            break;
        case 3:
            imageObj.x = 64;
            imageObj.y = 0;
            break;
        case 4:
            imageObj.x = 96;
            imageObj.y = 0;
            break;
        case 5:
            imageObj.x = 0;
            imageObj.y = 32;
            break;
        case 6:
            imageObj.x = 32;
            imageObj.y = 32;
            break;
        case 7:
            imageObj.x = 64;
            imageObj.y = 32;
            break;
        case 8:
            imageObj.x = 96;
            imageObj.y = 32;
            break;
        case 9:
            imageObj.x = 0;
            imageObj.y = 64;
            break;
        case 10:
            imageObj.x = 32;
            imageObj.y = 64;
            break;
        case 11:
            imageObj.x = 64;
            imageObj.y = 64;
            break;
        case 12:
            imageObj.x = 96;
            imageObj.y = 64;
            break;
        case 13:
            imageObj.x = 0;
            imageObj.y = 96;
            break;
        case 14:
            imageObj.x = 32;
            imageObj.y = 96;
            break;
        case 15:
            imageObj.x = 64;
            imageObj.y = 96;
            break;
        case 16:
            imageObj.x = 96;
            imageObj.y = 96;
            break;
        default:
            alert('请传入一个数字！');
            break;
    }
    imageObject.imageObj = imageObj;
    return imageObject;
}