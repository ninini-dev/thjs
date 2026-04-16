const EnemyAspect = Object.freeze({
    TINY_BLUE:0,
    TINY_RED:1,
    TINY_GREEN:2,
    TINY_GOLD:3,
    COUNT:4
});
const ENEMY_ASPECT_DATA = Object.freeze({
    [EnemyAspect.TINY_BLUE]:{x:0, y:256, w:32, h:32},
    [EnemyAspect.TINY_RED]:{x:0, y:288, w:32, h:32},
    [EnemyAspect.TINY_GREEN]:{x:0, y:320, w:32, h:32},
    [EnemyAspect.TINY_GOLD]:{x:0, y:352, w:32, h:32},
});