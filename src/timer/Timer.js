import React, { Component } from 'react';
import Lap from './Lap';

class Timer extends Component{
    constructor(){
        super();
        this.lapTimes = [];
        this.lapCounter = 1;
        this.state = {
            running : false,
            time :0,
            start: 0,
            lap : 0,
            lapDisplay: false
            };
    }
    // On Component Mount we call retrievelaps
    componentDidMount(){
        this.retrieveLaps();
    }
    //Saves previous laps and the lap counter 
    saveLaps(myLaps, myCounter){
        sessionStorage.setItem('myLapData', JSON.stringify(myLaps));
        sessionStorage.setItem('myLapCounter', JSON.stringify(myCounter));
    }

    //Loads saved laptimes and lapcounter from this session
    retrieveLaps(){
        let lapData = JSON.parse(sessionStorage.getItem('myLapData'));
        let counterData = JSON.parse(sessionStorage.getItem('myLapCounter'));
        if (counterData !== null) this.lapCounter = counterData;
        if(lapData !== null)this.lapTimes = lapData;
        this.displayCheck();
    }

    //Manages sets timer start time and calculates elapsed time
    timerStart(){

       this.setState({
           running: true, 
           time: this.state.time,
           start : Date.now() - this.state.time,
       });

       this.stopwatch = setInterval(() =>{
            this.setState({
                time: Date.now() - this.state.start
            });
       },10);
    
    }
    
 
    // Stops timer
    timerStop(){
        clearInterval(this.stopwatch);
    }

    //Resets timer to zero by resetting all states
    timerReset(){
        this.setState({
            time: 0,
            start: 0,
            lap: 0
        });
        clearInterval(this.stopwatch);
    }

    //Calculates laptime and adds a lap object to the laptime array
    timerLap(){
        let prevLap = this.state.lap;
        let presLap =  this.state.time;
        this.setState({
            lap: this.state.time
        });
       this.formatTime(prevLap);
       this.formatTime(presLap);
       let lapTime = this.formatTime(presLap - prevLap);
       this.lapTimes.push({id : this.lapCounter, lapTime: lapTime});
       this.lapCounter++;
       console.log(this.lapTimes);
       this.saveLaps(this.lapTimes, this.lapCounter);
       this.displayCheck();
    }
    
    //Checks if the laptimes borad needs to be displayed
    displayCheck(){
        if(this.lapTimes.length > 0){
            this.setState({
                lapDisplay: true
            });
        }else{
            this.setState({
                lapDisplay: false
            })
        }
    }

    //formats a Date() into a string of format 00:00:00:000
    formatTime(time){
        let milliseconds = ("00" + (Math.floor(time / 1) % 1000)).slice(-3);
        let seconds = ("0" + (Math.floor(time / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(time / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(time / 3600000)).slice(-2);
        let result = hours+':'+minutes+':'+seconds+':'+milliseconds;
        return result;
    }

    //Clears all laps fomr laptimes
    clearAll(){
        this.lapTimes = []
        this.displayCheck();
        this.lapCounter = 1;
        this.saveLaps(this.lapTimes, this.lapCounter);
        
    }

    render(){
        const { time} = this.state;
        let result = this.formatTime(time);
        let display = 'hidden';
        if(this.state.lapDisplay === true) display = 'visible';
        console.log(display);
        

        return (
         <div className='timer-container'>
            
                <h1 className='timer-display'> {result}</h1>
                <button className='button' onClick={this.timerStart.bind(this)}>Start</button>
                <button  className='button' onClick={this.timerStop.bind(this)}>Stop</button>
                <button  className='button' onClick={this.timerReset.bind(this)}>Reset</button>
                <button  className='button' onClick={this.timerLap.bind(this)}>Lap</button>
                <div>
                <h3 style={{visibility: display}}className='lap-header'>Lap Times</h3>
           
               <ul>
                  {
                      //Mapping over our laptimes passing lap attributes as props to the lap component.
                      this.lapTimes.map((lap, index) =>{
                      return(<Lap key={index} id={lap.id}>{lap.lapTime}</Lap>);
                      })
                  }
               </ul>
               <button onClick={this.clearAll.bind(this)} className='clearall-btn' style={{visibility: display}}> Clear Times</button>
            </div>
        </div> 
        );
    }
}

export default Timer 