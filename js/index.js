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
}
thisState = objMonitor(thisState);

let dataMapBackFloor = dataMapBack[thisState.Floor];
let dataMaplayerFloor = dataMaplayer[thisState.Floor];

//备注区域
//anMiteImage('image/Other07.png',dataMaplayer,14,0,cxt);          //绘制青草地
//anMiteImage('image/Event01-Wall01.png',dataMaplayer,1,1,cxt);    //绘制石头墙
//anMiteImage('image/Event01-Wall01.png',dataMaplayer,2,3,cxt);    //绘制土墙
//anMiteImage('image/Actor01-Braver01.png',dataMaplayer,1,8,cxt);  //绘制英雄
//anMiteImage('image/Actor01-Braver17.png',dataMaplayer,1,5,cxt);  //绘制精灵
//anMiteImage('image/Item01-01.png',dataMaplayer,3,7,cxt);         //绘制红色钥匙
//anMiteImage('image/Event01-Door01.png',dataMaplayer,3,17,cxt);   //绘制红色门
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
    },{ //土墙:3
        num: 2,
        code: 3,
        url: 'image/Event01-Wall01.png',
    },{ //英雄:8
        num: 1,
        code: 8,
        url: 'image/Actor01-Braver01.png',
    },{ //精灵:5
        num: 1,
        code: 5,
        url: 'image/Actor01-Braver17.png',
    },{ //上楼:14
        num: 10,
        code: 14,
        url: 'image/Item01-10.png',
    },{ //下楼:15
        num: 7,
        code: 15,
        url: 'image/Item01-10.png',
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
        case 9:{
            heroMoveEven(x,y,9,8);
            Init();
            break;
        }
        case 5:{
            alern('哈喽，勇士！欢迎来到崭新的世界哦!');
            dataMaplayerFloor[heroIndex.y + y][heroIndex.x + x] = 9;
            clearLayer(heroIndex.x + x,heroIndex.y + y,context);  //英雄移动过后清除英雄轨迹
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