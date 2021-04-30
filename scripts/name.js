const canvas1 = document.querySelector('#canvas');
const ctx = canvas1.getContext('2d');
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
let particleArray = [];

//mouse1
let mouse1 = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove', event => {
    mouse1.x = event.x + canvas1.clientLeft/2;
    mouse1.y = event.y + canvas1.clientTop/2;
});
let moveYDown = 8; //переменная для движения вниз отрисовки по Y (не используется, т.к. после 2-3ёх изменений сильно тормозит)
let moveYUp = 8; //переменная для движения вверх отрисовки по Y (не используется, т.к. после 2-3ёх изменений сильно тормозит)

function drawImage() {
    let imageWidth = png.width;
    let imageHeight = png.height;

    const data = ctx.getImageData( 0, 0, imageWidth, imageHeight);

    ctx.clearRect(0, 0, canvas1.width, canvas1.height);

    class Particle {

        constructor(x, y, color, size) {
            this.moveYUp = moveYUp;
            this.moveYDown = moveYDown;
                this.x = x + canvas1.width/2 - png.width * 2,
                this.y = y + canvas1.height/this.moveYUp - png.height *2,
                this.color = color,


                this.size = 1.8,
                this.baseX = x + canvas1.width/2 - png.width * 2,
                this.baseY = y + canvas1.height/this.moveYDown - png.height * 2,
                this.density = (Math.random() * 10) + 2;
        }
        draw() {

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            // collision detection
            let dx = mouse1.x - this.x;
            let dy = mouse1.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            //max distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if (distance < mouse1.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if(this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw();
        }
    }
    function init() {
        particleArray = [];

        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++){
                if(data.data[(y * 4 * data.width) + ( x * 4) + 3] > 128) {
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
    function  animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize', () => {
        canvas1.width = innerWidth;
        canvas1.height = innerHeight;
        init();
    })
}

