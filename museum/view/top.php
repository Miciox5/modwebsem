<?php
    //if(!isset($_SESSION)) {session_start();}
?>
<html lang="it">
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script type="text/javascript" src="../controller/prova.js"></script>

        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="./style.css" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>Titolo </title>
    </head>
    <body>

        <div class="navbar">
            <a id="logo_img" href="./">
                <img  src="./logo/logo_large%20-%20Copia.png">
            </a>
            <ul class="choice-navbar">
                <li>
                    <button id="list-menu-item">
                        <a href="#">Marketplace</a>
                    </button>
                <li>
                    <button>
                        <a href="#">Wallet</a>
                    </button>
                </li>
                <li>
                    <button>
                        <a href="#">Risorse</a>
                    </button>
                </li>
            </ul>
            <form class="search-form">
                <input type="text" placeholder="Search..">
                <button type="submit"><i class="fa fa-search"></i></button>
            </form>
        </div>

