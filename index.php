<?php
function is_prime($num)
{
    $prime = true;
    for ($i = 2; $i <= $num / 2; $i += 1)
        if ($num % $i == 0) {
            $prime = false;
            break;
        }
    return $prime;
}

function display_array($arr)
{
    echo join(", ", $arr);
}
$primes = [];
for ($i = 2; $i < 100; $i++)
    if (is_prime($i))
        array_push($primes, $i);


function sum_of_digits($x)
{
    return array_sum(array_map("intval", str_split(strval($x))));
}

function get_factors($num)
{
    if ($num == 1)
        return [1];
    $factors = [1, $num];
    $end = $num;
    for ($i = 2; $i < $end; $i++) {
        if ($num % $i == 0) {
            array_push($factors, $i, $num / $i);
            $end = $num / $i;
        }
    }
    sort($factors);
    return array_unique($factors);
}

function factor_strength($num)
{
    return sizeof(get_factors($num));
}

$num = intval(readline("Enter a number: "));
$factors = get_factors($num);
$no_factors = sizeof($factors);

echo "The number has $no_factors factors. \nFactors:  ";
display_array($factors);
