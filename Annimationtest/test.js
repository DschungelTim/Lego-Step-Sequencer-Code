var element = document.getElementsByClassName('box'),
    style = window.getComputedStyle(element),
    time = style.getPropertyValue('opacity');
    console.log(time);