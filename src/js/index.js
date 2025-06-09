const img_quantity = 4;
let img_counter = 1;

document.querySelector('.scroller .right').addEventListener('click', () => {
    if (img_counter == img_quantity)
        img_counter = 1;
    else img_counter++;
    changeImage(img_counter);
});

document.querySelector('.scroller .left').addEventListener('click', () => {
    if (img_counter == 1)
        img_counter = img_quantity;
    else img_counter--;
    changeImage(img_counter)
});

function changeImage(counter) {
    document.querySelector('.scroller').style.background =
        `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
      url('src/img/slider/slider${counter}.jfif') center center / cover no-repeat`;
    updateScrollerTabs();
}


function updateScrollerTabs() {
    let tabs = document.querySelectorAll('.scroller_tab_item');
    tabs.forEach((el) => el.style.opacity = 0.6);
    tabs[img_counter - 1].style.opacity = 1;
}

///////////////////VIDEO?/////////////////

const play_button = document.querySelector("#player #play-video");
const video = document.querySelector('#my-video');

document.querySelector('#player #mute-video').addEventListener('click', (e) => {
    video.muted = !video.muted;
    e.target.style.backgroundImage = `url('src/img/volume-${!video.muted ? 'enable' : 'disable'}.png')`;

})

document.querySelector('#player #play-video').addEventListener('click', videoPlayToggle);
document.querySelector('#player #my-video').addEventListener('click', videoPlayToggle);

function videoPlayToggle() {
    if (video.paused == false) {
        video.pause();
    }
    else {
        video.play();
    }
    play_button.classList.toggle('hidden')
}

//document.querySelector('#player #my-video').addEventListener('mouseout', () => {
//   play_button.style.visibility = "visible";
//       if (!video.paused) {
//           setTimeout(() => {
//               play_button.style.visibility = "hidden";
//           }, 2000);
//       }
//});