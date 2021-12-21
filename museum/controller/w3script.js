/**
 * @author Matteo Miceli
 */
$(document).ready(function () {

    $(document.getElementById("myFstOverlay")).on("click",w3_open());
    $(document.getElementById("myOverlay")).on("click",w3_close());


    // Open and close sidebar
    function w3_open() {
        $(document.getElementById("mySidebar")).attr("display","block");
        $(document.getElementById("myOverlay")).attr("display","block");
    }

    function w3_close() {
        $(document.getElementById("mySidebar")).attr("display","none");
        $(document.getElementById("myOverlay")).attr("display","none");
    }

})