/**
 *
 * @author Matteo Miceli
 */
$(document).ready(function () {
    const graphDBRepoLocation = "http://localhost:7200/repositories/Project";

    /**
     * SECTION PROFILE PAGE:
     *       In this section it was managed all page component in profile page.
     */

    function createOwnItemInCentralView(arrayItem) {
        // attachement node
        var shopBar = $(document.getElementsByClassName("w3-row w3-grayscale"));
        // delete previews elements
        shopBar.empty();

        // set number of elements
        var numItemsBar = $(document.getElementById('numElement'));
        if(arrayItem.length==0) numItemsBar.text("Non possiedi elementi!")
        else numItemsBar.text(arrayItem.length+" items")

        // first section of elements
        var nftElement1 = $(document.createElement("div"));
        nftElement1.attr('class','w3-col l3 s6');

        // creation front-end elements for shopbar
        $.each(arrayItem, function (i, item){
            var nftElement2 = $(document.createElement("div"));
            nftElement2.attr('class','w3-display-container');

            nftElement1.append(nftElement2);

            var imgElement =  $(document.createElement("img"));
            var filePath = "/museum/view/artwork/"+item.Titolo+".png";
            imgElement.attr('src',filePath);
            imgElement.attr('style','width:100%');

            nftElement2.append(imgElement);

            var nftElement3 = $(document.createElement("div"));
            nftElement3.attr('class','w3-display-middle w3-display-hover');

            imgElement.after(nftElement3);

            var titleNFT = $(document.createElement("p"));
            titleNFT.text(item.Titolo);
            titleNFT.append("<br>");
            titleNFT.append(
                $(document.createElement("b"))
                    .attr('class','w3-text-red')
                    .text(item.Value+" ETH"));

            nftElement2.after(titleNFT);

            shopBar.append(nftElement1);
        });
    }

    function w3_profile_view_own_elem() {
        var user = $(document.getElementById("title-page"))
                        .attr('value');


        var qr = "PREFIX : <http://www.semanticweb.org/museum#>\n" +
            "            select (?titolo as ?Titolo) (?v as ?Value)\n" +
            "        where{\n" +
            "        :User1 :possiede ?nft.\n" +
            "                ?nft :tokenDi ?q;\n" +
            "        :valoreNFT ?v;\n" +
            "        :nomeNFT ?titolo.\n" +
            "        }";

        var postData = {
            query: qr,
            infer: true,
            sameAs: true,
            //limit: 1,
            //offset: 0
        }

        $.ajax({
            url: graphDBRepoLocation,
            type: 'GET',
            data: postData,
            headers:{
                'Accept':'application/json'
            },
            success: function (data) {
                var l = data.results.bindings.length;
                var item_array = data.results.bindings;
                var elementsHTML = [];

                $.each(item_array, function (i, item){
                    // get element in sparql query
                    var elem_info = {
                        Titolo : getItemSPARQL(item.Titolo.type
                            ,item.Titolo.value),
                        Value : getItemSPARQL(item.Value.type
                            ,item.Value.value)
                    }
                    elementsHTML[i] = elem_info;
                });
                console.log(elementsHTML);
                createOwnItemInCentralView(elementsHTML);
            }
        })
    }

    function w3_profile_view_title() {
        var title = $(document.getElementById("title-page"));
        var nameProfile="";
        if(!title.text().trim()) {
            title = "Matteo Miceli - matMiceli";
            nameProfile = "User1";
        }
        setTitleSection(title,nameProfile);
    }

    /**
     *   SECTION ANIMATE FUNCTION SIDEBAR:
     *       In this section it was managed all animation about sidebar.
     */

    function clickSubSidebar(element) {
        element.on("click", function () {
            var x = $(this).next();
            if (x.attr('class').indexOf("w3-show")==-1) {
                x[0].className += " w3-show";
            } else {
                x[0].className = x[0].className.replace(' w3-show','');
            }
        });
    }

    function selectedTipoOpera(elem) {
        if($(location).attr("href")=="http://localhost/museum/view/index.html") {
            elem.on("click", function () {
                w3_menu_title_section(elem.text(), elem.attr('value'));
                w3_add_central_elements(elem.attr('value'));
            })
        }else {
            elem.on("click", function () {
                window.location.replace("http://localhost/museum/view/index.html")
            })
        }
    }


    /**
     *  SECTION SHOW-SIDEBAR:
     *      In this section it was managed data sections to show to user.
     */

    function createSubSidebarElements(superElemementHTML,arrayItem){
        //create div to insert in subSidebar section
        var divSubSection = $(document.createElement("div"))
             .attr('id','demoAcc')
             .attr('class','w3-bar-block w3-hide w3-padding-large w3-medium');

        //append container div to sidebar
        superElemementHTML.after(divSubSection);

        $.each(arrayItem, function (i, item){
            //create element for subSidebar
            var subSidebar_element =
                $(document.createElement("a"))
                .attr('class','w3-bar-item w3-button');

            if(item.countT>=1) {

                //create subElement
                subSidebar_element.attr('class','w3-bar-item w3-button w3-light-grey');
                var down_narrow =
                    $(document.createElement("i"))
                        .attr('class','fa fa-caret-right w3-margin-right')
                        .attr('value',item.TipiOpere);
                clickSubSidebar(subSidebar_element);

                // append element in page with icon narrow down
                divSubSection.append(
                      (subSidebar_element)
                          .append(down_narrow)
                            .append(item.Label));

                // execute function for other subset of element
                subSectionSidebarElements(subSidebar_element,item.TipiOpere);
            }else {
                subSidebar_element
                    .attr('class','w3-bar-item w3-button')
                    .attr('value',item.TipiOpere)
                    .attr('href','#'+item.Label)
                // append element in page
                divSubSection.append(subSidebar_element.append(item.Label));
                selectedTipoOpera(subSidebar_element);
            }
        });
    }

    // add sub section on elements in sidebar
    // take other levels in SPARQL query
    function subSectionSidebarElements(superElementHTML,superItem){

        // it take all sub class of TipoOpera (other level in hierarcy TipoOpera)
        var qr = "PREFIX : <http://www.semanticweb.org/museum#>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "select (?t as ?TipiOpere) (?l as ?Label) (count(?p) as ?countT)\n" +
            "where {\n" +
            "\t\t{\n" +
            "         \t?t rdfs:subClassOf :"+superItem+".\n" +
            "                ?p rdfs:subClassOf ?t.\n" +
            "    \t}\n" +
            "        UNION\n" +
            "        {\n" +
            "            ?t rdfs:subClassOf :"+superItem+".\n" +
            "            filter not exists{\n" +
            "                ?p rdfs:subClassOf ?t.\n" +
            "            }\n" +
            "    \t}\n" +
            "        filter not exists {\n" +
            "            ?t rdfs:subClassOf ?x.\n" +
            "            ?x rdfs:subClassOf :"+superItem+".\n" +
            "        }\n" +
            "    \n" +
            "    \t?t rdfs:label ?l.\n" +
            "    \tFILTER (langMatches(lang(?l),\"it\"))\n" +
            "} \n" +
            "group by ?l ?t";

        var postData = {
            query: qr,
            infer: true,
            sameAs: true,
            //limit: 1,
            //offset: 0
        }

        $.ajax({
            url: graphDBRepoLocation,
            type: 'GET',
            data: postData,
            headers:{
                'Accept':'application/json'
            },
            success: function (data) {
                var l = data.results.bindings.length;
                var item_array = data.results.bindings;
                var elementsHTML = [];

                $.each(item_array, function (i, item){
                    // get element in sparql query
                    var elem_info = {
                        TipiOpere : getItemSPARQL(item.TipiOpere.type
                            ,item.TipiOpere.value),
                        Label : getItemSPARQL(item.Label.type
                            ,item.Label.value),
                        countT    : getItemSPARQL(item.countT.type
                            ,item.countT.value)
                    }
                    elementsHTML[i] = elem_info;
                });
                createSubSidebarElements(superElementHTML,elementsHTML);
            }
        })
    }

    function createSidebarElements(arrayItem){
        // attachement node
        var sidebar = $(document.getElementsByClassName("w3-padding-64 w3-large w3-text-grey"));

        $.each(arrayItem, function (i, item){
            //create element to insert in sidebar section
            var sidebar_element = $(document.createElement("a"));

            // if elements has subClasses, create subMenu
            if(item.countT>=1) {
                sidebar_element.attr('class','w3-button w3-block w3-white w3-left-align');
                sidebar_element.attr('id','item-sidebar');
                var down_narrow =
                    $(document.createElement("i"))
                        .attr('class','fa fa-caret-down')
                        .attr('value',item.TipiOpere);
                clickSubSidebar(sidebar_element);
                // append element in page with icon narrow down
                sidebar.append(
                    (sidebar_element.append(item.Label))
                        .append(down_narrow));

                subSectionSidebarElements(sidebar_element,item.TipiOpere);

            }else {
                sidebar_element
                    .attr('class','w3-bar-item w3-button')
                    .attr('value',item.TipiOpere)
                    .attr('href','#'+item.Label)

                // append element in page
                //sidebar.append(sidebar_element.append(item.Label));
                sidebar.append(sidebar_element.append(item.Label));
                selectedTipoOpera(sidebar_element);
            }
        });
    }

    function getItemSPARQL(itemType,itemValue){
        switch (itemType) {
            case "uri":
                return (itemValue.split("#"))[1];
            case "literal":
                return itemValue;
            default:
                return;
        }
    }

    function w3_bar_item_request(){
        // it take all sub class of TipoOpera (first level in hierarcy TipoOpera)
        var qr ="PREFIX : <http://www.semanticweb.org/museum#> \n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "select distinct (?t as ?TipiOpere) (?l as ?Label) (count(?p) as ?countT) \n" +
            "\twhere {\n" +
            "    \t{?t rdfs:subClassOf :ArtWork.\n" +
            "            ?p rdfs:subClassOf ?t.}\n" +
            "            UNION\n" +
            "            {\n" +
            "            \t?t rdfs:subClassOf :ArtWork.\n" +
            "            \tfilter not exists{\n" +
            "            \t\t?p rdfs:subClassOf ?t.}\n" +
            "    \t\t}\n" +
            "    \t\tfilter not exists{\n" +
            "        \t\t?t rdfs:subClassOf ?x.\n" +
            "        \t\t?x rdfs:subClassOf :ArtWork.\n" +
            "    \t\t}\n" +
            "    \t?t rdfs:label ?l.\n" +
            "    \tFILTER (langMatches(lang(?l),\"it\"))\n" +
            "\t}\n" +
            "group by ?l ?t\n" +
            "order by ?l ?t";

        var postData = {
            query: qr,
            infer: true,
            sameAs: true,
            //limit: 1,
            //offset: 0
        }

        $.ajax({
            url: graphDBRepoLocation,
            type: 'GET',
            data: postData,
            headers:{
                'Accept':'application/json'
            },
            success: function (data) {
                var l = data.results.bindings.length;
                var item_array = data.results.bindings;
                var elementsHTML = [];

                $.each(item_array, function (i, item){
                    // get element in sparql query
                    var elem_info = {
                        TipiOpere : getItemSPARQL(item.TipiOpere.type
                                                    ,item.TipiOpere.value),
                        Label : getItemSPARQL(item.Label.type
                                                    ,item.Label.value),
                        countT    : getItemSPARQL(item.countT.type
                                                    ,item.countT.value)
                    }
                    elementsHTML[i] = elem_info;

                });
                createSidebarElements(elementsHTML);
            }
        })
    }


    /**
     *  SECTION SHOP WINDOW:
     *      In this section it was managed the central of page.
     *      It has been showm all product on sale.
     */


    /**
     * sub-SECTION CENTRAL VIEW:
     *      In this section it was created the elements for page.
     */

    function createItemInCentralView(arrayItem) {
        // attachement node
        var shopBar = $(document.getElementsByClassName("w3-row w3-grayscale"));
        // delete previews elements
        shopBar.empty();

        // set number of elements
        var numItemsBar = $(document.getElementById('numElement'));
        if(arrayItem.length==0) numItemsBar.text("Non ci sono elementi in questa sezione!")
        else numItemsBar.text(arrayItem.length+" items")

        // first section of elements
        var nftElement1 = $(document.createElement("div"));
        nftElement1.attr('class','w3-col l3 s6');

        // creation front-end elements for shopbar
        $.each(arrayItem, function (i, item){
            var nftElement2 = $(document.createElement("div"));
            nftElement2.attr('class','w3-display-container');

            nftElement1.append(nftElement2);

            var imgElement =  $(document.createElement("img"));
            var filePath = "/museum/view/artwork/"+item.Titolo+".png";
            imgElement.attr('src',filePath);
            imgElement.attr('style','width:100%');

            nftElement2.append(imgElement);

            var spanElement = $(document.createElement("span"));
            spanElement.attr('class','w3-tag w3-display-topleft');
            spanElement.text('New');

            imgElement.after(spanElement);

            var nftElement3 = $(document.createElement("div"));
            nftElement3.attr('class','w3-display-middle w3-display-hover');

            spanElement.after(nftElement3);

            var buttonBuy = $(document.createElement("button"));
            buttonBuy.attr('class','w3-button w3-black');
            buttonBuy.text("Compra Ora");

            nftElement3.append(buttonBuy);

            var titleNFT = $(document.createElement("p"));
            titleNFT.text(item.Titolo);
            titleNFT.append("<br>");
            titleNFT.append(
                $(document.createElement("b"))
                    .attr('class','w3-text-red')
                    .text(item.Value+" ETH"));

            nftElement2.after(titleNFT);

            shopBar.append(nftElement1);
        });
    }

    function addArtWorkElements(section) {
        // it take all sub class of TipoOpera (first level in hierarcy TipoOpera)
        var qr ="PREFIX : <http://www.semanticweb.org/museum#>\n" +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
            "select (?titolo as ?Titolo) (?v as ?Value)\n" +
            "where{\n" +
            "    ?e rdf:type :"+section+".\n" +
            "    ?nft :tokenDi ?e;\n" +
            "     \t :valoreNFT ?v;\n" +
            "         :nomeNFT ?titolo.\n" +
            "    FILTER not exists{\n" +
            "        ?e1 rdf:type :"+section+";\n" +
            "            owl:equivalentClass ?e.\n" +
            "    }\n" +
            "    FILTER not exists{\n" +
            "        ?nft :èPossedutoDa ?user.\n" +
            "    }\n" +
            "}\n";

        var postData = {
            query: qr,
            infer: true,
            sameAs: true,
            //limit: 1,
            //offset: 0
        }

        $.ajax({
            url: graphDBRepoLocation,
            type: 'GET',
            data: postData,
            headers:{
                'Accept':'application/json'
            },
            success: function (data) {
                var l = data.results.bindings.length;
                var item_array = data.results.bindings;
                var elementsHTML = [];

                $.each(item_array, function (i, item){
                    // get element in sparql query
                    var elem_info = {
                        Titolo : getItemSPARQL(item.Titolo.type
                            ,item.Titolo.value),
                        Value : getItemSPARQL(item.Value.type
                            ,item.Value.value)
                    }
                    elementsHTML[i] = elem_info;
                });
                createItemInCentralView(elementsHTML);
            }
        })
    }

    function w3_add_central_elements(section){
        addArtWorkElements(section);
    }

    function setTitleSection(item,section){
        var itemTitle = $(document.getElementById("title-page"));
        itemTitle.text(item);
        itemTitle.attr('value',section);
    }

    function w3_menu_title_section(title,section) {
        if(!title.trim()) {
            title = "Brano Musicale";
            section = "Track";
        }
        setTitleSection(title,section);
    }

    function w3_menu_central_view() {
        var title = $(document.getElementById("title-page"));
        w3_menu_title_section(title.text(),title.attr('value'));
        w3_add_central_elements(title.attr('value'));
    }

    /**
     *  SECTION START FUNCTION:
     *      In this section it was executed start function to set main page.
     */

    if($(location).attr("href")=="http://localhost/museum/view/index.html"
        ||$(location).attr("href")=="http://localhost/museum/view/index.html#") {
        w3_bar_item_request();
        w3_menu_central_view();
    }else if($(location).attr("href")=="http://localhost/museum/view/profile.html"
        ||$(location).attr("href")=="http://localhost/museum/view/profile.html#") {
        w3_bar_item_request();
        w3_profile_view_title();
        w3_profile_view_own_elem();
    }
})