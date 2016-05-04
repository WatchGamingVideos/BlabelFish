$(document).ready(function(){
    var form = $(".translationForm");

    $(".submitButton").on("click", function(e){
        e.preventDefault();

        $(".translationList").empty();

        var sourceText = $(".sourceText").val();
        sourceLang = $(".sourceLang").val();
        targetLang = $(".targetLang").val();
        appendText(sourceText);
        history.pushState({},"BlabelFish","?q=" + encodeURI(sourceText));

        translateRecurse(sourceLang, targetLang, sourceText, sourceText, 0, 20);

    });

    var queries = {};
    $.each(document.location.search.substr(1).split('&'),function(c,q){
        var i = q.split('=');
        if(i[0] && i[1]){
            queries[i[0].toString()] = i[1].toString();
        }
    });
    if (queries["q"]){
        console.log(queries);
        $(".sourceText").val(encodeURI(queries["q"]));
    }


    function appendText(entryText){
        $(".translationList").append(
            $("<li>").append(entryText)
        );
    }

    function translateRecurse(sourceLang, targetLang, prevSourceText, sourceText, depth, maxdepth){
        var api_url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
            + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

        console.log(api_url);

        $.ajax({
            type: "GET",
            url: api_url,
            success: function(data) {
                console.log(data);
                alert();
            },
            error: function(resp, b){
                var respText = resp.responseText;
                respText = respText.replace(/,+/g,",");
                //var respObj = JSON.parse(resp.responseText);

                var respObj = JSON.parse(respText);
                respObj = respObj[0][0];
                console.log(respObj[0]);

                var translatedText = respObj[0];
                appendText(translatedText);
                console.log(respObj);
                console.log(sourceLang);
                console.log(targetLang);
                if (translatedText == prevSourceText){
                    appendText("Found equilibrium");
                }
                else if (depth < maxdepth){
                    translateRecurse(targetLang, sourceLang, sourceText, translatedText, depth+1, maxdepth);
                }
            }
        });
    }

});
