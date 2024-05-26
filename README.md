# tsgenerator
Foo Dog TypeScript Generator

## Install

`npm install`

## Build

`npm run build`

## Test

`npm test`

## Status
2024-05-25

Tests work, but HTML output is all one line, the difference between references and literal strings 
in the node.val property is unclear, I'd like/need to get rid of the `handleStart` and `handleEnd`
methods but need a way to replace it with a method that allows the inclusion of child nodes.