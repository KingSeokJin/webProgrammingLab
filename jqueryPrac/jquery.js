var i =0;
$(document).ready(function(){
    $("div.out").mouseover(function() { //자식요소간의 이동을 반영함.   
        $("div.out p:first").text("mouse over");
        $("div.out p:last").text(++i);
    })
    $("div.out").mouseout(function(){
        $("div.out p:first").text("mouse out");
    })
    $("#b1").on("click", {url:"https://www.google.co.kr/", winattributes: "resize = 1, scrollbars = 1, status = 1"},max_open);
    function max_open(event){
        var maxwindow = window.open(event.data.url, "", event.data.winattributes);
        maxwindow.moveTo(0,0);
        maxwindow.resizeTo(screen.availWidth, screen.availHeight);
    }

    function flash() {
        $("#off_test").show().fadeOut("slow");
    }
    $("#bind").click(function(){
        $("body").on("click", "#theone", flash).find("#theone").text("Can Click");
    });
    $("#unbind").click(function(){
        $("body").off("click", "#theone", flash).find("#theone").text("Does nothing");
    });

    function update(j) {
        var n = parseInt(j.text(), 10);
        j.text(n+1);
    }
    $("#trigger_test button:first").click(function(){
        update($("span:first"));
    });
    $("#trigger_test button:last").click(function(){
        $("#trigger_test button:first").trigger("click");
        update($("span:last"));
    });

    $("#image").click(function(){
        if($("#image").attr("src") == "pickachu.png") {
            $("#image").attr("src", "Raichu.png"); // 이미지 소스를 Raichu.png로 변경
        }
        else {
            $("#image").attr("src", "pickachu.png"); // 이미지 소스를 pickachu.png로 변경
        }
    });
    
    var imgArray = ["chiko.png", "ggobuk.jpeg", "pengdori.jpeg", "pickachu.png", "Raichu.png"];
    var albumIndex = 0;
    $("#imgAlbum").attr("src", imgArray[albumIndex]);
    $("#imgAlbum").click(function(){
        albumIndex = (albumIndex+1) % imgArray.length;
        $("#imgAlbum").attr("src", imgArray[albumIndex]);
    });


    $(".main-menu").mouseover(function(){
        var menu = $(this);
        menu.css({backgroundColor : "green", "font-size":"20px"});
    });

    $(".main-menu").mouseout(function(){
        var menu = $(this);
        menu.css({background : "none", "font-size":"1em"});
    });
    /*
        $(".main-menu").on("mouseover", funciont(){,,,}); 이렇게 해도됨
    */

        // 이밑에 스케줄 플러스버튼 이벤트처리 
        $("#add_img img").on("click", show_note_form);
        $("#add_note").on("click",push_note);
        $(window).resize(function(){
            change_position($(".popup"));
        })

        function show_note_form(){
            $("#note_form").addClass("popup");
            change_position($(".popup"));
            // 천천히사라지게하는 코드 
            $("#note_form").fadeIn("slow"); // 이거 이펙트 추가해봄
        //    $("#note_form").css("display", "block"); 
        }
        
        function push_note(){
            var title = $("#note_title").val();
            var date = $("#note_date").val();
            var content = $("#note_content").val();
            var str = "<p>" + title + "<br>" + date + "<br>" + content + "</p><br>";
            $("#note_form").fadeOut("slow"); // 이것도 이펙트추가해봄봄
        //   $("#note_form").css("display", "none");
            //$("#note_form").hide();
            $("#note").append(str);
        }

        function change_position(obj){
            var l = ($(window).width()-obj.width())/2;
            var t = ($(window).height()-obj.height())/2;
            obj.css({top : t, left:l});
        }

        // 이 밑에 애니메이션 박스 키우기 실습
        $("#moving_button").click(function(){
            $("#moving_box").animate({
                right:'0',
                height: '+=50px',
                width : '+=50px'
            });
            $("#animation_test").animate({
                height: '+=50px'
            });
        });

        //이밑에 아코디언 실습
        $(".accordion").each(function(){
            var dl = $(this);
            var alldd = dl.find("dd");
            var alldt = dl.find("dt");

            /*밑에 함수 두개로 리팩토링. css도 추가함. dt.closed dd.closed*/ 
            function closeAll(){
                alldd.addClass("closed");
                alldt.addClass("closed");
            }
            function open(dt,dd){
                dt.removeClass("closed");
                dd.removeClass("closed");
            }

            closeAll();
            alldt.click(function(){
                var dt = $(this);
                var dd = dt.next();
                closeAll();
                open(dt,dd);
            });
            /*
            alldd.hide();
            alldt.css("cursor", "pointer");
            alldt.click(function(){
             alldd.hide(); //다시한번 dd들 hide
            var dt = $(this);
            var dd = dt.next();
            dd.show();  
            alldt.css("cursor", "pointer");
            dt.css("cursor", "default");
            });
            */
        });

        var interval = 4000;
        $(".slideshow").each(function(){
            var timer;
            var container = $(this); /*container는 각 액자를 뜻함*/
            function switchImg(){ /*없어질거 1개(현재)랑 보여질거 1개(다음) 생각하고, 현재께 없어지면서 인덱스 맨뒤로 가게-> 새로 append해주면 맨뒤에 추가되는거*/
                var imgs = container.find("img");
                var first = imgs.eq(0);
                var second = imgs.eq(1);
                first.appendTo(container).fadeOut(2000);
                second.fadeIn();    
            } 

            function startTimer(){
                timer = setInterval(switchImg, interval);
            }
            
            function stopTimer(){
                clearInterval(timer);
            }

            container.hover(stopTimer, startTimer); /* hover(마우스 오버 시 동작할 함수, 마우스아웃 시 동작할 함수)*/ 
            startTimer();
        });
});

