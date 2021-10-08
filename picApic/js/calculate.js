//canvas图像的宽高 
var c_w = 400; var c_h = 300;

//加载img图像
function loadImg(){
 	var img = document.getElementById("scream");
 	var file = document.querySelector('input[type=file]').files[0];
 	if(!/image\/\w+/.test(file.type)){
 		alert("文件必须为图片！");
 		return false;
 	}
 	var reader = new FileReader();
	
 	reader.addEventListener("load", function () {img.src = reader.result;}, false);
 	if(file) {
 		reader.readAsDataURL(file);
 		loadCanvas(img);
 		}
	
	//计算图片的大小和像素
	alert('图片大小为:'+file.size+'kb\n像素:'+img.width+' X '+img.height+'(px)');
}
//加载canvas图像
function loadCanvas(img){
 		var c=document.getElementById("canvas");
 		var ctx=c.getContext("2d");
		
 		img.onload = function() {
 		ctx.drawImage(img,0,0,c_w,c_h);
 		} 
 }
	

//计算灰度（亮度、明度）
function CalculateGray(){
	var c=document.getElementById("canvas");  
    var ctx=c.getContext("2d");
	var imgData = ctx.getImageData(0,0,c_w,c_h);      //获取图像矩阵
	var gray = 0;
	for (var i = 0 ; i < imgData.data.length ; i+=4){      //遍历图像矩阵
	   var R = imgData.data[i]; //R(0-255)
	   var G = imgData.data[i+1]; //G(0-255)
	   var B = imgData.data[i+2]; //G(0-255)
	   var Alpha = imgData.data[i+3]; //Alpha(0-255)
	   //浮点算法
	   gray += R*0.299 + G*0.587 + B*0.114;
	  }
	window.alert(gray/imgData.data.length);
  //document.getElementById("Brightness").innerHTML = "该图片的亮度值是：" + gray/imgData.data.length;
}

//计算透明度
 function CalculateAlpha(){
 	 var c=document.getElementById("canvas");
 	 var ctx=c.getContext("2d");
 	 var imgData = ctx.getImageData(0,0,c_w,c_h);
 	 var sum = 0;
 	 for (var i = 0 ; i < imgData.data.length ; i+=4){
 	    var R = imgData.data[i]; //R(0-255)
 	    var G = imgData.data[i+1]; //G(0-255)
 	    var B = imgData.data[i+2]; //G(0-255)
 	    var Alpha = imgData.data[i+3]; //Alpha(0-255)
	    sum += Alpha;
 	  }
 	  window.alert(sum/imgData.data.length);
 	 
 }
 
//将图像转为灰度图
function Convert256toGray(){
    var c=document.getElementById("canvas");
    var ctx=c.getContext("2d");
    var imgData = ctx.getImageData(0,0,c_w,c_h);
    for (var i=0;i<imgData.data.length;i+=4){
       var R = imgData.data[i]; //R(0-255)
       var G = imgData.data[i+1]; //G(0-255)
       var B = imgData.data[i+2]; //G(0-255)
       var Alpha = imgData.data[i+3]; //Alpha(0-255)
       //浮点算法
       var gray = R*0.299 + G*0.587 + B*0.114;
    //整数算法
   //  var gray = (R*299 + G*587 + B*114 + 500) / 1000;　
    //移位算法
   //  var gray =(R*76+G*151+B*28)>>8;
  //平均值算法
  //   var gray = (R+G+B)/3;
  //仅取绿色
   //  var gray=G;
    imgData.data[i] = gray;
    imgData.data[i+1] = gray; 
    imgData.data[i+2] = gray; 
    imgData.data[i+3] = Alpha; 
  }
 ctx.putImageData(imgData,0,0);
 }
 
 
 
//调整图片亮度、明度
 function AdjustBrightness(){
   var a = 1;
   var b = document.getElementById("Brightness").value;   //获取用户输入的数据
   
   var c_old = document.getElementById("canvas");
   var c_oldtx = c_old.getContext("2d");
   var imgData = c_oldtx.getImageData(0,0,c_w,c_h);       //获取图像矩阵
   
   //var c_new = document.getElementById("canvas");
   //var ctx = c_new.getContext("2d");
   
   var img = imgData;
   for (var i=0;i<img.data.length;i+=4){
     var R = img.data[i]; //R(0-255)
     var G = img.data[i+1]; //G(0-255)
     var B = img.data[i+2]; //G(0-255)
 
     img.data[i] = R * a + b;
     img.data[i+1] = G * a + b;
     img.data[i+2] = B * a + b; 
   }
    c_oldtx.putImageData(img,0,0);
}
  
 
 