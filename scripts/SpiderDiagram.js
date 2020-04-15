/*
    segments: Array of names of the segments
    
    canvasId: Id of the canvas element where the diagram should be drawn
*/
function SpiderDiagram(segments, minRateValue, maxRateValue, gridSeperation , canvasId) {


    //Fields
    this.segments = segments;
    this.minRate = minRateValue;
    this.maxRate = maxRateValue;
    if (gridSeperation == null || gridSeperation == 0 || gridSeperation == NaN) {
        gridSeperation = 0.5;
    }
    gridSeperation = maxRateValue / (Math.ceil(maxRateValue / gridSeperation));
    this.gridSeperation = gridSeperation;
    this.canvas = document.getElementById(canvasId);
    this.legendFontNane = "Arial";
    this.legendFontSize = 12;



    if (this.canvas == null) {
        throw "No element with id = " + canvasId + " found in the html document.";
        return;
    }
    this.centerX = Math.floor(this.canvas.width / 2);
    this.centerY = Math.floor(this.canvas.height / 2);
    this.radius = Math.min(this.centerX, this.centerY)*.7;
    this.drawingContext = this.canvas.getContext("2d");


    //Methods
    this.drawValues = drawValues;
    this.drawUserValues = drawUserValues;
    this.drawLegend = drawLegend;
    this.drawSegmentLine = drawSegmentLine;


    //initialization
    var segmentAngles = new Array(this.segments.length);
    for (var i = 0; i < this.segments.length; i++) {
        segmentAngles[i] = 3 * Math.PI / 2 + 2 * Math.PI * i / this.segments.length;
    }
    this.segmentAngles = segmentAngles;

}

function drawSegmentLine() {
    this.drawingContext.lineWidth = 0.7;
    this.drawingContext.strokeStyle = "#999999";
    for (var i = 0; i < this.segmentAngles.length; i++) {
        var pointX = Math.cos(this.segmentAngles[i]) * this.radius + this.centerX;
        var pointY = Math.sin(this.segmentAngles[i]) * this.radius + this.centerY;
        this.drawingContext.moveTo(this.centerX, this.centerY);
        this.drawingContext.lineTo(pointX, pointY);
        //this.drawingContext.stroke();
    }
    this.drawingContext.stroke();

}

function drawLegend() {
    
    if (this.segments == null) return;

    this.drawingContext.fillStyle = "#000000";
    
    $("span", this.canvas.parentElement).remove()
    
    for (var i = 0; i < this.segments.length; i++) {
        var pointX = Math.cos(this.segmentAngles[i]) * (this.radius +10) + this.centerX;
        var pointY = Math.sin(this.segmentAngles[i]) * (this.radius +10) + this.centerY;


        var legendClass;
        if (Math.round(pointX) < this.centerX) {
            this.drawingContext.textAlign = "right";
            legendClass = "legendRight";            
        }
        else if (Math.round(pointX) > this.centerX) {
            this.drawingContext.textAlign = "left";
            legendClass = "legendLeft";  
        }
        else {
            this.drawingContext.textAlign = "center";
            legendClass = "legendCenter";  
         }




         try {
             this.drawingContext.textBaseline = "top";
         }
         catch (er) {
         }

        
            var availableWidth = pointX < this.centerX ? pointX : 2 * this.centerX - pointX;
            availableWidth -= this.legendFontSize;
            //var wrapedLines = getLines(this.drawingContext, this.segments[i], availableWidth);
            //this.drawingContext.font = this.legendFontSize + "px " + this.legendFontName;
            //var heightOfALine = this.legendFontSize; //this.drawingContext.measureText(this.segments[i]).height;
            //var lineSpacing = 2;
            //var totalHeight = heightOfALine * wrapedLines.length + lineSpacing * (wrapedLines.length - 1);
            //pointY = pointY - totalHeight / 2;

            this.drawingContext.moveTo(pointX, pointY);


            //add legend span element
            var segLegend = $("<span/>");
            segLegend.addClass(legendClass);
            segLegend.html(this.segments[i]);           
            segLegend.css({ top: pointY + $(this.canvas).offset().top, left: pointX + $(this.canvas).offset().left, position: "absolute"});
            $(this.canvas.parentElement).append(segLegend);

            /*
            for (var k = 0; k < wrapedLines.length; k++) {
                this.drawingContext.fillText(wrapedLines[k], Math.ceil(pointX), Math.ceil(pointY));    

                pointY += heightOfALine + lineSpacing;
            }
            */
       
        
        
    }

}