const png = new Image();
if(innerWidth >= 768) {
    png.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc3IiBoZWlnaHQ9IjI1IiB2aWV3Qm94PSIwIDAgMTc3IDI1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCA0LjQyVjNIMTEuODhWNS41OEw5LjI3IDUuMjJWNC40Mkg0LjFWOC41OEg5LjI3VjcuNzhMMTEuODggNy40MlYxMEgxLjQ5VjQuNDJIMFpNMTMuNjc1OCAxMFYzSDI0LjA2NThWMTBIMTMuNjc1OFpNMTYuMjg1OCA4LjU4SDIxLjQ1NThWNC40MkgxNi4yODU4VjguNThaTTI1LjA2ODQgOC42NVY2Ljg2TDI2LjU1ODQgNi40NlYzSDI5LjE2ODRWNS43NUwzNC4yNzg0IDQuMzdWM0gzNi44ODg0VjUuNDZMMzIuODU4NCA2LjU1TDM1LjIxODQgOC41SDM2Ljk0ODRWMTBIMzMuNjY4NEwzMC4zNzg0IDcuMjFMMjkuMTY4NCA3LjU0VjEwSDI2LjU1ODRWOC4yNUwyNS4wNjg0IDguNjVaTTM4LjY0NjUgMTBWM0g0OS4wMzY1VjEwSDM4LjY0NjVaTTQxLjI1NjUgOC41OEg0Ni40MjY1VjQuNDJINDEuMjU2NVY4LjU4Wk01MC4xMzkxIDEwTDUyLjU3OTEgNC40Mkg1MS4zMzkxVjNINTguMjg5MUw2MS4zMjkxIDEwSDU4LjYyOTFMNTYuMTg5MSA0LjQySDU1LjI4OTFMNTIuODQ5MSAxMEg1MC4xMzkxWk02Mi4zMjgxIDEwVjNINzIuNzE4MVYxMEg2Mi4zMjgxWk02NC45MzgxIDguNThINzAuMTA4MVY0LjQySDY0LjkzODFWOC41OFpNNzMuNzIwNyA0LjQyVjNIODUuNjAwN1Y1Ljc1TDgzLjMxMDcgNi41TDg1LjYwMDcgNy4yNVYxMEg3NS4yMTA3VjQuNDJINzMuNzIwN1pNNzcuODIwNyA4LjU4SDgyLjk5MDdWOC4wN0w4MS4wMjA3IDcuMjFINzcuODIwN1Y4LjU4Wk03Ny44MjA3IDUuNzlIODEuMDIwN0w4Mi45OTA3IDQuOTNWNC40Mkg3Ny44MjA3VjUuNzlaTTkxLjYwMzkgMTBMOTQuMDQzOSA0LjQySDkyLjgwMzlWM0g5OS43NTM5TDEwMi43OTQgMTBIMTAwLjA5NEw5OS4zMzM5IDguMjVIOTUuMDczOUw5NC4zMTM5IDEwSDkxLjYwMzlaTTk1LjY5MzkgNi44M0g5OC43MTM5TDk3LjY1MzkgNC40Mkg5Ni43NTM5TDk1LjY5MzkgNi44M1pNMTAyLjg5MyAxMEwxMDUuMzMzIDQuNDJIMTA0LjA5M1YzSDExMS4wNDNMMTE0LjA4MyAxMEgxMTEuMzgzTDEwOC45NDMgNC40MkgxMDguMDQzTDEwNS42MDMgMTBIMTAyLjg5M1pNMTEzLjI2MiA0LjQyVjNIMTI1LjE1MlY1LjU4TDEyMi41NDIgNS4yMlY0LjQySDExNy4zNzJWNS43OUgxMjEuNjIyVjcuMjFIMTE3LjM3MlY4LjU4SDEyMi41NDJWNy43OEwxMjUuMTUyIDcuNDJWMTBIMTE0Ljc2MlY0LjQySDExMy4yNjJaTTEyNS45NDcgOC42NVY2Ljg2TDEyNy40MzcgNi40NlYzSDEzMC4wNDdWNS43NUwxMzUuMTU3IDQuMzdWM0gxMzcuNzY3VjUuNDZMMTMzLjczNyA2LjU1TDEzNi4wOTcgOC41SDEzNy44MjdWMTBIMTM0LjU0N0wxMzEuMjU3IDcuMjFMMTMwLjA0NyA3LjU0VjEwSDEyNy40MzdWOC4yNUwxMjUuOTQ3IDguNjVaTTEzOC41MjUgNC40MlYzSDE1MC40MDVWNS41OEwxNDcuNzk1IDUuMjJWNC40MkgxNDIuNjI1VjguNThIMTQ3Ljc5NVY3Ljc4TDE1MC40MDUgNy40MlYxMEgxNDAuMDE1VjQuNDJIMTM4LjUyNVpNMTUxLjIwMSA0LjQyVjNIMTYzLjA5MVY1LjU4TDE2MC40ODEgNS4yMlY0LjQySDE1NS4zMTFWNS43OUgxNTkuNTYxVjcuMjFIMTU1LjMxMVY4LjU4SDE2MC40ODFWNy43OEwxNjMuMDkxIDcuNDJWMTBIMTUyLjcwMVY0LjQySDE1MS4yMDFaTTE2NC44ODcgMTBWM0gxNjcuNDk3VjcuMTRMMTcyLjY2NyA0Ljg3VjNIMTc1LjI3N1YzLjcyTDE3Ni43NjcgMy4wN1Y0Ljk0TDE3NS4yNzcgNS41OVYxMEgxNzIuNjY3VjYuNzRMMTY3LjQ5NyA5LjAxVjEwSDE2NC44ODdaTTE2OC40ODcgMy4xNVYxLjg1TDE2OS43MzcgMS4zVjBIMTcyLjMzN1YxLjRMMTY4LjQ4NyAzLjE1WiIgZmlsbD0iI0ZGMDAwMCIvPgo8cGF0aCBkPSJNMTUgMTkuNDJWMThIMjYuMDVWMjAuNTNMMjMuNDQgMjAuMTdWMTkuNDJIMTkuMVYyMS4yOEgyMy40NFYyMi43SDE5LjFWMjVIMTYuNDlWMTkuNDJIMTVaTTI2LjM0NzcgMjMuNDRWMjEuODlMMjcuODM3NyAyMS42NFYxOEgzOC4yMjc3VjIxLjQ0TDM1LjIwNzcgMjEuOTVMMzguNjM3NyAyNUgzNS4wMjc3TDMyLjE3NzcgMjIuNDZMMzAuNDQ3NyAyMi43NVYyNUgyNy44Mzc3VjIzLjE5TDI2LjM0NzcgMjMuNDRaTTMwLjQ0NzcgMjEuMThMMzUuNjE3NyAyMC4zMVYxOS40MkgzMC40NDc3VjIxLjE4Wk00MC4wMzMyIDI1VjE4SDUwLjQyMzJWMjVINDAuMDMzMlpNNDIuNjQzMiAyMy41OEg0Ny44MTMyVjE5LjQySDQyLjY0MzJWMjMuNThaTTUyLjQyNTggMjVWMTcuNzJMNjAuMjA1OCAyMi4wN1YxOS40Mkg1OS4zNTU4VjE4SDYyLjgxNThWMjVINjAuNjA1OEw1NS4wMzU4IDIxLjhWMjMuNThINTUuODg1OFYyNUg1Mi40MjU4Wk02NC4xMTg0IDIwLjhWMThINzUuMzA4NFYyMC44TDcyLjY5ODQgMjAuNDRWMTkuNDJINzEuMDE4NFYyNUg2OC40MDg0VjE5LjQySDY2LjcyODRWMjAuNDRMNjQuMTE4NCAyMC44Wk03Ni4xMDU1IDIyLjIxVjIwLjc5SDgyLjk4NTVWMjIuMjFINzYuMTA1NVpNODMuNDg2MyAxOS40MlYxOEg5NS4zNzYzVjIwLjU4TDkyLjc2NjMgMjAuMjJWMTkuNDJIODcuNTk2M1YyMC43OUg5MS44NDYzVjIyLjIxSDg3LjU5NjNWMjMuNThIOTIuNzY2M1YyMi43OEw5NS4zNzYzIDIyLjQyVjI1SDg0Ljk4NjNWMTkuNDJIODMuNDg2M1pNOTcuMTcxOSAyNVYxNy43MkwxMDQuOTUyIDIyLjA3VjE5LjQySDEwNC4xMDJWMThIMTA3LjU2MlYyNUgxMDUuMzUyTDk5Ljc4MTkgMjEuOFYyMy41OEgxMDAuNjMyVjI1SDk3LjE3MTlaTTEwOC41NjQgMTkuNDJWMThIMTE3LjI0NEwxMjAuNDM0IDE5LjdWMjVIMTEwLjA1NFYxOS40MkgxMDguNTY0Wk0xMTIuNjc0IDIzLjU4SDExNy44MzRWMjAuMUwxMTYuNTU0IDE5LjQySDExMi42NzRWMjMuNThaTTEyNi4zMzggMTkuNDJWMThIMTM1LjAxOEwxMzguMjA4IDE5LjdWMjVIMTI3LjgyOFYxOS40MkgxMjYuMzM4Wk0xMzAuNDQ4IDIzLjU4SDEzNS42MDhWMjAuMUwxMzQuMzI4IDE5LjQySDEzMC40NDhWMjMuNThaTTEzOS4xMTEgMTkuNDJWMThIMTUxLjAwMVYyMC41OEwxNDguMzkxIDIwLjIyVjE5LjQySDE0My4yMjFWMjAuNzlIMTQ3LjQ3MVYyMi4yMUgxNDMuMjIxVjIzLjU4SDE0OC4zOTFWMjIuNzhMMTUxLjAwMSAyMi40MlYyNUgxNDAuNjExVjE5LjQySDEzOS4xMTFaTTE1MS42OTcgMTkuNDJWMThIMTU1LjA5N0wxNTcuOTM3IDIyLjYzTDE2MC43NTcgMThIMTYzLjUwN0wxNTkuMTg3IDI1SDE1Ni42NDdMMTUzLjE4NyAxOS40MkgxNTEuNjk3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';
} else {
    png.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCA3NCAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMS4wOTRWMC4wOTk5OTk3SDE1LjMxNlYxLjkwNkwxMy40ODkgMS42NTRWMS4wOTRIOS44N1Y0LjAwNkgxMy40ODlWMy40NDZMMTUuMzE2IDMuMTk0VjVIOC4wNDNWMS4wOTRIN1pNMTYuNTczIDVWMC4wOTk5OTk3SDIzLjg0NlY1SDE2LjU3M1pNMTguNCA0LjAwNkgyMi4wMTlWMS4wOTRIMTguNFY0LjAwNlpNMjQuNTQ3OSA0LjA1NVYyLjgwMkwyNS41OTA5IDIuNTIyVjAuMDk5OTk5N0gyNy40MTc5VjIuMDI1TDMwLjk5NDkgMS4wNTlWMC4wOTk5OTk3SDMyLjgyMTlWMS44MjJMMzAuMDAwOSAyLjU4NUwzMS42NTI5IDMuOTVIMzIuODYzOVY1SDMwLjU2NzlMMjguMjY0OSAzLjA0N0wyNy40MTc5IDMuMjc4VjVIMjUuNTkwOVYzLjc3NUwyNC41NDc5IDQuMDU1Wk0zNC4wNTI1IDVWMC4wOTk5OTk3SDQxLjMyNTVWNUgzNC4wNTI1Wk0zNS44Nzk1IDQuMDA2SDM5LjQ5ODVWMS4wOTRIMzUuODc5NVY0LjAwNlpNNDIuMDk3MyA1TDQzLjgwNTMgMS4wOTRINDIuOTM3M1YwLjA5OTk5OTdINDcuODAyM0w0OS45MzAzIDVINDguMDQwM0w0Ni4zMzIzIDEuMDk0SDQ1LjcwMjNMNDMuOTk0MyA1SDQyLjA5NzNaTTUwLjYyOTcgNVYwLjA5OTk5OTdINTcuOTAyN1Y1SDUwLjYyOTdaTTUyLjQ1NjcgNC4wMDZINTYuMDc1N1YxLjA5NEg1Mi40NTY3VjQuMDA2Wk01OC42MDQ1IDEuMDk0VjAuMDk5OTk5N0g2Ni45MjA1VjIuMDI1TDY1LjMxNzUgMi41NUw2Ni45MjA1IDMuMDc1VjVINTkuNjQ3NVYxLjA5NEg1OC42MDQ1Wk02MS40NzQ1IDQuMDA2SDY1LjA5MzVWMy42NDlMNjMuNzE0NSAzLjA0N0g2MS40NzQ1VjQuMDA2Wk02MS40NzQ1IDIuMDUzSDYzLjcxNDVMNjUuMDkzNSAxLjQ1MVYxLjA5NEg2MS40NzQ1VjIuMDUzWk03LjA3IDE1TDguNzc4IDExLjA5NEg3LjkxVjEwLjFIMTIuNzc1TDE0LjkwMyAxNUgxMy4wMTNMMTIuNDgxIDEzLjc3NUg5LjQ5OUw4Ljk2NyAxNUg3LjA3Wk05LjkzMyAxMi43ODFIMTIuMDQ3TDExLjMwNSAxMS4wOTRIMTAuNjc1TDkuOTMzIDEyLjc4MVpNMTQuOTcyMyAxNUwxNi42ODAzIDExLjA5NEgxNS44MTIzVjEwLjFIMjAuNjc3M0wyMi44MDUzIDE1SDIwLjkxNTNMMTkuMjA3MyAxMS4wOTRIMTguNTc3M0wxNi44NjkzIDE1SDE0Ljk3MjNaTTIyLjIzMDUgMTEuMDk0VjEwLjFIMzAuNTUzNVYxMS45MDZMMjguNzI2NSAxMS42NTRWMTEuMDk0SDI1LjEwNzVWMTIuMDUzSDI4LjA4MjVWMTMuMDQ3SDI1LjEwNzVWMTQuMDA2SDI4LjcyNjVWMTMuNDQ2TDMwLjU1MzUgMTMuMTk0VjE1SDIzLjI4MDVWMTEuMDk0SDIyLjIzMDVaTTMxLjExMDQgMTQuMDU1VjEyLjgwMkwzMi4xNTM0IDEyLjUyMlYxMC4xSDMzLjk4MDRWMTIuMDI1TDM3LjU1NzQgMTEuMDU5VjEwLjFIMzkuMzg0NFYxMS44MjJMMzYuNTYzNCAxMi41ODVMMzguMjE1NCAxMy45NUgzOS40MjY0VjE1SDM3LjEzMDRMMzQuODI3NCAxMy4wNDdMMzMuOTgwNCAxMy4yNzhWMTVIMzIuMTUzNFYxMy43NzVMMzEuMTEwNCAxNC4wNTVaTTM5LjkxNSAxMS4wOTRWMTAuMUg0OC4yMzFWMTEuOTA2TDQ2LjQwNCAxMS42NTRWMTEuMDk0SDQyLjc4NVYxNC4wMDZINDYuNDA0VjEzLjQ0Nkw0OC4yMzEgMTMuMTk0VjE1SDQwLjk1OFYxMS4wOTRIMzkuOTE1Wk00OC43ODgxIDExLjA5NFYxMC4xSDU3LjExMTFWMTEuOTA2TDU1LjI4NDEgMTEuNjU0VjExLjA5NEg1MS42NjUxVjEyLjA1M0g1NC42NDAxVjEzLjA0N0g1MS42NjUxVjE0LjAwNkg1NS4yODQxVjEzLjQ0Nkw1Ny4xMTExIDEzLjE5NFYxNUg0OS44MzgxVjExLjA5NEg0OC43ODgxWk01OC4zNjggMTVWMTAuMUg2MC4xOTVWMTIuOTk4TDYzLjgxNCAxMS40MDlWMTAuMUg2NS42NDFWMTAuNjA0TDY2LjY4NCAxMC4xNDlWMTEuNDU4TDY1LjY0MSAxMS45MTNWMTVINjMuODE0VjEyLjcxOEw2MC4xOTUgMTQuMzA3VjE1SDU4LjM2OFpNNjAuODg4IDEwLjIwNVY5LjI5NUw2MS43NjMgOC45MVY4SDYzLjU4M1Y4Ljk4TDYwLjg4OCAxMC4yMDVaIiBmaWxsPSIjRkYwMDAwIi8+CjxwYXRoIGQ9Ik0wIDIxLjA5NFYyMC4xSDcuNzM1VjIxLjg3MUw1LjkwOCAyMS42MTlWMjEuMDk0SDIuODdWMjIuMzk2SDUuOTA4VjIzLjM5SDIuODdWMjVIMS4wNDNWMjEuMDk0SDBaTTcuOTQzMzYgMjMuOTA4VjIyLjgyM0w4Ljk4NjM2IDIyLjY0OFYyMC4xSDE2LjI1OTRWMjIuNTA4TDE0LjE0NTQgMjIuODY1TDE2LjU0NjQgMjVIMTQuMDE5NEwxMi4wMjQ0IDIzLjIyMkwxMC44MTM0IDIzLjQyNVYyNUg4Ljk4NjM2VjIzLjczM0w3Ljk0MzM2IDIzLjkwOFpNMTAuODEzNCAyMi4zMjZMMTQuNDMyNCAyMS43MTdWMjEuMDk0SDEwLjgxMzRWMjIuMzI2Wk0xNy41MjMyIDI1VjIwLjFIMjQuNzk2MlYyNUgxNy41MjMyWk0xOS4zNTAyIDI0LjAwNkgyMi45NjkyVjIxLjA5NEgxOS4zNTAyVjI0LjAwNlpNMjYuMTk4IDI1VjE5LjkwNEwzMS42NDQgMjIuOTQ5VjIxLjA5NEgzMS4wNDlWMjAuMUgzMy40NzFWMjVIMzEuOTI0TDI4LjAyNSAyMi43NlYyNC4wMDZIMjguNjJWMjVIMjYuMTk4Wk0zNC4zODI5IDIyLjA2VjIwLjFINDIuMjE1OVYyMi4wNkw0MC4zODg5IDIxLjgwOFYyMS4wOTRIMzkuMjEyOVYyNUgzNy4zODU5VjIxLjA5NEgzNi4yMDk5VjIxLjgwOEwzNC4zODI5IDIyLjA2Wk00Mi43NzM4IDIzLjA0N1YyMi4wNTNINDcuNTg5OFYyMy4wNDdINDIuNzczOFpNNDcuOTQwNCAyMS4wOTRWMjAuMUg1Ni4yNjM0VjIxLjkwNkw1NC40MzY0IDIxLjY1NFYyMS4wOTRINTAuODE3NFYyMi4wNTNINTMuNzkyNFYyMy4wNDdINTAuODE3NFYyNC4wMDZINTQuNDM2NFYyMy40NDZMNTYuMjYzNCAyMy4xOTRWMjVINDguOTkwNFYyMS4wOTRINDcuOTQwNFpNNTcuNTIwMyAyNVYxOS45MDRMNjIuOTY2MyAyMi45NDlWMjEuMDk0SDYyLjM3MTNWMjAuMUg2NC43OTMzVjI1SDYzLjI0NjNMNTkuMzQ3MyAyMi43NlYyNC4wMDZINTkuOTQyM1YyNUg1Ny41MjAzWk02NS40OTUxIDIxLjA5NFYyMC4xSDcxLjU3MTFMNzMuODA0MSAyMS4yOVYyNUg2Ni41MzgxVjIxLjA5NEg2NS40OTUxWk02OC4zNzIxIDI0LjAwNkg3MS45ODQxVjIxLjU3TDcxLjA4ODEgMjEuMDk0SDY4LjM3MjFWMjQuMDA2Wk0yNC41IDMxLjA5NFYzMC4xSDMwLjU3NkwzMi44MDkgMzEuMjlWMzVIMjUuNTQzVjMxLjA5NEgyNC41Wk0yNy4zNzcgMzQuMDA2SDMwLjk4OVYzMS41N0wzMC4wOTMgMzEuMDk0SDI3LjM3N1YzNC4wMDZaTTMzLjQ0MTQgMzEuMDk0VjMwLjFINDEuNzY0NFYzMS45MDZMMzkuOTM3NCAzMS42NTRWMzEuMDk0SDM2LjMxODRWMzIuMDUzSDM5LjI5MzRWMzMuMDQ3SDM2LjMxODRWMzQuMDA2SDM5LjkzNzRWMzMuNDQ2TDQxLjc2NDQgMzMuMTk0VjM1SDM0LjQ5MTRWMzEuMDk0SDMzLjQ0MTRaTTQyLjI1MTMgMzEuMDk0VjMwLjFINDQuNjMxM0w0Ni42MTkzIDMzLjM0MUw0OC41OTMzIDMwLjFINTAuNTE4M0w0Ny40OTQzIDM1SDQ1LjcxNjNMNDMuMjk0MyAzMS4wOTRINDIuMjUxM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
}



window.addEventListener('load', event => {
    console.log('page has loaded');

    ctx.drawImage(png, 0, 0);
    drawImage();
})