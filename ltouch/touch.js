/*Author:jax.li;Date:2018-01-18* */
ltouch = {
	"elem": null,
	"typeList": "left,right",
	"type": "",
	"startX": 0,
	"startY": 0,
	"moveEndX": 0,
	"moveEndY": 0,
	"X": 0,
	"Y": 0,
	"minDistance": 40, //最低滑动距离
	"callbackLeft": null,
	"callbackRight": null,
	"on": function(elem, type, callback) {
		if(elem.indexOf("#") != -1) {
			this.elem = document.getElementById(elem.replace("#", "")) ? [document.getElementById(elem.replace("#", ""))] : [];
		} else if(elem.indexOf(".") != -1) {
			this.elem = document.getElementsByClassName(elem.replace(".", ""));
		}
		if(!this.elem.length) {
			return false
		}
		this.type = this.typeList.indexOf(type) != -1 ? type : null;
		if(!this.type) {
			return false
		}
		this.type == "left" ? this.callbackLeft = callback : this.callbackRight = callback;
		//滑动开始
		for(var i = 0; i < this.elem.length; i++) {
			if(!this.elem[i].ontouchstart) {
				this.elem[i].ontouchstart = function(e) {
					this.startX = e.touches[0].pageX;
					this.startY = e.touches[0].pageY;
					//防止点击事件时touchmove没有触发导致不能获取正确的X,Y
					this.X = 0;
					this.Y = 0;
				}.bind(this)
			}
		}
		//滑动中
		for(var j = 0; j < this.elem.length; j++) {
			if(!this.elem[j].ontouchmove) {
				this.elem[j].ontouchmove = function(e) {
					this.moveEndX = e.touches[0].pageX;
					this.moveEndY = e.touches[0].pageY;
					this.X = this.moveEndX - this.startX;
					this.Y = this.moveEndY - this.startY;
					if(Math.abs(this.X) > Math.abs(this.Y)) { //如果是在x轴中滑动，防止屏幕不能滚动
						e.preventDefault();
					}
				}.bind(this)
			}
		}
		//滑动结束
		for(var z = 0; z < this.elem.length; z++) {
			this.elem[z].ontouchend = function(e) {
				//右滑
				if(this.X > 0 && Math.abs(this.X) > this.minDistance && Math.abs(this.X) > Math.abs(this.Y)) {
					this.callbackRight(e);
				//左滑
				} else if(this.X < 0 && Math.abs(this.X) > this.minDistance && Math.abs(this.X) > Math.abs(this.Y)) {
					this.callbackLeft(e);
				}
			}.bind(this)
		}
	}
}