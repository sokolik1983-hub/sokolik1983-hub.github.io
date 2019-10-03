
$(".js-range-slider").ionRangeSlider({
    type: "double",
    skin: "big",
    min: 1,
    max: 69,
    from: 1,
    to: 69,
    onChange: function (data) {
        console.dir(data);
    }
});
