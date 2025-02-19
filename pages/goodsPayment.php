<?php
$goodsQuery = "SELECT * FROM goods";
$goodsStatement = $pdo->prepare($goodsQuery);
$goodsStatement->execute();
$goods = $goodsStatement->fetchAll(PDO::FETCH_ASSOC);

$paymentQuery = "SELECT goodspayment.*, goods.goods_name, goods.goods_price, goods.goods_image 
                 FROM goodspayment 
                 INNER JOIN goods ON goodspayment.goods_idx = goods.goods_idx";
$paymentStatement = $pdo->prepare($paymentQuery);
$paymentStatement->execute();
$payments = $paymentStatement->fetchAll(PDO::FETCH_ASSOC);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["goods_idx"])) {
        $goods_idx = $_POST["goods_idx"];
        $user_idx = $_SESSION["user_idx"];
        $insertSql = "INSERT INTO goodspayment (user_idx, goods_idx, is_payment) VALUES (:user_idx, :goods_idx, 1)";
        $insertStmt = $pdo->prepare($insertSql);
        $insertStmt->bindParam(':user_idx', $user_idx);
        $insertStmt->bindParam(':goods_idx', $goods_idx);
        $insertStmt->execute();
        header("Location: /mypage");
        exit();
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
    <div class="row">
        <?php
        if ($goods !== null) {
            foreach ($goods as $item): ?>
                <div class="col-md-4">
                    <img style="width: 300px" src="<?php echo $item['goods_image']; ?>" class="card-img-top"
                        alt="<?php echo $item['goods_name']; ?>">
                </div>
                <div class="col-md-8">
                    <h2><?php echo $item['goods_name']; ?></h2>
                    <p>단가: <?php echo $item['goods_price']; ?>원</p>
                    <form action="" method="post">
                        <input type="hidden" name="goods_idx" value="<?php echo $item['goods_idx']; ?>">
                        <button type="submit" class="btn btn-primary">구매하기</button>
                    </form>
                </div>
            <?php endforeach;
        } else {
            echo ("상품 정보를 불러올 수 없습니다.");
        }
        ?>
    </div>
    <?php include ("./components/footer.php") ?>
    <script src="./선수제공파일/bootstrap-5.2.0-dist/js/bootstrap.js"></script>
    <script src="./script.js"></script>
</body>

</html>