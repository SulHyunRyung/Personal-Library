
$(function(){
    // $("element").click(function(){
    //     $("#layer_container").css({"display":"inline-block"});
    // });

    $(".ok_btn").click(function(){
        $(this).parents('#layer_container').hide();
    });
});