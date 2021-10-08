//读取照片
document.getElementById("file1").onchange=function(){
				//1 创建文件读取对象
				var reader=new FileReader();
				
				//文件存储在file表单元素的files属性中，它是一个数组
				//没有返回值，但是读取完毕后，将读取结果存储在对象的result中
				var fil=document.getElementById("file1").files;
				reader.readAsDataURL(fil[0]);
				reader.readas
				//当读取成功后触发
				reader.onload=function(){
					var url = reader.result;
					$("#image").css("background-image", "url(" + url + ")");
					var imageObj = new Image();
					//imageObj.src = "https://i.loli.net/2021/10/08/bjZvApBqTz3owIR.jpg";
					imageObj.src = reader.result;
					imageObj.onload = function(){
						w = imageObj.width;
						h = imageObj.height;
						var canvas = document.createElement('canvas');
										
						// Size the canvas to the element
						canvas.width = w;
						canvas.height = h;
										
						// Draw image onto the canvas
						var ctx = canvas.getContext('2d');
						ctx.drawImage(imageObj, 0, 0);

						var imgData = ctx.getImageData(0, 0, w, h);
						CalculateGray(imgData);
						
				    };
				};
								
};
//计算亮度、灰度
function CalculateGray(imgData){
	var gray = 0;
	for (var i = 0 ; i < imgData.data.length ; i+=4){      //遍历图像矩阵
	   var R = imgData.data[i]; //R(0-255)
	   var G = imgData.data[i+1]; //G(0-255)
	   var B = imgData.data[i+2]; //G(0-255)
	   var Alpha = imgData.data[i+3]; //Alpha(0-255)
	   //浮点算法
	   gray += R*0.299 + G*0.587 + B*0.114;
	  }
	alert(gray/imgData.data.length);
}
//计算透明度
 function CalculateAlpha(imgData){
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

$(function() {
    $("#reset").click(function() {

        $("#grayscale").val(0);
        $("#blur").val(0);
        $("#brightness").val(100);
        $("#contrast").val(100);
        $("#huerotate").val(0);
        $("#invert").val(0);
        $("#opacity").val(100);
        $("#saturate").val(1);
        $("#sepia").val(0);
        $("#image").css("-webkit-filter", "none");
        $("#image").css("-moz-filter", "none");
    });
});

$(document).ready(function() {


    $("input").on("input", function() {
        var grayscale = $("#grayscale").val(),
            blur = $("#blur").val(),
            brightness = $("#brightness").val(),
            contrast = $("#contrast").val(),
            huerotate = $("#huerotate").val(),
            invert = $("#invert").val(),
            opacity = $("#opacity").val(),
            saturate = $("#saturate").val(),
            sepia = $("#sepia").val();
		

        $("#image").css({
            "-webkit-filter": "grayscale(" + grayscale + "%)" +
                "blur(" + blur + "px)" + "brightness(" + brightness + "%)" +
                " contrast(" + contrast + "%)" +
                " hue-rotate(" + huerotate + "deg)" +
                " invert(" + invert + "%)" +
                " opacity(" + opacity + "%)" +
                " saturate(" + saturate + ")" +
                " sepia(" + sepia + "%)",

            "filter": "grayscale(" + grayscale + "%)" +
                "blur(" + blur + "px)" + "brightness(" + brightness + "%)" +
                " contrast(" + contrast + "%)" +
                " hue-rotate(" + huerotate + "deg)" +
                " invert(" + invert + "%)" +
                " opacity(" + opacity + "%)" +
                " saturate(" + saturate + ")" +
                " sepia(" + sepia + "%)"
        });

    });
	
//放大图片
    $("#image").click(function() {
        $("#image").toggleClass("zoomed");

    });
});