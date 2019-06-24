document.querySelector('#pic').addEventListener('change', function(e) {
	handle(this.files[0]);
});


var canvas = document.createElement('canvas');
//document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
var codeText;// = [];
var zip;// = new JSZip();

var sizes = [
	{w: 16},
	{w: 38},
	{w: 64},
	{w: 96, p: 16},
	{w: 512}
];

function handle(img) {
	codeText = [];
	zip = new JSZip();
	loadImage(img);
}

function loadImage(img) {
	console.log('loa', codeText, zip);
	var oldImgEl = new Image();
	oldImgEl.src = window.URL.createObjectURL(img);
	oldImgEl.id = img.name;
	oldImgEl.addEventListener('load', function(e){
		drawLoop(oldImgEl);
	});
}

function clear() {
	//https://www.codeproject.com/Articles/194951/Canvas-Animation-and-Web-Worker
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw(img, options) {
	var size = options.w;
	var padding = defaultFor(options.p, 0);
	//console.log(options, size, padding);
	
	clear();
	
	canvas.width = size + 2*padding;
	canvas.height = size + 2*padding;
	ctx.drawImage(img, padding, padding, size, size);
}

function drawLoop(img) {
	for (var index in sizes) {
	//console.log(sizes[size]);
		draw(img, sizes[index]);
		addTextAndSaveImg(sizes[index]);
	}
	
	saveAll();
}
//https://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function/894877#894877
function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }

function addTextAndSaveImg(options) {
	var size = options.w + 2*defaultFor(options.p, 0);
	var filename = 'icons/icon' + size + '.png';
	var text = '"' + size + '": "' + filename + '"';
	codeText.push(text);
	
	var savable = canvas.toDataURL();
	
	//https://stackoverflow.com/questions/15287393/saving-an-image-from-canvas-in-a-zip
	zip.file(filename, savable.substr(savable.indexOf(',')+1), {base64: true});
}

function saveAll() {
	var code = '"icons": {\n\t' + codeText.join(',\n\t') + '\n}';
	zip.file('code.txt', code);
	zip.generateAsync({type:'blob'})
	.then(function (blob) {
		saveAs(blob, 'icons.zip');
	}).catch(function (error) {
		console.log(error);
	});
}

var dropbox = document.querySelector('.container');

dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
dropbox.addEventListener("dragleave", dragleave, false);

function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
	dropbox.classList.add('animated');
}

function dragleave(e) {
	e.stopPropagation();
	e.preventDefault();
	dropbox.classList.remove('animated');
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();
	dropbox.classList.remove('animated');

	var dt = e.dataTransfer;
	var files = dt.files;
	handle(files[0]);
}