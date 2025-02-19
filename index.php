<?php
include("./api/DBconnect.php");

session_start();

$request = $_SERVER['REQUEST_URI'];
$path = explode("?", $request);
$path[1] = isset($path[1]) ? $path[1] : null;
$resource = explode("/", $path[0]);
$pages = "";
switch ($resource[1]) {
    case '':
        $pages = './pages/index.php';
        break;
    case 'information':
        $pages = './pages/information.php';
        break;
    case 'statistics':
        $pages = './pages/statistics.php';
        break;
    case 'reservation':
        $pages = './pages/reservation.php';
        break;
    case 'goods':
        $pages = './pages/goods.php';
        break;
    case 'signup':
        $pages = './pages/signup.php';
        break;
    case 'signin':
        $pages = './pages/signin.php';
        break;
    case 'logout':
        $pages = './pages/logout.php';
        break;

    case 'mypage':
        $pages = './pages/mypage.php';
        break;

    case 'reservationAdmin':
        $pages = './pages/reservationAdmin.php';
        break;

    case 'reservationManager':
        $pages = './pages/reservationManager.php';
        break;

    case 'goodsPayment':
        $pages = './pages/goodsPayment.php';
        break;

    case 'goodsManager':
        $pages = './pages/goodsManager.php';
        break;


    default:
        echo "ㄴㄴ";
        return 0;
}
include($pages);
?>