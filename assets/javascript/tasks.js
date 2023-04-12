//Get funtion in document
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Hunee'
//lấy ra kích thước của cd thumbnail
var thumbnailElement = $('.boxplay__thumbnail');
var thumbnailElementWidth = thumbnailElement.offsetWidth;
var thumbnailElementHeight = thumbnailElement.offsetHeight;
const heading = $('.boxplay__heading-name');
const thumbElement =$('.boxplay__thumbnail');
const audio = $('#audio');
const playBtn = $('.button__play-pause');
const lineElement = $('.line');
const lineLength = $('.time__length');
const currentLine = $('.time__current');
//Bắt sự kiện volume
const vol = $('.icon-volume');
const volBar = $('.boxplay__volume-bar');
const volLine = $('.volume__bar');
const volHigh = $('.volume-high');
const volLow = $('.volume-low');
const volMute = $('.volume-mute');
//Bắt sự kiện nút Next, Previous, shuffle, repeat
const nextSongElement = $('.icon-next');
const prevSongElement = $('.icon-previous');
const shuffleElement = $('.icon-shuffle');
const repeatElement = $('.icon-repeat');
const repeatOne = $('.number');
//Bắt sự kiện lấy bài đang phát
const boxSongElement = $('.boxlist');
//Tạo một đối tượng chứa toàn bộ nội dung của website
//khai báo song là một object chứa thông tin bài hát
const app = {
    arrSongPlayed : [],
    isPlaying : false,
    isShuffle: false,
    isRepeat: 0,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))|| {},
    currentIndex : 0,
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs : [
        {   
            name: "Anh sẽ ổn thôi",
            singer: "Vương Anh Tú",
            source: "./assets/music/AnhSeOnThoi-VuongAnhTu.mp3",
            image: "./assets/image/image\(1\).jpg"
        },
        {   
            name: "Giúp anh trả lời những câu hỏi",
            singer: "Vương Anh Tú",
            source: "./assets/music/GiupAnhTraLoiNhungCauHoi-VuongAnhTu.mp3",
            image: "./assets/image/image\(2\).jpg"
        },
        {   
            name: "Ký ức đượm buồn",
            singer: "Vương Anh Tú",
            source: "./assets/music/KyUcDuomBuon-VuongAnhTu.mp3",
            image: "./assets/image/image\(3\).jpg"
        },
        {   
            name: "Mặt trái của hạnh phúc",
            singer: "Vương Anh Tú",
            source: "./assets/music/MatTraiCuaHanhPhuc-VuongAnhTu.mp3",
            image: "./assets/image/image\(4\).jpg"
        },
        {   
            name: "May mà không may",
            singer: "Vương Anh Tú",
            source: "./assets/music/MayMaKhongMay-VuongAnhTu.mp3",
            image: "./assets/image/image\(5\).jpg"
        },
        {   
            name: "Như người xa lạ",
            singer: "Vương Anh Tú",
            source: "./assets/music/NhuNguoiXaLa-VuongAnhTu.mp3",
            image: "./assets/image/image\(6\).jpg"
        },
        {   
            name: "Nước mắt lưng tròng",
            singer: "Vương Anh Tú",
            source: "./assets/music/NuocMatLungTrong-VuongAnhTu.mp3",
            image: "./assets/image/image\(7\).jpg"
        },
        {   
            name: "Sao tiếc người không tốt",
            singer: "Vương Anh Tú",
            source: "./assets/music/SaoTiecNguoiKhongTot-VuongAnhTu.mp3",
            image: "./assets/image/image\(8\).jpg"
        },
        {   
            name: "Xin người nhớ tên",
            singer: "Vương Anh Tú",
            source: "./assets/music/XinNguoiNhoTen-VuongAnhTu.mp3",
            image: "./assets/image/image\(9\).jpg"
        },
    ],
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                if(this.currentIndex == null){
                    this.currentIndex = 0;
                } else {
                    this.currentIndex = this.currentIndex;
                }
                return this.songs[this.currentIndex];
            },
        });
    },
    //Tạo hàm render các data-song 
    renderList: function(){
        var htmls = this.songs.map(function(song, index){
            return `
            <div class="col c-12">
                <div class="boxlist__song data-song-${index}" index="${index}">
                    <div style = "background-image: url('${song.image}');" class="boxlist__song-image"></div>
                    <div class="boxlist__song-infor">
                        <div class="song-infor__name">${song.name}</div>
                        <div class="song-infor__singer">${song.singer}</div>
                    </div>
                    <div class="boxlist__song-options" index="${index}">
                        <i class="icon-options fa-solid fa-ellipsis" ></i>
                        <div class="option-notice">Option</div>
                    </div>
                </div>
            </div>
            `
        });
        $('.boxlist').innerHTML = htmls.join('\n');
    },
    //handle event in document
    handleEvent: function(){
        const _this = this;
        //Xử lý sự kiện volume
        //lắng nghe sự kiện cuộn theo trục Y
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = thumbnailElementWidth - scrollTop;
            const newHeight = thumbnailElementHeight - scrollTop;
            // so sánh giá trị thay đổi với số 0
            thumbnailElement.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            thumbnailElement.style.height = newHeight > 0 ? newHeight + 'px': 0;
            //làm opacity khi làm mờ
            thumbnailElement.style.opacity = newHeight / thumbnailElementHeight;
        }
        //Xử lý khi click play
        playBtn.onclick = function() {
            // Check isPlaying
            if(_this.isPlaying){
                audio.pause();
            } else {
                if((_this.isShuffle)&&(_this.arrSongPlayed.length > _this.songs.length)){
                    _this.arrSongPlayed = [];
                    _this.shuffleSong();
                } else {
                    audio.play();
                }
        }
        }
        //khi bai hat player: lang nghe
        audio.onplay = function(){
            _this.isPlaying = true;
            playBtn.classList.add("active");
            thumnailAnimate.play();
            _this.scrollToActiveSong();

        };
        audio.onpause = function(){
            _this.isPlaying = false;
            playBtn.classList.remove("active");
            thumnailAnimate.pause();
        };
        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const changePercent = audio.currentTime / audio.duration * 100;
                lineElement.value = changePercent;
                lineElement.style.backgroundSize = `${changePercent}% 100%`;
                const timeNow = _this.formatTime(audio.currentTime);
                currentLine.innerHTML = timeNow;
            }
        }
        // //Xu ly khi tua bai hat
        lineElement.oninput = function(e){
            const timeNow = e.target.value;
            audio.currentTime = timeNow / 100 * audio.duration;
        }
        //Xử lý volume
        vol.onclick = function(){
            volBar.classList.toggle('active');
            
        }
        volLine.onchange = function(e){
            const volNow = e.target.value;
            audio.volume = volNow / 100;
            volLine.style.backgroundSize = `${volNow}% 100%`;
            if(volNow == 0){
                volHigh.classList.remove('active');
                volLow.classList.remove('active');
                volMute.classList.add('active');

            } else if((0 < volNow)&&( volNow < 60)){
                volHigh.classList.remove('active');
                volLow.classList.add('active');
                volMute.classList.remove('active');
            } else {
                volHigh.classList.add('active');
                volLow.classList.remove('active');
                volMute.classList.remove('active');
            }
        }
        
        //Làm thumbnail quay / dừng
        const thumnailAnimate = thumbnailElement.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,//10 seconds
            iterations: Infinity
        })
        thumnailAnimate.pause();
        //Next bài hát
        nextSongElement.onclick = function() {
            if(_this.isShuffle){
                if(_this.arrSongPlayed.length >= _this.songs.length){
                    _this.arrSongPlayed = [];
                    _this.shuffleSong();
                } else {
                _this.shuffleSong();
                }
            } else{
                _this.nextSong();
            };
            audio.play();
        };
        //Prev bài hát
        prevSongElement.onclick = function() {
            if(_this.isShuffle){
                if(_this.arrSongPlayed.length >= _this.songs.length){
                    _this.arrSongPlayed = [];
                    _this.shuffleSong();
                } else {
                _this.shuffleSong();
                }
            } else{
                _this.previousSong();
            };
            audio.play();
        };
        //Shuffle bài hát
        shuffleElement.onclick = function() {
            _this.isShuffle = !_this.isShuffle;
            _this.setConfig('isShuffle',  _this.isShuffle);
            shuffleElement.classList.toggle("active", _this.isShuffle);
            if(_this.isShuffle){
                _this.shuffleSong();
            } else {
                _this.arrSongPlayed = [];
            }
            
        };

        //Xử lý lặp lại bài hát
        repeatElement.onclick = function() {
            _this.isRepeat++;
            if(_this.isRepeat == 1){
                repeatElement.classList.add('active');
            } else if(_this.isRepeat == 2){
                repeatElement.classList.add('active');
                repeatOne.classList.add('active');
            } else{
                repeatOne.classList.remove('active');
                repeatElement.classList.remove('active');
                _this.isRepeat = 0;
            }
            _this.setConfig('isRepeat',  _this.isRepeat);

        };
        //Tự động phát bài hát khi kết thúc
        audio.onended = function() {
           //Không bật gì cả:
        if(_this.isShuffle == false){
            if(_this.isRepeat == 2){
                audio.play();
            } else if(_this.isRepeat == 1){
                nextSongElement.click();
            } else {
                if(_this.currentIndex < _this.songs.length - 1){
                    nextSongElement.click();
                } else {
                    audio.pause();
                }
            }
            //Khi bật nút Shuffle 
        } else {
            if(_this.isRepeat == 2){
                audio.play();
            } else{
                _this.shuffleSong();    
            }
        };
        };
        //Lắng nghe hành vi click vào playlist
        boxSongElement.onclick = function(e){
            const songChoose = e.target.closest('.boxlist__song:not(.active)')
            const iconOption = e.target.closest('.boxlist__song-options')
            if(songChoose == null){
                if(iconOption != null){
                    iconOption.classList.toggle('active');
                }
            } else {
                if(iconOption == null){
                _this.currentIndex = songChoose.getAttribute('index');
                _this.loadCurrentSong();
                audio.play();
                } else {
                    iconOption.classList.toggle('active');
                }
            }
        }
        
    },
    loadCurrentSong: function(){
        _this = this;
        heading.textContent = this.currentSong.name;
        thumbElement.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.source;
        //Lấy về tổng thời gian của bài hát
        audio.onloadedmetadata = function(){
            var time = audio.duration;
            var lineSong = _this.formatTime(time);
            lineLength.innerHTML = lineSong;
        }
        this.activeSong();
        this.setConfig('currentIndex', this.currentIndex);
    },
    loadConfig: function(){
        this.isRepeat = this.config.isRepeat;
        this.isShuffle = this.config.isShuffle;

        shuffleElement.classList.toggle("active", this.isShuffle);

        if(this.isRepeat == 1){
            repeatElement.classList.add('active');
        } else if(this.isRepeat == 2){
            repeatElement.classList.add('active');
            repeatOne.classList.add('active');
        } else{
            repeatOne.classList.remove('active');
            repeatElement.classList.remove('active');
            this.isRepeat = 0;
        }
        this.currentIndex = this.config.currentIndex;

    },
    activeSong: function(){
        const boxActiveSong = $('.boxlist__song.active');
        const activeSong = $(`.data-song-${this.currentIndex}`);
        if(boxActiveSong == null){
            activeSong.classList.add('active');
        } else {
            boxActiveSong.classList.remove('active');
            activeSong.classList.add('active');
        }
    },
    scrollToActiveSong: function(){
        const songActive = $(`.data-song-${this.currentIndex}.active`);
        setTimeout(function(){
            songActive.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 200);
    }
    ,
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },
    previousSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },
    shuffleSong: function(){
        _this = this;
        if(_this.arrSongPlayed.length < _this.songs.length){
            var randomIndex = function(){
                let newIndex;
                do{
                    newIndex = Math.floor(Math.random() * _this.songs.length);
                }while(newIndex === _this.currentIndex);
                return newIndex;
            }
            var indexCheck = randomIndex();
            var check = _this.arrSongPlayed.every(function(e){
                return indexCheck !== e;
            });
            if(check) {
                this.currentIndex = indexCheck;
                this.loadCurrentSong();
                audio.play();
                this.arrSongPlayed.push(indexCheck);
            } else {
                this.shuffleSong();
            }
        }
        else if(_this.arrSongPlayed.length == _this.songs.length){
            if(_this.isRepeat == 1){
                _this.arrSongPlayed = [];
                _this.shuffleSong();
            }
            else{
                _this.arrSongPlayed.push('end');
            }
        };
    },
    formatTime: function(time){
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time - hours * 3600) / 60);
        let seconds = Math.floor(time - hours * 3600 - minutes * 60);

        hours = hours < 10 ? (hours > 0 ? '0' + hours: 0) : hours;
        if(minutes < 10){
            minutes = '0' + minutes;
        }
        if(seconds < 10){
            seconds = '0' + seconds;
        }
        return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds;
    },
    start:function(){
        //Gan cau hinh tu config
        this.loadConfig();
        //định nghĩa các thuộc tính cho object
        this.defineProperties();
        this.renderList();
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //lắng nghe xử lý các sự kiện
        this.handleEvent();
    }
    
}

app.start();
