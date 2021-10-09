//读取照片
var qulity = 100;
document.getElementById("file1").onchange = function() {
    //1 创建文件读取对象
    var reader = new FileReader();

    //文件存储在file表单元素的files属性中，它是一个数组
    //没有返回值，但是读取完毕后，将读取结果存储在对象的result中
    var fil = document.getElementById("file1").files;
    reader.readAsDataURL(fil[0]);
    reader.readas
        //当读取成功后触发
    reader.onload = function() {
        var url = reader.result;
        $("#image").css("background-image", "url(" + url + ")");
        var imageObj = new Image();
        //imageObj.src = "https://i.loli.net/2021/10/08/bjZvApBqTz3owIR.jpg";
        imageObj.src = reader.result;
        imageObj.onload = function() {
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
			CalculateAlpha(imgData);
            CalculateContrast(imgData, w);
            CalculateSaturation(imgData);
            CalculateHue(imgData);

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
	var ans = gray/imgData.data.length;
	var location=document.getElementById("grayscale1");
	location.value = parseInt(ans);
	
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
 	  var ans = sum/imgData.data.length;
	  var location=document.getElementById("blur1");
	  location.value = parseInt(ans);
 }
 
//提取主颜色
function CalculateHue(imgData) {
    var rgbArray = new Array();
    for (var i = 0; i < imgData.data.length; i += 4) { //遍历图像矩阵
        var R = imgData.data[i]; //R(0-255)
        var G = imgData.data[i + 1]; //G(0-255)
        var B = imgData.data[i + 2]; //G(0-255)
        var Alpha = imgData.data[i + 3]; //Alpha(0-255)
        //浮点算法
        if (Alpha > 125) {
            rgbArray.push([R, G, B, Alpha]);
        }

    }
    console.log(rgbArray);
    GetColor(rgbArray);
};

function GetColor(cube) {
    var maxr = cube[0][0],
        minr = cube[0][0],
        maxg = cube[0][1],
        ming = cube[0][1],
        maxb = cube[0][2],
        minb = cube[0][2];
    for (var i = 0; i < cube.length; i++) {
        if (cube[i][0] > maxr) {
            maxr = cube[i][0];
        }
        if (cube[i][0] < minr) {
            minr = cube[i][0];
        }
        if (cube[i][1] > maxg) {
            maxg = cube[i][1];
        }
        if (cube[i][1] < ming) {
            ming = cube[i][1];
        }
        if (cube[i][2] > maxb) {
            maxb = cube[i][2];
        }
        if (cube[i][2] < minb) {
            minb = cube[i][2];
        }
    }

    if ((maxr - minr) < qulity && (maxg - ming) < qulity && (maxb - minb) < qulity) {
        var r = 0,
            g = 0,
            b = 0;
        for (var i = 0; i < cube.length; i++) {
            r += cube[i][0];
            g += cube[i][1];
            b += cube[i][2];
        }
        var divcolor = document.createElement("div");
        divcolor.style.backgroundColor = "rgba(" + r / (cube.length) + "," + g / (cube.length) + "," + b / (cube.length) + ")";
        divcolor.style.width = "100px";
        divcolor.style.height = "100px";
        var html = document.getElementById("imagecolor");
        html.appendChild(divcolor);
    } else {
        var maxrgb = 0;
        var rgbindex = 0;
        var rgbmiddle = 0;

        if ((maxr - minr) > maxrgb) {
            maxrgb = (maxr - minr);
            rgbmiddle = (maxr + minr) / 2
            rgbindex = 0;
        }
        if ((maxg - ming) > maxrgb) {
            maxrgb = (maxg - ming);
            rgbmiddle = (maxg + ming) / 2;
            rgbindex = 1;
        }
        if ((maxb - minb) > maxrgb) {
            maxrgb = (maxb - minb);
            rgbmiddle = (maxb + minb) / 2;
            rgbindex = 2;
        }

        //排序
        cube.sort(function(x, y) {
            return x[rgbindex] - y[rgbindex];
        });
        var cubea = new Array();
        var cubeb = new Array();
        for (var i = 0; i < cube.length; i++) {
            if (cube[i][rgbindex] < rgbmiddle) {
                cubea.push(cube[i]);
            } else {
                cubeb.push(cube[i]);
            }
        }

        GetColor(cubeb);
        GetColor(cubea);
    }
};
//计算平均饱和度
function CalculateSaturation(imgData) {
    var gray = 0;
    var num = 0;
    var saturation = 0;
    for (var i = 0; i < imgData.data.length; i += 4) { //遍历图像矩阵
        var R = imgData.data[i]; //R(0-255)
        var G = imgData.data[i + 1]; //G(0-255)
        var B = imgData.data[i + 2]; //G(0-255)
        var Alpha = imgData.data[i + 3]; //Alpha(0-255)
        //浮点算法
        num = num + 1;
        var max = Math.max(R, G, B);
        var min = Math.min(R, G, B);
        var delta = (max - min) / 255;
        if (delta > 0) {
            var value = (max + min) / 255;
            var l = value / 2;
            if (l < 0.5) {
                var s = delta / value;
            } else {
                var s = delta / (2 - value);
            }
            saturation = s + saturation;
        }
    }
	var ans = saturation / num;
	var location=document.getElementById("saturate1");
	location.value = parseInt(ans);
};
//计算对比度
function CalculateContrast(imgData, w) {
    var gray = new Array();
    var j = 0;
    var contrast = 0;
    var num = 0;

    for (var i = 0; i < imgData.data.length; i += 4) { //遍历图像矩阵

        var R = imgData.data[i]; //R(0-255)
        var G = imgData.data[i + 1]; //G(0-255)
        var B = imgData.data[i + 2]; //G(0-255)
        var Alpha = imgData.data[i + 3]; //Alpha(0-255)
        //浮点算法
        gray[j] = R * 0.299 + G * 0.587 + B * 0.114;
        j = j + 1;

    }
    var width = w;
    var length = gray.length;

    for (var k = 0; k < length; k += 1) {

        if (k == 0) {
            contrast = contrast + Math.pow(gray[k + 1] - gray[k], 2) + Math.pow(gray[k + width] - gray[k], 2);
            num += 2;


        } else if (k == width - 1) {
            contrast = contrast + Math.pow(gray[k - 1] - gray[k], 2) + Math.pow(gray[k + width] - gray[k], 2);
            num += 2;
        } else if (k == length - width) {
            contrast = contrast + Math.pow(gray[k + 1] - gray[k], 2) + Math.pow(gray[k - width] - gray[k], 2);
            num += 2;
        } else if (k == length - 1) {
            contrast = contrast + Math.pow(gray[k - 1] - gray[k], 2) + Math.pow(gray[k - width] - gray[k], 2);
            num += 2;
        } else if (k % width == 0) {
            contrast = contrast + Math.pow(gray[k + 1] - gray[k], 2) + Math.pow(gray[k + width] - gray[k], 2) + Math.pow(gray[k - width] - gray[k], 2);
            num += 3;
        } else if (k % (width - 1) == 0) {
            contrast = contrast + Math.pow(gray[k - 1] - gray[k], 2) + Math.pow(gray[k + width] - gray[k], 2) + Math.pow(gray[k - width] - gray[k], 2);
            num += 3
        } else if (k > 0 && k < width - 1) {
            contrast = contrast + Math.pow(gray[k + 1] - gray[k], 2) + Math.pow(gray[k - 1] - gray[k], 2) + Math.pow(gray[k + width] - gray[k], 2);
            num += 3;
        } else if (k > (length - width) && k < (length - 1)) {
            contrast = contrast + Math.pow(gray[k + 1] - gray[k], 2) + Math.pow(gray[k - 1] - gray[k], 2) + Math.pow(gray[k - width] - gray[k], 2);
            num += 3;
        } else {
            contrast = contrast + Math.pow(gray[k + 1] - gray[k], 2) + Math.pow(gray[k - 1] - gray[k], 2) + Math.pow(gray[k - width] - gray[k], 2) + Math.pow(gray[k + width] - gray[k], 2);
            num += 4;
        }
    }

	var ans = contrast / num;
	var location=document.getElementById("contrast1");
	location.value = ans;

}

function change1(){ 
      var grayscale = $("#grayscale").val(),
          blur = $("#blur").val(),
          brightness = $("#brightness").val(),
          contrast = $("#contrast").val(),
          huerotate = $("#huerotate").val(),
          invert = $("#invert").val(),
          opacity = $("#opacity").val(),
          saturate = $("#saturate").val(),
          sepia = $("#sepia").val();
		  
      var location1 = document.getElementById("grayscale1"),
	      location2 = document.getElementById("blur1"),
		  location3 = document.getElementById("brightness1"),
		  location4 = document.getElementById("contrast1"),
		  location5 = document.getElementById("hue-rotate"),
		  location6 = document.getElementById("invert1"),
		  location7 = document.getElementById("opacity1"),
		  location8 = document.getElementById("saturate1"),
		  location9 = document.getElementById("sepia1");
	  
      location1.value = parseInt(grayscale); 
	  location2.value = parseInt(blur);
	  location3.value = parseInt(brightness);
	  location4.value = parseInt(contrast);
	  location5.value = parseInt(huerotate);
	  location6.value = parseInt(invert);
	  location7.value = parseInt(opacity);
	  location8.value = saturate;
	  location9.value = parseInt(sepia);
	  
} 

function change2(){
       var location1 = document.getElementById("grayscale1"),
           location2 = document.getElementById("blur1"),
       	   location3 = document.getElementById("brightness1"),
       	   location4 = document.getElementById("contrast1"),
       	   location5 = document.getElementById("hue-rotate"),
       	   location6 = document.getElementById("invert1"),
       	   location7 = document.getElementById("opacity1"),
       	   location8 = document.getElementById("saturate1"),
       	   location9 = document.getElementById("sepia1"); 
		   
	   var grayscale = location1.value,
		   blur = location2.value,
	       brightness = location3.value,
	       contrast = location4.value,
	       huerotate = location5.value,
	       invert = location6.value,
	       opacity = location7.value,
	       saturate = location8.value,
	       sepia = location9.value;
	   
	   $("#grayscale").val(grayscale);
	   $("#blur").val(blur);
	   $("#brightness").val(brightness);
	   $("#contrast").val(contrast);
	   $("#huerotate").val(huerotate);
	   $("#invert").val(invert);
	   $("#opacity").val(opacity);
	   $("#saturate").val(saturate);
	   $("#sepia").val(sepia);
	   
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
		
		var location1 = document.getElementById("grayscale1"),
		    location2 = document.getElementById("blur1"),
				  location3 = document.getElementById("brightness1"),
				  location4 = document.getElementById("contrast1"),
				  location5 = document.getElementById("hue-rotate"),
				  location6 = document.getElementById("invert1"),
				  location7 = document.getElementById("opacity1"),
				  location8 = document.getElementById("saturate1"),
				  location9 = document.getElementById("sepia1");
		
		location1.value = 0; 
		location2.value = 0;
		location3.value = 100;
		location4.value = 100;
		location5.value = 0;
		location6.value = 0;
		location7.value = 100;
		location8.value = 1;
		location9.value = 0;
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