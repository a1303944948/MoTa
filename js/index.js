let canvas = d('motaCanvas'),backCanvas = d('motaBackCanvas');
context = canvas.getContext('2d');          //定义layer图层canvas
backContext = backCanvas.getContext('2d');  //定义back图层canvas

let Width = 640,Height = 640;   //定义画布宽度,定义画布高度
canvas.width = Width;           //画布宽度赋值
canvas.height = Height;         //画布高度赋值
backCanvas.width = Width;       //背景画布宽度赋值
backCanvas.height = Height;     //背景画布高度赋值
let img = new Image();

let thisState = {
    Floor: 0,       //楼层
    Level: 1,       //主角级别
    Life: 1000,     //生命值
    Atk: 10,        //攻击力
    Def: 10,        //防御力
    Exp: 0,         //经验值
    Gold: 0,        //金币
    YellowKey: 0,   //黄钥匙
    BlueKey: 0,     //蓝钥匙
    RedKey: 0,      //红钥匙
    GreenKey: 0,    //绿钥匙
    Tips: '你好啊',  //提示语
}
thatState = objMonitor(thisState);
setTimeout(()=>{
    thatState.Tips = '你是不是在这里啊?';
    c('tips')[0].children[0].style.opacity = 1;
},2000);

let dataMapBackFloor = dataMapBack[thatState.Floor];
let dataMaplayerFloor = dataMaplayer[thatState.Floor];

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
    },{ //小刀:51
        num: 1,
        code: 51,
        url: 'image/Item02-06.png',
    },{ //小盾:52
        num: 9,
        code: 52,
        url: 'image/Item02-06.png',
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
function Init(){    //layer层渲染
    clearLayer(heroIndex.x,heroIndex.y,context);  //英雄当前位置清空,防止出现叠模型
    layerArr(dataMaplayerFloor).map((item)=>{
        if(item != 1&&item != 9){
            ElementArr.map((items)=>{
                if(items.code == item){
                    anMiteImage(items.url,dataMaplayerFloor,items.num,item,context);
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
}
function heroMove(x,y){
    switch(dataMaplayerFloor[heroIndex.y + y][heroIndex.x + x]){
        case 9:{    //普通行走
            heroMoveEven(x,y,9,8);
            Init();
            break;
        }
        case 10:{    //碰到精灵事件
            alern('欢迎您，勇士！公主被魔王困于魔塔最上层，只有战胜自我的勇士才可以救出公主，拯救国家与危难之中，我身后有我花费大量法力生成的全部钥匙+1道具，可助您一臂之力，ps：铁剑在第5层、铁盾在第9层，得到它们将助您快速度过游戏前期，加油吧！');
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
        case 21:{   //碰到黄色钥匙
            heroMoveEven(x,y,9,8);
            thatState.YellowKey++;
            Init();
            break;
        }
        case 22:{   //碰到蓝色钥匙
            heroMoveEven(x,y,9,8);
            thatState.BlueKey++;
            Init();
            break;
        }
        case 23:{   //碰到红色钥匙
            heroMoveEven(x,y,9,8);
            thatState.RedKey++;
            Init();
            break;
        }
        case 24:{   //碰到绿色钥匙
            heroMoveEven(x,y,9,8);
            thatState.GreenKey++;
            Init();
            break;
        }
        case 30:{   //碰到所有钥匙+1
            heroMoveEven(x,y,9,8);
            thatState.YellowKey++;
            thatState.BlueKey++;
            thatState.RedKey++;
            thatState.GreenKey++;
            Init();
            break;
        }
        case 25:{
            heroMoveEven(x,y,9,8);
            thatState.YellowKey--;
            Init();
            break;
        }
        case 26:{
            heroMoveEven(x,y,9,8);
            thatState.BlueKey--;
            Init();
            break;
        }
        case 27:{
            heroMoveEven(x,y,9,8);
            thatState.RedKey--;
            Init();
            break;
        }
        case 51:{
            heroMoveEven(x,y,9,8);
            thatState.Atk += 5;
            Init();
            break;
        }
        case 52:{
            heroMoveEven(x,y,9,8);
            thatState.Def += 5;
            Init();
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