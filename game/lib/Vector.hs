module Vector where

type Vector = (Float, Float)

data XY = XY {x :: Float, y :: Float}

add :: Vector -> Vector -> Vector
add (x1, y1) (x2, y2) = (x1 + x2, y1 + y2)

sub :: Vector -> Vector -> Vector
sub (x1, y1) (x2, y2) = (x1 - x2, y1 - y2)

scale :: Float -> Vector -> Vector
scale n (x, y) = (x * n, y * n)

scalar :: Vector -> Vector -> Float
scalar (x1, y1) (x2, y2) = x1 * x2 + y1 * y2

rotate90 :: Vector -> Vector
rotate90 (x, y) = (x, -y)

sym :: Vector -> Vector -> Vector
sym axe v = sub (scale (2 * (scalar axe v / scalar axe axe)) axe) v

toXY :: Vector -> XY
toXY (x, y) = XY {x = x, y = y}

angle :: Vector -> Float
angle (x, y) = atan2 x y

magnitude :: Vector -> Float
magnitude (x, y) = sqrt (x ^ 2 + y ^ 2)
