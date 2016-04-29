var platform = platform || {};

platform.HighScores = function(){};

platform.HighScores.prototype = {
    create: function(){
        background = this.game.add.tileSprite(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, 'high-scores');
        
        console.log("High Scores!");
        var data = null;
        
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener("readystatechange", function () {
                             if (this.readyState === 4) {
                             var position = 50;
                             console.log(JSON.parse(this.responseText));
                             console.log(JSON.parse(this.responseText)[0]);
                             var iterArr = JSON.parse(this.responseText);
                             console.log("iter length ", iterArr.length);
                             platform.game.add.text(480, 50, "High Scores", {font: "60px Palatino Linotype", fill: 'white'});
                             var height = 150
                             for (var i = 0; i < iterArr.length; i++){
                                console.log(iterArr[i]);
                                platform.game.add.text(450, height, iterArr[i].name + " : " + iterArr[i].score, {font: "45px Palatino Linotype", fill: 'white'});
                             height += 50;
                             }
                             platform.game.add.text(70, 530, 'Back to Main',{font: "32px Palatino Linotype", fill: 'white'})
                             }
                             });
        
        xhr.open("GET", "https://pirate-runner.herokuapp.com/scores");
        xhr.setRequestHeader("cache-control", "no-cache");
        
        xhr.send(data);
        this.game.add.button(100,600, 'box', this.backToMain, this, 2, 1, 0);

    },
    backToMain: function(){
            this.state.start('Menu');
    }
    

}