/**
* Divide an entire phrase in an array of phrases, all with the max pixel length given.
* The words are initially separated by the space char.
* @param phrase
* @param length
* @return
*/

function getLines(ctx, phrase, maxPxLength) {
    var wa = phrase.split(" "),
        phraseArray = [],
        lastPhrase = "",
        l = maxPxLength,
        measure = 0;
    //ctx.font = textStyle;
    for (var i = 0; i < wa.length; i++) {
        var w = wa[i];
        measure = ctx.measureText(lastPhrase + w).width;
        if (measure < l) {
            lastPhrase += lastPhrase==""?w:(" " + w);
        } else {
            phraseArray.push(lastPhrase);
            lastPhrase = w;
        }
        if (i === wa.length - 1) {
            phraseArray.push(lastPhrase);
            break;
        }
    }
    return phraseArray;
}

function drawValues(values,strokeColor,strokeWidth,fillColor, drawingGrid) {
    if (values.length != this.segments.length || this.segments==null) {
        throw "length of values array is not same as length of the segments array";
        return;
    }

    var startPointX;
    var startPointY;

    strokeColor = strokeColor == null ? "#0000ff" : strokeColor;
    strokeWidth = strokeWidth == null ? 0.4 : strokeWidth;



    

    this.drawingContext.lineWidth = strokeWidth;
    this.drawingContext.strokeStyle = strokeColor;

    for (var i = 0; i < this.segmentAngles.length; i++) {
        if (values[i] > this.maxRate ) {
            var val = values[i];
        }

        var curValue = values[i] > this.maxRate ? this.maxRate : values[i];        
        if (!drawingGrid) {
            curValue = curValue < this.minRate ? this.minRate : curValue;
        }
        var curRadius = this.radius * curValue / (this.maxRate);
        var pointX = Math.cos(this.segmentAngles[i])*curRadius + this.centerX;
        var pointY = Math.sin(this.segmentAngles[i]) *curRadius + this.centerY;
        if (i == 0) {
            this.drawingContext.beginPath();
            startPointX = pointX;
            startPointY = pointY;
            this.drawingContext.moveTo(startPointX, startPointY);
           
        }
        else {
            this.drawingContext.lineTo(pointX, pointY);
        }
    }

    this.drawingContext.lineTo(startPointX, startPointY);    
    if(fillColor!=null) this.drawingContext.fillStyle = fillColor;
    this.drawingContext.stroke();
    if(fillColor!=null)this.drawingContext.fill();
    this.drawingContext.closePath();

}

function drawUserValues(curValues, avgValues) {

    this.drawingContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
    //draws the grid
    var valuesForGrid = new Array(this.segments.length);
    for (var i = 1; i <=this.maxRate/this.gridSeperation; i++) {

        for (var j = 0; j < this.segments.length; j++) {
            valuesForGrid[j] = i * this.gridSeperation;
        }
        this.drawValues(valuesForGrid,"#999999",0.4);

    }

    this.drawSegmentLine();

    //try{
        this.drawLegend();
    //}
    //catch(ex){
    //}


    if(avgValues!=null)this.drawValues(avgValues, "#000066", 3, "#6699CC");
    if (avgValues != null) this.drawingContext.globalAlpha = 0.65;
    this.drawValues(curValues, "#FF9933", 3, "#FFCC99");
    this.drawingContext.globalAlpha = 1;

}