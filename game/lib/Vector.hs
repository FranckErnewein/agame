module Vector where

type Vec2 = (Float, Float)

data XY = XY {x :: Float, y :: Float}

test :: Int -> Int
test x = x + x

add :: Vec2 -> Vec2 -> Vec2
add (x1, y1) (x2, y2) = (x1 + x2, y1 + y2)

sub :: Vec2 -> Vec2 -> Vec2
sub (x1, y1) (x2, y2) = (x1 - x2, y1 - y2)

scale :: Float -> Vec2 -> Vec2
scale n (x, y) = (x * n, y * n)

scalar :: Vec2 -> Vec2 -> Float
scalar (x1, y1) (x2, y2) = x1 * x2 + y1 * y2

rotate90 :: Vec2 -> Vec2
rotate90 (x, y) = (x, -y)

sym :: Vec2 -> Vec2 -> Vec2
sym axe v = sub (scale (2 * (scalar axe v / scalar axe axe)) axe) v

toXY :: Vec2 -> XY
toXY (x, y) = XY {x = x, y = y}

angle :: Vec2 -> Float
angle (x, y) = atan2 x y

magnitude :: Vec2 -> Float
magnitude (x, y) = sqrt (x ^ 2 + y ^ 2)
