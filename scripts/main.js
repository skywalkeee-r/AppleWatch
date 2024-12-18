const WeatherAPI = "ffe84f8bc1c42d7dc4f1c0b57f665f60";
var watch = new Vue({
    el: ".watch",
    data: {
        isOnlock: false,
        openSettings: false,
        choosewallpaper: false,
        lockbg: "Smoke.png",
        mainbg: "Smoke.png",
        isMainbg: true,
        openMaps: false,
        openWeather: false,
        temp: 0,
        tempiconname: "01d",
        place: "",
        openTimer: false,
        timeAnimation: false,
        Animationseconds: 0,
        startTimer: false,
        pauseTimer: false,
        timeInterval: null,
        hour: 0,
        minutes: 0,
        day: 0,
        date: 0,
        month: 0,
        year: 0
    },
    methods: {
        Unlock() { this.isOnlock = true; },
        OpenSettings() { this.openSettings = true; },
        ChooseWallpaper() { this.choosewallpaper = true; console.log(this.choosewallpaper); },
        ChangeLockbg(src) {
            if (this.isMainbg) {
                this.mainbg = src;
            }
            else {
                this.lockbg = src;
            }
        },
        OpenWeather() { this.openWeather = true; },
        OpenMaps() { this.openMaps = true; },
        OpenTimer() { this.openTimer = true; },
        StartTimer() {
            let seconds = document.querySelector(".seconds").value;
            console.log(seconds);
            let minutes = document.querySelector(".minutes").value;
            let hours = document.querySelector(".hours").value;
            this.Animationseconds = Number(seconds) + Number(minutes * 60) + Number(hours * 3600);
            if (this.Animationseconds == 0) {
                return;
            }
            this.timeIntervalID = setInterval(() => {
                this.CheckTime();
            },
                1000);
            this.startTimer = true;
        },
        CheckTime() {
            this.Animationseconds = this.Animationseconds - 1;
            console.log(this.Animationseconds);
            if (this.Animationseconds < 1) {
                clearInterval(this.timeIntervalID);
                alert("Время вышло");
                this.timeAnimation = false;
                this.startTimer = false;
                this.pauseTimer = false;
            }
        },
        PauseTimer() {
            clearInterval(this.timeIntervalID);
            this.timeAnimation = false;
            this.startTimer = true;
            this.pauseTimer = true;
        },
        CancelTimer() {
            clearInterval(this.timeIntervalID);
            this.timeAnimation = false;
            this.startTimer = false;
            this.pauseTimer = false;
        },
        ContinuationTimer() {
            this.timeIntervalID = setInterval(() => {
                this.CheckTime();
            },
                1000);
            this.startTimer = true;
            this.timeAnimation = true;
            this.pauseTimer = false;
        },
        StartTimeAnimation() { this.timeAnimation = true; },
        SetTime() {
            let date = new Date();
            this.hour = date.getHours();
            this.minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
            this.day = date.getDate();
            this.month = date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
            this.year = date.getFullYear();
            let daynumber = date.getDay();
            switch (daynumber) {
                case 1:
                    this.date = ("Mon");
                    break;
                case 2:
                    this.date = ("Tue");
                    break;
                case 3:
                    this.date = ("Wen");
                    break;
                case 4:
                    this.date = ("Thu");
                    break;
                case 5:
                    this.date = ("Fri");
                    break;
                case 6:
                    this.date = ("Sat");
                    break;
                case 0:
                    this.date = ("Sun");
                    break;
            }
            console.log("Время обновлено!");
        }
    }
})
setInterval(() => { watch.SetTime() }, 1000);
watch.SetTime();
window.addEventListener("load", () => {
    let lat;
    let long;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            const link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WeatherAPI}&units=metric`;
            fetch(link).then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data);
                let main = data.main;
                watch.temp = Math.floor(main.temp);
                watch.place = data.name;
                watch.tempiconname = `https://openweathermap.org/img/wn/${GetWeatherImgName(data.weather[0].id)}.png`;
                console.log(data.weather[0].id);
                console.log(watch.temp);
            });
        });
    }
})
function GetWeatherImgName(id) {
    let hundreds = parseInt(id / 100);
    switch (hundreds) {
        case 2:
            return "11d";
        case 3:
            return "09d";
        case 5:
            if (id < 511) return "10d";
            else if (id == 511) return "13d";
            else return "09d";
        case 6:
            return "13d";
        case 7:
            return "50d";
        case 8:
            if (id == 800) return "01d";
            else if (id == 801) return "02d";
            else if (id == 802) return "03d";
            else return "04d";
    }
}