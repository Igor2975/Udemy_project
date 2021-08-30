<?php
//для получения данных JSON
$_POST = json_decode(file_get_contents("php://input"),true);

//для обычных данных
echo var_dump($_POST);//берет данные с клиента,превращает в строку и показывает нам на клиенте