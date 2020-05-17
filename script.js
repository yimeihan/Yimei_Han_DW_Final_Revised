const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

let mouse = {
    x: null,
    y: null,
    radius:100
};
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x + canvas.clientLeft/2;
        mouse.y = event.y + canvas.clientTop/2;
});

function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update(){
            ctx.fillStyle = this.color;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if (distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw()
        }
    }
    function init() {
        particleArray = [];

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
            }
        }
    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,.05)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize',
        function(){
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });
}

const png = new Image();
png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAC4jAAAuIwF4pT92AAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDUtMTBUMTY6MjU6MDItMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA1LTEwVDE2OjI2OjI1LTA0OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA1LTEwVDE2OjI2OjI1LTA0OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMyMzYyZDY3LWFhYzUt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";

window.addEventListener('load', () => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0);
    drawImage();
});