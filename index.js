psize = 128;
list = document.getElementById('list');
canvas = document.getElementById('world');
ctx = canvas.getContext('2d');
WIDTH = canvas.width;
HEIGHT = canvas.height;
flgLight = [];
for(i=0;i<WIDTH*HEIGHT;i++){
	flgLight.push(0);
}
bw = document.createElement('canvas');
bw.width = WIDTH;
bw.height = HEIGHT;
bwc = bw.getContext('2d');
bwc.fillRect(0, 0, WIDTH, HEIGHT);
bwc.globalCompositeOperation = "lighter";
bwc.globalAlpha = 0.1;

var json;

function init(){
	json = document.createElement('script');
	json.src='list.json';
	json.onload=function(){
		load();
	}
	document.body.appendChild(json);
}



function load(){
	data.forEach(function(v){
//			for (var i = 0 ; i < lists.length ; i++){
//				lists[i] = lists[i].replace(/[\n\r]/g,"");
//				if (lists[i]!=""){
//					item = document.createElement("div");
//					item.id = "item" + i;
//					item.className = "item";
//					item.textContent = lists[i].replace(/\..+?$/,"");
//					item.setAttribute('onclick',"start('" + lists[i] + "');");
//					//item.innerHTML = '<a onclick="start("'+ lists[i] +'");">'+ lists[i] +'</a>';
//					list.appendChild(item);
//				}
//			}
		item = document.createElement("div");
		item.id = v;
		item.className = "item";
		item.textContent = v.replace(/\..+?$/,"");
		item.setAttribute('onclick',"start('" + v + "');");
		//item.innerHTML = '<a onclick="start("'+ lists[i] +'");">'+ lists[i] +'</a>';
		list.appendChild(item);
	});
}



function start(fn){
	list.style.display = 'none';
	Isback = false;
	Isfront = false;
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	p = new Image();
	p.src=String(psize)+".png";
	back = new Image();
	back.src=fn.replace(/\..+?$/,"") + '_.' + fn.replace(/^.+?\./,"");;
	back.onload = function(){
		bc = document.createElement('canvas');
		bc.width = back.width;
		bc.height = back.height;
		bcc = bc.getContext('2d');
		bcc.drawImage(back,0,0);
		Isback = true;
		Isload();
	}
	front = new Image();
	front.src=fn;
	front.onload = function () {
		fc = document.createElement('canvas');
		fc.width = front.width;
		fc.height = front.height;
		fcc = fc.getContext('2d');
		fcc.drawImage(front,0,0);
		Isfront = true;
		Isload();
	}
	function Isload(){
		if(Isback && Isfront){
			ctx.drawImage(front,0,0);
		}
	}
	flgDrag = false;
	canvas.onmousedown = function(){
		flgDrag = true;
	}
	canvas.ontouchstart = function(){
		flgDrag = true;
		e.preventDefault();
	}
	canvas.onmouseup = function(){
		flgDrag = false;
	}
	canvas.onmousemove = function(e){
		if(flgDrag){
			Light(e.offsetX, e.offsetY);
		}
	}
	canvas.ontouchmove = function(e){
		// e.touches.length // 数
		if(flgDrag){
			Light(event.touches[0].pageX, event.touches[0].pageY);
		}
		e.preventDefault();
	}



	function Light(x,y){
		if (flgLight[y*WIDTH+x] == 0){
			// bwcにアルファマップ作成
			bwc.drawImage(p, x*2-psize/2, y*2-psize/2, psize, psize);
			bwi = bwc.getImageData(x*2-psize/2, y*2-psize/2,psize,psize);
			// 合成処理
			fi = fcc.getImageData(x*2-psize/2, y*2-psize/2, psize, psize);
			bi = bcc.getImageData(x*2-psize/2, y*2-psize/2, psize, psize);
			ci = ctx.getImageData(x*2-psize/2, y*2-psize/2, psize, psize);
			for(i=0;i<psize;i++){
				for(j=0;j<psize;j++){
					k=(j*psize+i)*4;
					a=bwi.data[k];
					b=255-a;
					ci.data[k]=((fi.data[k]*b)+(bi.data[k]*a))/255;
					ci.data[k+1]=((fi.data[k+1]*b)+(bi.data[k+1]*a))/255;
					ci.data[k+2]=((fi.data[k+2]*b)+(bi.data[k+2]*a))/255;
					ci.data[k+3]=((fi.data[k+3]*b)+(bi.data[k+3]*a))/255;
				}
			}
			ctx.putImageData(ci,x*2-psize/2, y*2-psize/2);
			flgLight[y*WIDTH+x]=1;
		}else{
		}
	}
}
