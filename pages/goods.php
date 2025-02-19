<?php
$resSql = "SELECT *
FROM reservation
INNER JOIN user
ON reservation.user_idx = user.user_idx
WHERE user.user_idx = :session_user_idx
ORDER BY reservation_idx DESC";

$stmt = $pdo->prepare($resSql);
$stmt->bindParam(":session_user_idx", $_SESSION['user_idx']);
$stmt->execute();
$reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

$goodsSql = "SELECT * FROM goods";

$goodsStmt = $pdo->prepare($goodsSql);
$goodsStmt->execute();
$goods = $goodsStmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($goods as $good):
endforeach;

if (isset($_SESSION["username"])){
    if ($_SESSION["username"] == "manager")
    echo "
    <script>
    location.href='sub04_manager'
    </script>";
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["action"])) {
        $action = $_POST["action"];

        switch ($action) {
            case 'interestGoods':
                $userIdx = $_SESSION['user_idx'];
                $interestGoodsId = $_POST['goods_idx'];

                $insertSql = "INSERT INTO interested (user_idx, goods_idx) VALUES (:user_idx, :goods_idx)";
                $insertStmt = $pdo->prepare($insertSql);
                $insertStmt->bindParam(":user_idx", $userIdx);
                $insertStmt->bindParam(":goods_idx", $interestGoodsId);
                $insertStmt->execute();
                header("Location: /mypage");
                break;
            case 'basket':
                $goodsIdx = $_POST["goods_idx"];
                $cartInsertSql = "INSERT INTO basket (user_idx, goods_idx) VALUES (:user_idx, :goods_idx)";
                $cartInsertStmt = $pdo->prepare($cartInsertSql);
                $cartInsertStmt->bindParam(":user_idx", $_SESSION['user_idx']);
                $cartInsertStmt->bindParam(":goods_idx", $goodsIdx);
                $cartInsertStmt->execute();

                header("Location: /mypage");
                break;
            case 'buyNow':
                @header("Location: /goodsPayment");
                break;
            default:
                echo ("?");
                break;
        }
    }
}

?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>skills baseball park - goods</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="./style.css">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
</head>

<body>
    <?php include ("./components/header.php") ?>
    <h1>Goods</h1>
    <div id="goodsContainer">
        <?php foreach ($goods as $good): ?>
            <img onclick="showGoodsModal('<?php echo $good['goods_idx']; ?>');" style="width: 300px; height: 400px;"
                src="<?php echo $good['goods_image']; ?>">
        <?php endforeach; ?>
        <?php foreach ($goods as $good): ?>
            <div class="modal fade" id="goodsModal<?php echo $good['goods_idx']; ?>" tabindex="-1"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel"><?php echo $good['goods_name']; ?></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <img src="<?php echo $good['goods_image']; ?>">
                            <p>
                                <?php echo $good['description']; ?>
                                <br>
                                <?php echo $good['goods_price']; ?>원
                            </p>
                            <div id="goodsDiv">
                                <form class='goodsForm' action='' method='post'>
                                    <input type='hidden' name='action' value='interestGoods'>
                                    <input type='hidden' name='goods_idx' class="goodsActionBtn"
                                        value='<?php echo $good['goods_idx']; ?>'>
                                    <button onclick="goodsIdxValueCheck(this)" id='interestBtn' type='submit'
                                        name='interest_goods_idx'>관심goods등록</button>
                                </form>
                                <form class='goodsForm' action='' method='post'>
                                    <input type='hidden' name='action' value='basket'>
                                    <input type='hidden' name='goods_idx' class="goodsActionBtn"
                                        value='<?php echo $good['goods_idx']; ?>'>
                                    <button onclick="goodsIdxValueCheck(this)" id='basketBtn' type='submit'
                                        name='shopping_basket_idx'>장바구니</button>
                                </form>
                                <form class='goodsForm' action='' method='post'>
                                    <input type='hidden' name='action' value='buyNow'>
                                    <input type='hidden' name='goods_idx' class="goodsActionBtn"
                                        value='<?php echo $good['goods_idx']; ?>'>
                                    <button onclick="goodsIdxValueCheck(this)" id='buyNowBtn' type='submit'
                                        name='buy_now_idx'>바로구매</button>
                                </form>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <?php include ("./components/footer.php") ?>
    <script src="./선수제공파일/bootstrap-5.2.0-dist/js/bootstrap.js"></script>
    <script src="./script.js"></script>
</body>

</html>