$(document).ready(function(){
    var form = $(".translationForm");

    $(".submitButton").on("click", function(e){
        e.preventDefault();
        var sourceText = $(".sourceText").val();
        sourceLang = "en";
        targetLang = "yi";
        appendText(sourceText);

        translateRecurse(sourceLang, targetLang, sourceText, sourceText, 0, 20);

    });

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

