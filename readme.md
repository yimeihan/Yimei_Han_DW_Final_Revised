# Canvas Animation

I use the canvas to turn the elephant image into particles and make them interact with the mouse.
For this project, I created html, css, and JavaScript files.
In the index.html I only need to link the stylesheet and JavaScript files. Also create canvas element with an ID of canvas. Everything else were created in the JS file.

The image I am using is 100x100px png. Then I dragged it into online png to base64 converter to get a base64-encoded string. Then copy the string to my JS file.

Next step is to draw the image, get the data from the scene and finally clearing it. To get the data we will use the getImageData method from the Canvas API. This method returns an object with an array in it that contains four values for each pixel: one for each RGB color and one for Alpha.

``` js
function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageWidth);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
```
I need to store these values in separate variables, because I want particles to rememberer their initial position in the image before we move them around as they interact with the mouse.

``` js
class Particle{
    constructor(x, y, color){
        this.x = x + canvas.width/2 - png.width * 2;
        this.y = y + canvas.height/2 - png.height * 2;
        this.color = color,
        this.size = 2,
        this.baseX = x + canvas.width/2 - png.width * 2;
        this.baseY = y + canvas.height/2 - png.height * 2;
        this.density = (Math.random() * 10) + 2;
    }
}
```

To center the image by adding canvas width divided by 2 minus png.width which is the width of the image, times two. Then do the same for Y.

``` js
	this.x = x + canvas.width/2 - png.width * 2;
    this.y = y + canvas.height/2 - png.height * 2;
```

The density will be a random number between 2 and 12, which will define how fast the particles move away from the mouse. Some will be heavy and move slower, some will be light and fly away from the mouse fast.

``` js
this.density = (Math.random() * 10) + 2;
```

The update method is where I calculate particles movement and mouse interaction.

``` js
update() { ctx.fillStyle = this.color; }
```

To know if the particles are close enough to the mouse to start interacting I need collision detection.
``` js
	    let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
```
Next declare another function call it init. To extract position and color information from image data object and store it in particle array.

``` js
	function init() { particleArray = []; }
```
To select the pixels I need, I will loop through the Y and the X axis of the image. I check if it's four value is over than 128, the average value. Each value is between 0 and 255. If the Alpha is over 128, I push the pixel into my particles array.

``` js
	for (let y = 0, y2 = data.height; y < y2; y++) {
        for (let x = 0, x2 = data.width; x < x2; x++){
            if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128){
                let positionX = x;
                let positionY = y;
                let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                                     data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                                     data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color));
                }
```

Because the image I use is 100x100px but I want them appear larger on the canvas, so I multiply X and Y by 4, so I get 400 times 400 pixel image. 

``` js
    particleArray.push(new Particle(positionX * 4, positionY * 4, color);
```
In order to create the animation loop I create a function call animate and pass its own name as an argument.

``` js
 	function animate(){ requestAnimationFrame(animate); }
```

Next create a for loop to iterate over a particle array, which is full of particle object. Each of these objects was created with particle class. So they all have access the custom update method.

``` js
 	for (let i = 0; i < particleArray.length; i++){ particleArray[i].update();}
```

To make the canvas size not stretches each time I resize the canvas so I need to create event listener for resize event and every time the event gets triggered call back function will run.

``` js
	window.addEventListener('resize',
        function(){
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });
```

Then we paste the png code to png.src

``` js
	const png = new Image();
	png.src = ""
```

Lastly I create event listener for load event. This code will run only after my image has been fully loaded.

``` js
	window.addEventListener('load', () => {
    		console.log('page has loaded');
    		ctx.drawImage(png, 0, 0);
    		drawImage();
	});
```
