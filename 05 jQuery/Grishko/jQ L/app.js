eventInput = () => {
    let reg = /^[\d]{3}\-[\d]{2}\-[\d]{3}-[\d]{2}-[\d]{2}$/;
    if (reg.test($(".number").val()) && $(".number").val().length <= 17) {
        $('.number').attr("style", "border : 2px solid blue");
        $('.error').attr("style", "display: none");

    } else {
        $('.number').attr("style", "border : 2px solid orange");
        $('.error').attr("style", "display: inline");
        window.alert("Номер введен некорректно. Проверьте правильность введенных данных. ОБРАЗЕЦ: 375-29-657-20-31");
    }
}
