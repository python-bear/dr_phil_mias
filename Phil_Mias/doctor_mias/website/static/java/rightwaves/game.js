"use strict";

const WIDTH = 100;
const HEIGHT = 96;
const BOTTOM_BAR_HEIGHT = 4;
const PHASER_OUTLINE_COL = [126, 125, 125];
const PHASER_TOP_COL = [18, 77, 144];
const PHASER_BOTTOM_COL = [11, 48, 90];
const PHASER_END_COL = [49, 126, 215];
const SCROLL_SPEED = 0.5;
const FPS = 30;
const PAUSE_BEFORE_DEATH_REPLAY = FPS * 1;

const NO_BOUNCE = 0;
const BOUNCE_VERTICAL = 1;
const BOUNCE_HORIZONTAL = 2;

const FALL_L = -2;
const FIRE_L = "FIRE_L";
const MOVE_L = -1;
const MOVE_R = 1;
const MOVE_D = 1;
const MOVE_U = -1;
const STOP_L = -0.1;
const STOP_R = 0.1;
const CLOCKWISE = 3;
const ANTICLOCKWISE = 4;
const RETRACTED = 5;

const DR = [ 0.25,  0.25];
const DL = [-0.25,  0.25];
const UR = [ 0.25, -0.25];
const UL = [-0.25, -0.25];

const WHITE_KEY = {};

for (const letter of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    WHITE_KEY[letter] = [255, 255, 255];
}

const IMAGES = {
    "ship": {
        pixels: [
            "..www.......",
            "dddddww.bbb.",
            "rllldddcccwb",
            "dddhlllccccb",
            "rddddddaccb.",
            "..aaa......."
        ],
        key: {
            "w": [255, 255, 255],
            "d": [88, 88, 88],
            "b": [77, 111, 249],
            "r": [141, 0, 0],
            "l": [126, 125, 125],
            "h": [192, 192, 192],
            "c": [3, 157, 157],
            "a": [42, 42, 42]
        }
    },
    "ship-nose-attach": {
        "pixels": [
            "a...a",
            "bcdeb",
            "beedb",
            "bceeb",
            "bcccb",
            "a...a"
        ],
        "key": {
            "a": [126, 125, 125],
            "b": [88, 88, 88],
            "c": [51, 90, 249],
            "d": [142, 163, 249],
            "e": [77, 111, 249]
        }
    },
    "ship-death-01": {
        "pixels": [
            "................",
            "....aaa.........",
            "...abbba....a...",
            "..abcbbba.aba...",
            ".aabbddcbbbcba..",
            "..bbcbbbecdcbf..",
            "..aaaabbaabba...",
            "...agaaaa.aa....",
            "................",
            "................"
        ],
        "key": {
            "a": [255, 79, 79],
            "b": [255, 194, 79],
            "c": [246, 255, 27],
            "d": [255, 255, 255],
            "e": [126, 125, 125],
            "f": [77, 111, 249],
            "g": [42, 42, 42]
        }
    },
    "ship-death-02": {
        "pixels": [
            ".....a...aa.....",
            "..ab.b.cbcbaa...",
            "...bddbeebebeb..",
            ".abeeeefeefdeea.",
            ".abdefffdcffedb.",
            ".aeeeeeedeefdba.",
            "..bdeedebbbeeea.",
            "..cbcbbcbceeba..",
            "..a.a.a...aaa...",
            "................"
        ],
        "key": {
            "a": [150, 46, 46],
            "b": [182, 139, 57],
            "c": [255, 79, 79],
            "d": [246, 255, 27],
            "e": [135, 135, 135],
            "f": [73, 73, 73]
        }
    },
    "ship-death-03": {
        "pixels": [
            "....ab.a.b.aa...",
            "..baababbaabbaa.",
            "..aacaaaaaaacab.",
            ".baaccccaccccab.",
            ".baac.cccc..caab",
            "..aacccacccccaab",
            "..aaccaaaacaaab.",
            "..baaaaaaaaaaba.",
            "....babbaabab...",
            "................"
        ],
        "key": {
            "a": [135, 135, 135],
            "b": [150, 46, 46],
            "c": [73, 73, 73]
        }
    },
    "ship-death-04": {
        "pixels": [
            "................",
            "....abba..aaaa..",
            "..aab.baababbaa.",
            "..bb...bb.bbbba.",
            ".ab.....b...bb..",
            ".abb....b...bba.",
            "...bb.bbb...bba.",
            "..aaabbaabbbba..",
            "....a..a...ba...",
            "................"
        ],
        "key": {
            "a": [135, 135, 135],
            "b": [73, 73, 73]
        }
    },
    "ship-death-05": {
        "pixels": [
            "................",
            "................",
            "...a..a.........",
            "...aaa...a.aaa..",
            "...a.........a..",
            "...a..a..a...a..",
            "...aa..a....aa..",
            ".....a....aaaa..",
            "................",
            "................"
        ],
        "key": {
            "a": [73, 73, 73]
        }
    },
    "life": {
        "pixels": [
            ".aa.....",
            "bbbccdae",
            "fcgbbdde",
            ".hh....."
        ],
        "key": {
            "a": [255, 255, 255],
            "b": [126, 125, 125],
            "c": [88, 88, 88],
            "d": [3, 157, 157],
            "e": [77, 111, 249],
            "f": [141, 0, 0],
            "g": [192, 192, 192],
            "h": [42, 42, 42]
        }
    },
    "machinery-20x08-01": {
        "pixels": [
            "..abbbbbbbbbbbbbbb..",
            ".aaaaaaaaaaaaaaaaab.",
            "aacacacacccccccccccb",
            "daaaaaaaaaaaaaaaaaab",
            "dddadddaaaaaddddaaaa",
            ".dddeeddaaadeeedddd.",
            ".eefefeddddeeeeeee..",
            ".eeeeeeeeeeeaeaeae.."
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [255, 255, 255],
            "c": [67, 63, 16],
            "d": [119, 118, 118],
            "e": [45, 57, 22],
            "f": [117, 0, 0]
        }
    },
    "machinery-20x08-02": {
        "pixels": [
            "..abbbbbbbbbbbbbbb..",
            ".accccacccccccacacb.",
            "aaaaaaaaaaaaaaaaaaab",
            "daaaaaaaaaaaaaaaaaab",
            "ddaaaaaaddaddadaaaaa",
            ".dddadaaaaaaaaaaaaa.",
            ".eeeeeaefefefeaeee..",
            ".eeeeeeeeeeeeeeeee.."
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [255, 255, 255],
            "c": [67, 63, 16],
            "d": [119, 118, 118],
            "e": [45, 57, 22],
            "f": [117, 0, 0]
        }
    },
    "machinery-20x08-03": {
        "pixels": [
            "..abbbbbbbbbbbbbbb..",
            ".aaaaaaaaaaaaaaaaab.",
            "aaaaaaaaaaaaaaaaaaab",
            "cdddddddddabbbaddddb",
            "caaaeecaaacaaabaaaaa",
            ".caeeeecaaacccaaaaa.",
            ".eafefeeccaaaaaaaa..",
            ".eaeeeeeeeeeeeeeee.."
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [255, 255, 255],
            "c": [119, 118, 118],
            "d": [67, 63, 16],
            "e": [45, 57, 22],
            "f": [117, 0, 0]
        }
    },
    "machinery-20x16-01": {
        "pixels": [
            "..abbbbbbbbbbbbbbb..",
            ".aaaaaaaaaaaaaaaaab.",
            "acccccdaaaaaaaaaaaaa",
            "..bbbbcdaaaaaaaaaaaa",
            ".daaaabccccccccccccd",
            ".daaaabedddddddadad.",
            ".daaaabfefeeeeedeae.",
            ".eddddeefeeaaaaaeae.",
            ".eeabeefefedddddeae.",
            ".eeeabeefeeaaaaaeaa.",
            ".eeeabefefedddddeee.",
            ".eeeabeefeccccceeee.",
            ".eeabeefefdaaabeege.",
            ".eabeeeefeddaaaeeee.",
            ".eabeeefefdaaaaeege.",
            ".eeabeeefeddaaaeeee."
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [255, 255, 255],
            "c": [67, 63, 16],
            "d": [119, 118, 118],
            "e": [45, 57, 22],
            "f": [66, 66, 66],
            "g": [117, 0, 0]
        }
    },
    "machinery-20x24-01": {
        "pixels": [
            "..abbbbbbbbbbbbbbb..",
            ".aaaaaaaaaaaaaaaaab.",
            "acccccccccccccccccca",
            "daaaaaaaaaaaaaaaaaaa",
            "ddaaaaaaaaaaaaaaaaad",
            ".dddddddddddddddddd.",
            ".eeeeeeeaaaaaaaabb..",
            ".eeaffaeddddcacacb..",
            ".eeaffaeeaeadaaaab..",
            ".ebbbbeeeaeaedaaa...",
            ".aaaabbceaeaeedaabb.",
            ".addaececaeaee.daabb",
            ".eaaeeeceaeaee..daab",
            ".eeeeececaeeae...daa",
            ".eaaeeeaaeaeae....ac",
            ".adgaeadgaaeea....aa",
            ".addaeaddaeaeea...dc",
            ".eaaeeeaaeeeae.a..aa",
            ".eeeeeeeeeeeeagaggda",
            ".eddeeeddeeceaddaddd",
            ".eddeeeddececebgagg.",
            ".gddeegddeeceeddddd.",
            ".gddeegddececebgggg.",
            ".gddeegddeeceeddddd."
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [255, 255, 255],
            "c": [67, 63, 16],
            "d": [119, 118, 118],
            "e": [45, 57, 22],
            "f": [117, 0, 0],
            "g": [66, 66, 66]
        }
    },
    "machinery-gateway-top-40x40": {
        "pixels": [
            "abbbbbbbbbbbbcccccbbbbbbbbbbbbbbdbdbdb..",
            "abbebebdfffbbbbbbbbbbebebebdfffbbbbbbb..",
            "aaafbbddddfdddddddddddddddddddfdddddfff.",
            "aaadadddddddddddddddddddddddddddddddddff",
            "addddddddddddddddddddddddddddddddddddddf",
            "adcdcdcdcccccccccccccccdcdcdcccccccccccd",
            ".addddddddddddddddddddddddddddddddddddd.",
            ".aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..",
            "..aaaaddddaaaaaaaaaaaaaaaaaaaaaaa.......",
            "....aaaddaaaaaaaaaaaaaaaaaaaaaaa........",
            ".....aadddddada......c.cc..c.c..........",
            "......aadbbbdad.....c.c.ccc.c.c...df....",
            "......aaadddaddfdfafafafa..c.c....ddf...",
            ".......aabbbacdd.dadadadafafafaddbddd...",
            ".......aadddad.ccdaeadadadadadaaabddd...",
            "........abbbaaf..dadadadadadadaddbddd...",
            "........adddaadccdaeadadadadadaaabddd...",
            "........abbbaadf.dadadadadadadaddbddd...",
            "........adddaaddddadadada.........ddd...",
            "........abbbdad...................ad....",
            "........adddada.........................",
            "........aaaaaaaaaadddddddddddfff........",
            "........aaaaeeaeeaaaaaaaddddddddf.......",
            "..f....faaaaaaeaaaaaaaaaaaaadadad.......",
            "..df.ddfaaaaaaaaaaaaaaaaaaaaaaaa........",
            "..acfdddadddada......c.cc..c.c..........",
            "..addddd.bbbdad.....c.c.ccc.c.c...df....",
            "..acddd..ddda.dddfafafafa..c.c....ddf...",
            "..aaadd..bbb..df.dadadadafafafaddbddd...",
            "..acadd..ddd...ccdaeadadadadadaaabddd...",
            "..aaadd..bbb.....dadadadadadadaddbddd...",
            "..acadd..ddd...ccdaeadadadadadaaabddd...",
            "..aaadd..bbb..dd.dadadadadadadaddbddd...",
            "..acadf..ddda.dfddadadada.........ddd...",
            "..aaaddf.bbbdad...................ad....",
            "..acadddadddada.........................",
            "..aa.dddaaaaaaaaaadddddddddddfff........",
            "..a....daaaaaaeaaaaaaaaaddddddddf.......",
            "........aaaaeeaeeaaaaaaaaaaadadad.......",
            "..........aaaaaaaaaaaaaaaaaaaaaa........"
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [45, 57, 22],
            "c": [67, 63, 16],
            "d": [184, 184, 184],
            "e": [117, 0, 0],
            "f": [255, 255, 255]
        }
    },
    "machinery-gateway-bottom-40x40": {
        "pixels": [
            "..........aaaaaaaabbbbbbbbbbbccc........",
            "........aaaaddaddaaaaaaabbbbbbbbc.......",
            "..c....caaaaaadaaaaaaaaaaaaababab.......",
            "..bc.bbcaaaaaaaaaaaaaaaaaaaaaaaa........",
            "..aecbbbabbbaba......e.ee..e.e..........",
            "..abbbbb.fffbab.....e.e.eee.e.e...bc....",
            "..aebbb..bbba.bcbcacacaca..e.e....bbc...",
            "..aaabb..fff..bb.babababacacacabbfbbb...",
            "..aeabb..bbb...eebadabababababaaafbbb...",
            "..aaabb..fff.....babababababababbfbbb...",
            "..aeabb..bbb...eebadabababababaaafbbb...",
            "..aaabb..fff..bc.babababababababbfbbb...",
            "..aeabc..bbba.bbbbabababa.........bbb...",
            "..aaabbc.fffbab...................ab....",
            "..aeabbbabbbaba.........................",
            "..aa.bbbaaaaaaaaaabbbbbbbbbbbccc........",
            "..a....baaaaaadaaaaaaaaabbbbbbbbc.......",
            "........aaaaddaddaaaaaaaaaaababab.......",
            "........aaaaaaaaaaaaaaaaaaaaaaaa........",
            "........abbbaba......e.ee..e.e..........",
            "........afffbab.....e.e.eee.e.e...bc....",
            "........abbbaabcbcacacaca..e.e....bbc...",
            "........afffaabb.babababacacacabbfbbb...",
            "........abbbaa.eebadabababababaaafbbb...",
            "........afffaac..babababababababbfbbb...",
            ".......aabbbabbeebadabababababaaafbbb...",
            ".......aafffaebc.babababababababbfbbb...",
            "......aaabbbabbbbbabababa.........bbb...",
            "......aabfffbab...................ab....",
            ".....aabbbbbaba.........................",
            "....aaabbaaaaaaaaaaaabbbbbbbbbcc........",
            "..aaaabbbbaaaaaaaaaaaaaaaaabbbbbc.......",
            ".aaccccccccccccccccccccccccccccccccccc..",
            ".bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc.",
            "bbebebebeeeeeeeeeeeeeeebebebeeeeeeeeeeec",
            "abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc",
            "aaabaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "aaaaffaabbaaaaaaaaaaaaaaaaaabbaaaaaaaaa.",
            "affdfdfaaaaffffffffffdfdfdfaaaafffffff..",
            "affffffffffffeeeeeffffffffffffffbfbfbf.."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [184, 184, 184],
            "c": [255, 255, 255],
            "d": [117, 0, 0],
            "e": [67, 63, 16],
            "f": [45, 57, 22]
        }
    },
    "machinery-top-20x08-01": {
        "pixels": [
            ".aaaaaaaaaaabababa..",
            ".aacacabdddaaaaaaa..",
            ".bddaabbbbbdaaabddd.",
            "bbbdbbbbbbbbdbbbbbdd",
            "ebbbdbbbbddbbbbbbbbd",
            "ebfbfbfbebbdfffffffb",
            ".eeebbbbbeebbbbbbbb.",
            "..eeeeeeeeeeeeeeee.."
        ],
        "key": {
            "a": [45, 57, 22],
            "b": [184, 184, 184],
            "c": [117, 0, 0],
            "d": [255, 255, 255],
            "e": [119, 118, 118],
            "f": [67, 63, 16]
        }
    },
    "machinery-top-20x08-02": {
        "pixels": [
            ".aaaaaaaaaaaaaaaaa..",
            ".aaaaabacacdcabaaa..",
            ".bddddddddddddddddd.",
            "bbbbbbbbeebeebebbbdd",
            "bbbbbbbbbbbbbbbbbbbd",
            "eebbbbbbbbbbbbbbbbbd",
            ".eeeffbfffffffbfbfb.",
            "..eeeeeeeeeeeeeeee.."
        ],
        "key": {
            "a": [45, 57, 22],
            "b": [184, 184, 184],
            "c": [117, 0, 0],
            "d": [255, 255, 255],
            "e": [119, 118, 118],
            "f": [67, 63, 16]
        }
    },
    "machinery-top-20x08-03": {
        "pixels": [
            ".abaaaaaaaaaaaaaaa..",
            ".abcacaabbdddddddd..",
            ".edaaaabbbbdddbbbdd.",
            "ebbdaaebbbebbbdbbbbd",
            "efffffffffbeeebffffd",
            "ebbbbbbbbbbbbbbbbbbb",
            ".eebbbbbbbbbbbbbbbb.",
            "..eeeeeeeeeeeeeeee.."
        ],
        "key": {
            "a": [45, 57, 22],
            "b": [184, 184, 184],
            "c": [117, 0, 0],
            "d": [255, 255, 255],
            "e": [119, 118, 118],
            "f": [67, 63, 16]
        }
    },
    "machinery-top-20x16-01": {
        "pixels": [
            ".aabcaaadaeebbcaaaa.",
            ".abcaaadadebbbbaafa.",
            ".abcaaaadaeebbbaaaa.",
            ".aabcaadadebbbbaafa.",
            ".aaabcaadagggggaaaa.",
            ".aaabcadadaeeeeeaaa.",
            ".aaabcaadaabbbbbabb.",
            ".aabcaadadaeeeeeaba.",
            ".accccaadaabbbbbaba.",
            ".ebbbbcdadaaaaaeaba.",
            ".ebbbbcabccccccbcbc.",
            ".ebbbbcggggggggggggc",
            "..eeeegbbbbbbbbbbbbc",
            "egggggbbbbbbbbbbbbbb",
            ".eeebbbbbbbbbbbbbbb.",
            "..eeeeeeeeeeeeeeee.."
        ],
        "key": {
            "a": [45, 57, 22],
            "b": [184, 184, 184],
            "c": [255, 255, 255],
            "d": [66, 66, 66],
            "e": [119, 118, 118],
            "f": [117, 0, 0],
            "g": [67, 63, 16]
        }
    },
    "machinery-top-20x24-01": {
        "pixels": [
            ".abbccabbccdccbbbbb.",
            ".abbccabbcdcdceaaaa.",
            ".abbccabbccdccbbbbb.",
            ".cbbcccbbcdcdceafaa.",
            ".cbbcccbbccdcfbbfbbb",
            ".ccccccccccccfafaabf",
            ".cffcccffcccfc.f..ff",
            ".fbbfcfbbfcfccf...bd",
            ".fabfcfabffccf....ff",
            ".cffcccffcfcfc....fd",
            ".cccccdcdfccfc...fff",
            ".ceecccdcfcfcc..ffff",
            ".fbbecdcdfcfcc.ffffb",
            ".ffffeedcfcfccfffbb.",
            ".cffffcccfcfcfffb...",
            ".ccfggeccfcffffffb..",
            ".ccfggfcffffdfdfdb..",
            ".cccccccbbbbfffffb..",
            ".feeeeeeeeeeeeeeeee.",
            "ffffffffffffffffffee",
            "bffffffffffffffffffe",
            "bbdddddddddddddddddf",
            ".bbffffffffffffffff.",
            "..bbbbbbbbbbbbbbbb.."
        ],
        "key": {
            "a": [66, 66, 66],
            "b": [119, 118, 118],
            "c": [45, 57, 22],
            "d": [67, 63, 16],
            "e": [255, 255, 255],
            "f": [184, 184, 184],
            "g": [117, 0, 0]
        }
    },
    "machinery-curve-bl-20x16": {
        "pixels": [
            "....................",
            ".aa.................",
            "bccaa...............",
            "bdcdcaa.............",
            "bdddcdcaa...........",
            "bcccccccca..........",
            "bbccccccccaa........",
            "bbbbbbbcccccaa......",
            ".eeeeeebcdccccaaaa..",
            "bbbbecabccccccccccaa",
            "eddeeccbcddcbbbbccca",
            "bbbbeecebccbaaaabcca",
            "eddeedcedcbcccccabcd",
            "bbbbdcedceebccccbbca",
            "edddceeedceebbbbbccd",
            ".bbbdceeedcefefebbb."
        ],
        "key": {
            "a": [255, 255, 255],
            "b": [119, 118, 118],
            "c": [184, 184, 184],
            "d": [67, 63, 16],
            "e": [45, 57, 22],
            "f": [117, 0, 0]
        }
    },
    "machinery-curve-br-20x16": {
        "pixels": [
            "....................",
            ".................aa.",
            "...............aabba",
            ".............aabcbca",
            "...........aabcbccca",
            "..........abbbbbbbba",
            "........aabbbbbbbbba",
            "......aabbbbbddddddb",
            "..aaaabbbbcbdeeeeee.",
            "aabbbbbbbbbbdbaedddd",
            "dbbbddddbccbdbbeecce",
            "dbbdaaaadbbdebeedddd",
            "cbdbbbbbadbcebceecce",
            "dbddbbbbdeebcebcdddd",
            "cbbdddddeebceeebccce",
            ".dddefefebceeebcddd."
        ],
        "key": {
            "a": [255, 255, 255],
            "b": [184, 184, 184],
            "c": [67, 63, 16],
            "d": [119, 118, 118],
            "e": [45, 57, 22],
            "f": [117, 0, 0]
        }
    },
    "machinery-curve-tl-20x16": {
        "pixels": [
            ".aaabcdddbcdededfff.",
            "dbbbcdddbcddcccccccb",
            "aaaabcdbcddcffffaacf",
            "dbbddbcdbcacccccfacb",
            "aaaaddcdaccaccccaccf",
            "dbbddcfacbbcaaaacccf",
            "aaaadccacccccccccccc",
            ".ddddddacbccccaaaa..",
            "affffaacccccaa......",
            "aaccccccccaa........",
            "acccccccca..........",
            "abbbcbcaa...........",
            "abcbcaa.............",
            "accaa...............",
            ".aa.................",
            "...................."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [67, 63, 16],
            "c": [184, 184, 184],
            "d": [45, 57, 22],
            "e": [117, 0, 0],
            "f": [255, 255, 255]
        }
    },
    "machinery-curve-tr-20x16": {
        "pixels": [
            ".aaabcbcbdebbbdefff.",
            "edddddddbbdebbbdeeeb",
            "ddddaaaadbbdebdeffff",
            "edddddddafdebdebbeeb",
            "dddfddddfddfbdbbffff",
            "ddddffffdeedfdabbeeb",
            "ddddddddddddfddbffff",
            "..ffffddddedfbbbbbb.",
            "......ffdddddffaaaaf",
            "........ffddddddddaa",
            "..........fdddddddda",
            "...........ffdedeeea",
            ".............ffdeded",
            "...............ffddd",
            ".................fd.",
            "...................."
        ],
        "key": {
            "a": [255, 255, 255],
            "b": [45, 57, 22],
            "c": [117, 0, 0],
            "d": [184, 184, 184],
            "e": [67, 63, 16],
            "f": [119, 118, 118]
        }
    },
    "machinery-hands-60x37": {
        "pixels": [
            "....aaa.....................................................",
            "...bbbbaa.....................aaaaaa........................",
            "..cbbbbbbba..................bbbbbbaa.......................",
            "..cbbcbbbbbb................cbbbbbcbaaaaa...................",
            "..cbbcbbbbbbb..............bbbbbbbcbbabbbaa.................",
            "..cbbcbcccbbbba..........cbbbbbddbbbbabbbbbaa...............",
            "...cbbbceecbbbba........cbbbbbddddbbbafbbbbbbaaa............",
            "....bbbaeeecbbbbac...cccbbbbbddddbbbbfffbbbbbbbbaaa.........",
            "....bbbbaeecbbbbbabbbbbbbbbdddddbbbbabffffbbbbbabbbaaa......",
            "....bbbbbaccbbbbbbaaaabbbdddddbbbbbcbbbffffbbbbbbbbbbbaa....",
            "....b.cbbbbbbbbbbbbbbbbbdddbbbbbbbbbbbbbffbbbbbbbbbbbbbba...",
            "....b..bbbbbbcccbbbbcbbdddbbbbbbbb.ccbbbfbbbbbbbeeebbbbbba..",
            "....b...cbbbbcefcbbbcbbbdbbbbbbc.....bbbbbbbbbbbeeebbbbbba..",
            "....b....bbbbafffcbbbbbbbbbbbc........bbbbbbbbbbaaabbbebbba.",
            "....b.....bbbbafecbbcbbcbbbbc.........bbbbbbbbbbbbaaabbbbba.",
            "....b......cbbbaccbbcbbcbbb...........bbcbbbbbbbbbbbaabbbba.",
            "....b.......cbbbbbbbcbbbbc.............cbbbebbbbbbbbbabbbbba",
            "....bc.......cbbbbbbbbbbb..............cbbbbcbbbbbbbbaabbbba",
            "....bc........b.cbbbbbbcc..............cbbbbcbbbbbbbbbabbbba",
            "....bc........b...ccccccb...............cbbbccbbbbbbbbabbba.",
            "....cb........b........bc...............cbbbbcbbbbbbbbbebba.",
            "....cb.......cb.......cb................ccbbbccbbbbbbbbbbba.",
            "....cb.......cb.......bc.................cbbbecccbbbbbbbbac.",
            ".....b.......bc......cb..................ccbbbbbcccbbbbbbac.",
            ".....b.......bc......bc..........aaaaa...cccbbbbeeebbbbbbcc.",
            ".....b.......b......cb..........aabbbba..cccccbbeeebbbbbdcc.",
            ".....b.......b......bc........bbbbbbbba...cddcccbbbcccdcdc..",
            ".....b.......b......b........bbbbbfbfba...cddcdcccccdcdcdc..",
            "....bba.....bba....bba.......bbbbbbbbba...cddcdcdcdcdcdcdc..",
            "..bbbaaaaaaaaaaaaaaaaaaaaa..ccccccccccc...cccccccccccccccc..",
            ".bbbbbbbbbbbbbbbbbbbbbbbbba.fffffffffff..bbbabbaaaaaaaaaaaa.",
            "cbbdddaaaaaaaaaaaaaaaabbbbbafefccccfcffbabbbbbbbbbbbbbbbbbaa",
            "cbdddcbbbbbbbbbbbbbbbbabbbbafffffffffffbadddddddddbcccbdddda",
            "cbdddcbbbccccccbbbbbbbcbbbbbfcfccccfcffbabaaffcbbbcbbbabbbba",
            "ccbdddcccccffffffffcccbbbbbafffffffffffbbccffffbbbbcccbbbccb",
            ".cccddccccccfcfcccccccccccadfcfccccfcffbbfbefeffbbcccccccc.."
        ],
        "key": {
            "a": [255, 255, 255],
            "b": [184, 184, 184],
            "c": [119, 118, 118],
            "d": [67, 63, 16],
            "e": [117, 0, 0],
            "f": [45, 57, 22]
        }
    },
    "machinery-hands-top-60x37": {
        "pixels": [
            "..abaabbbbbbbbbbbbbbbbbbbbcddddddddddddaadaddddddddddddddd..",
            ".aaaccaaaaaadadaaaaaaaaaabbcdedeeeededdaadafdfddaabbbbbbbb..",
            "aaacccbbbaaddddddddabbaaaaabdddddddddddaaebddddaaaabbbaaabba",
            "aaccceaaabbbbbbaaaaaaabaaaaadedeeeededdaeaabddeaaaeaaabaaaab",
            "aaccceaaaaaaaaaaaaaaaaaaaaaadddddddddddaecccccccccaeeeaccccb",
            "aaaccceeeeeeeeeeeeeeeeaaaaaadfdeeeededdaeaaaaaaaaaaaaaaaaaaa",
            ".eeaaaaaaaaaaaaaaaaaaaaaaaa.ddddddddddd..eeaaaaaaaaaaaaaaaa.",
            "..eeeeeeeeeeeeeeeeeeeeeeee..eaaaaaaabbb...eeeeeeeeeeeeeeee..",
            "....aaa.....aaa....aaa.......eaaaaaaaab...eccecececececece..",
            ".....a.......a......a........eeaaadadab...eccecebbbececece..",
            ".....a.......a......ae........eeeaaaaaa...eccaaaaaabbbcece..",
            ".....a.......a......ea..........eeaaaaa..eeaaaaafffaaabbcee.",
            ".....a.......ae......ae..........eeeee...eaaaaaafffaaaaabee.",
            ".....a.......ae......ea..................aaaaaaabbbaaaaaabe.",
            "....ea.......ea.......ae.................aaaafaaaabbbaaaabe.",
            "....ea.......ea.......ea................aaaaaaaaaaaabbaaaab.",
            "....ea........a........ae...............aaaaaaaaaaaaabafaab.",
            "....ae........a...bbbbbea...............aaaaeaaaaaaaabbaaab.",
            "....ae........a.aaaaaaabb..............eaaaaeaaaaaaaaabaaaab",
            "....ae.......aaaaaaaaaaaa..............eaaaaeeaaaaaaaabaaaab",
            "....a.......aaaaaaaaeaaaab.............eeaafaeaaaaaaaaaaaaab",
            "....a......aaaaeeeaaeaaeaaa...........aaeaaaaeeaaaaaaaaaaaa.",
            "....a.....aaaaedfeaaeaaeaaaab.........aaeaaaaaeeeaaaaafaaaa.",
            "....a....aaaaedddeaaaaaaaaaaab........aaeeaaaaaaeeeaaaaaaaa.",
            "....a...aaaaabfdeaaaeaaacaaaaaab.....aaaaeaaaaaafffaaaaaaa..",
            "....a..aaaaaabbeaaaaeaacccaaaaaaaa.bbaaadeeaaaaafffaaaaaaa..",
            "....a.aaaaaaaaaaaaaaaaaacccaaaaaaabaaaaaddeeaaaaaaaaaaaaa...",
            "....aaaaaeeeaaaaaaeeaaaaacccccaaaaabaaaddddeeeaaaaaaaaaa....",
            "....aaaaeffeaaaaaeeeeeaaaaacccccaaaabaddddaaaeeeeaaaaa......",
            "....aaaefffeaaaaee...eeeaaaaaccccaaabdddaaaaaaaaeee.........",
            "...aaaabffeaaaae........eaaaaaccccaaabdaaaaaaeee............",
            "..eaaeabbeaaaae..........eaaaaaccaaaabaaaaaee...............",
            "..eaaeaaaaaaa..............aaaaaaaeaabaaaee.................",
            "..eaaeaaaaaa................eaaaaaeabeeee...................",
            "..eaaaaaaae..................aaaaaaab.......................",
            "...eaaaee.....................eeaaaa........................",
            "...eeee....................................................."
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [255, 255, 255],
            "c": [67, 63, 16],
            "d": [45, 57, 22],
            "e": [119, 118, 118],
            "f": [117, 0, 0]
        }
    },
    "alien-red-flat": {
        "pixels": [
            ".......abb...",
            "......aaacb..",
            "....deeaacab.",
            "....aaaaaca..",
            ".ffbbbbbbbbb.",
            "fegfaaaaaaaaa",
            "feffaaaaaaaaa",
            ".ffccccccccc.",
            "....aaaaaca..",
            "....deeaacaa.",
            "......aaaca..",
            ".......caa..."
        ],
        "key": {
            "a": [196, 43, 38],
            "b": [225, 100, 97],
            "c": [121, 39, 37],
            "d": [255, 255, 255],
            "e": [69, 126, 53],
            "f": [110, 178, 91],
            "g": [170, 254, 146]
        }
    },
    "alien-yellow-line-315": {
        "pixels": [
            "......ab........",
            "......abbc......",
            ".....aaabbb.....",
            ".....daaefb.....",
            "....bdddfffaa...",
            "..affgggffaabb..",
            "aaaafhigffajfbb.",
            "ddaafklgdfdfffb.",
            ".ddfffffbddddfbb",
            ".cdffffffbbddddd",
            "..dddaabbbb.dd..",
            "....aafffb......",
            "....adffffb.....",
            ".....dddffb.....",
            "......dddd......",
            "........dd......"
        ],
        "key": {
            "a": [149, 149, 149],
            "b": [222, 216, 142],
            "c": [199, 0, 26],
            "d": [100, 97, 64],
            "e": [158, 154, 98],
            "f": [158, 154, 101],
            "g": [4, 88, 35],
            "h": [11, 157, 63],
            "i": [130, 252, 176],
            "j": [158, 154, 104],
            "k": [0, 157, 58],
            "l": [0, 157, 62]
        }
    },
    "alien-yellow-line-292": {
        "pixels": [
            "................",
            "...ab.c.........",
            "...aabbb........",
            "....aabbbba.....",
            "....daeeeeaebb..",
            "....ddfeeaeeebb.",
            "...dgffheeeeeebb",
            "...eegffdddeeeeb",
            ".aabbggfedddd...",
            "aaaeebeebeed....",
            ".dddebeaebb.....",
            "..cdeebaeebb....",
            "....deaeeeeb....",
            ".....daddeebb...",
            "........dddeb...",
            "................"
        ],
        "key": {
            "a": [149, 149, 149],
            "b": [222, 216, 142],
            "c": [196, 43, 38],
            "d": [100, 97, 64],
            "e": [158, 154, 101],
            "f": [4, 88, 35],
            "g": [6, 157, 63],
            "h": [130, 252, 176]
        }
    },
    "alien-yellow-line-270": {
        "pixels": [
            "................",
            "...........a....",
            "....ba..c.aaa...",
            ".caadaaacdddaaa.",
            ".cccdddacddddaa.",
            "..ccceddcedddd..",
            "...deffddeedd...",
            "...dgfhfeeee....",
            "...dggffdaaa....",
            "...ddggddddaa...",
            "..cccaaecdddaa..",
            ".cccddaacddddda.",
            ".ceeeddeceeddda.",
            "....be..c.eee...",
            "...........e....",
            "................"
        ],
        "key": {
            "a": [222, 216, 142],
            "b": [196, 43, 38],
            "c": [149, 149, 149],
            "d": [158, 154, 101],
            "e": [100, 97, 64],
            "f": [4, 88, 35],
            "g": [6, 157, 63],
            "h": [130, 252, 176]
        }
    },
    "alien-yellow-line-247": {
        "pixels": [
            "................",
            "........aaaaa...",
            ".....bcddaaaa...",
            "....bbcdddda....",
            "..edabbcdddd....",
            ".ddddabcddd.....",
            "cccddabbdbbd....",
            ".ccbbfffbddaa...",
            "...bbghfbdddaaaa",
            "...bgggfbbbddaaa",
            "....ddgdacbbdda.",
            "....bcdddacbbb..",
            "....ccbddac.....",
            "...ccbbb........",
            "...cd.e.........",
            "................"
        ],
        "key": {
            "a": [222, 216, 142],
            "b": [100, 97, 64],
            "c": [149, 149, 149],
            "d": [158, 154, 101],
            "e": [196, 43, 38],
            "f": [4, 88, 35],
            "g": [6, 157, 63],
            "h": [130, 252, 176]
        }
    },
    "alien-yellow-line-225": {
        "pixels": [
            "........aa......",
            "......aaaa......",
            ".....bccaaa.....",
            "....dbbccca.....",
            "....ddbbbc......",
            "..aaaddbbcc.aa..",
            ".eccaacccccccaaa",
            ".ccccacbccbcccaa",
            "bbddcfffbcbbcca.",
            "ddddbghfccdbbca.",
            "..dbbiifcaddbb..",
            "....bbbcccadd...",
            ".....bddjcc.....",
            ".....dddccc.....",
            "......dbce......",
            "......db........"
        ],
        "key": {
            "a": [222, 216, 142],
            "b": [100, 97, 64],
            "c": [158, 154, 101],
            "d": [149, 149, 149],
            "e": [199, 0, 26],
            "f": [4, 88, 35],
            "g": [11, 157, 63],
            "h": [130, 252, 176],
            "i": [0, 157, 58],
            "j": [158, 154, 98]
        }
    },
    "alien-yellow-line-202": {
        "pixels": [
            "......aa........",
            ".....bba........",
            "....bbba........",
            "....bbbac....aa.",
            "....bbbacc.bbba.",
            "...ddbbccbcbbba.",
            "...aadbcccbbbba.",
            "...bbabcbbbbbba.",
            "..bbbaeffbddbb..",
            ".gbbbfffhccadd..",
            "..cddcfhhaabaa..",
            ".cddcchbcbbbb...",
            ".dd...cbccbb....",
            "........ddcg....",
            "........ddc.....",
            ".........d......",
        ],
        "key": {
            "a": [222, 216, 142],
            "b": [158, 154, 101],
            "c": [100, 97, 64],
            "d": [149, 149, 149],
            "e": [130, 252, 176],
            "f": [4, 88, 35],
            "g": [196, 43, 38],
            "h": [6, 157, 63]
        }
    },
    "alien-yellow-line-180": {
        "pixels": [
            "................",
            "...aa......aa...",
            "...bba....bba...",
            "..bbbba..bbbba..",
            ".ccbbbabcbbbbba.",
            "..cbbbabcbbbbb..",
            "...cbbccbbbbb...",
            "..ddddacccdddd..",
            "...bbaaeebaaa...",
            "...bbbefegbba...",
            "..cbbbeeggbbba..",
            "..hcbdcggbdbbh..",
            "...cddbcccddb...",
            "...cdd....ddb...",
            "...dd......dd...",
            "................"
        ],
        "key": {
            "a": [222, 216, 142],
            "b": [158, 154, 101],
            "c": [100, 97, 64],
            "d": [149, 149, 149],
            "e": [4, 88, 35],
            "f": [130, 252, 176],
            "g": [6, 157, 63],
            "h": [196, 43, 38]
        }
    },
    "alien-tracks-1-right": {
        "pixels": [
            ".....aaabbcb......",
            "....aaaaabbcb.....",
            "...ddaaaaaaabb....",
            "..dddddaaadddd....",
            ".eddddddddddfddd..",
            ".eedddddddddfdddd.",
            "..eeddddddddfddddd",
            "...eddddddddffbbdd",
            "....edddddddffdbbb",
            "....eedddddffddaaa",
            ".....eeedddffdddad",
            ".......eedfdddddd.",
            ".......eghddeee...",
            "......dggghee.....",
            "......ddggee......",
            ".....dddgee.......",
            ".....ggggff.......",
            "...ddddffffff.....",
            "..dddddddddfff....",
            ".ddiijiijiijiif...",
            ".diiiijjjjjiiijf..",
            "djiigiijjjiigiiid.",
            "diigiiijjjigiiiid.",
            "diiiikijjjiiikijd.",
            ".diiiijjjjjiiiid..",
            "...jiijiijiijij..."
        ],
        "key": {
            "a": [18, 24, 101],
            "b": [70, 80, 208],
            "c": [161, 165, 211],
            "d": [167, 105, 65],
            "e": [74, 47, 29],
            "f": [167, 129, 104],
            "g": [149, 149, 149],
            "h": [219, 219, 219],
            "i": [66, 66, 66],
            "j": [33, 21, 13],
            "k": [41, 41, 41]
        }
    },
    "alien-tracks-1-left": {
        "pixels": [
            "......abbbbcb.....",
            ".....aaaabbbcb....",
            "....aaaaaaabbdd...",
            "....edddaaaeeeed..",
            "..eeefdddeeeeeeed.",
            ".eeeefeeeeeeeeeed.",
            "eeeeefeeeeeeeeee..",
            "eebbffeeeeeeeee...",
            "bbbeffeeeeeeee....",
            "aaaeeffeeeeeed....",
            "faeeeffeeeeee.....",
            ".ffeeeefffe.......",
            "...fffefghe.......",
            ".....ffggghd......",
            "......ffgged......",
            ".......ffgedd.....",
            ".......ddgggh.....",
            ".....eddddddddd...",
            "....eeeeeeeeeedd..",
            "...eiijiijiijiidd.",
            "..ejiiijjjjjiiiid.",
            ".eiiigiijjjiigiijd",
            ".eiiiigijjjiiigiie",
            ".ejikiiijjjikiiiie",
            "..eiiiijjjjjiiiie.",
            "...jijiijiijiij..."
        ],
        "key": {
            "a": [18, 24, 101],
            "b": [70, 80, 208],
            "c": [161, 165, 211],
            "d": [167, 129, 104],
            "e": [167, 105, 65],
            "f": [74, 47, 29],
            "g": [149, 149, 149],
            "h": [219, 219, 219],
            "i": [66, 66, 66],
            "j": [33, 21, 13],
            "k": [41, 41, 41]
        }
    },
    "alien-tracks-2-right": {
        "pixels": [
            ".....aaabbcb......",
            "....aaaaabbcb.....",
            "...ddaaaaaaabb....",
            "..dddddaaadddd....",
            ".eddddddddddfddd..",
            ".eedddddddddfdddd.",
            "..eeddddddddfddddd",
            "...eddddddddffbbdd",
            "....edddddddffdbbb",
            "....eedddddffddaaa",
            ".....eeedddffdddad",
            ".......eedfdddddd.",
            ".......eghddeee...",
            "......dggghee.....",
            "......ddggee......",
            ".....dddgee.......",
            ".....ggggff.......",
            "...ddddffffff.....",
            "..dddddddddfff....",
            ".ddijjijjijjijf...",
            ".djjjjiiiiijjjjf..",
            "djjjgjjiiijjgjjid.",
            "djjgjjjiiijgjjjjd.",
            "dijjjkjiiijjjkjjd.",
            ".dijjjiiiiijjjid..",
            "...jjijjijjijji..."
        ],
        "key": {
            "a": [18, 24, 101],
            "b": [70, 80, 208],
            "c": [161, 165, 211],
            "d": [167, 105, 65],
            "e": [74, 47, 29],
            "f": [167, 129, 104],
            "g": [149, 149, 149],
            "h": [219, 219, 219],
            "i": [33, 21, 13],
            "j": [66, 66, 66],
            "k": [41, 41, 41]
        }
    },
    "alien-tracks-2-left": {
        "pixels": [
            "......abbbbcb.....",
            ".....aaaabbbcb....",
            "....aaaaaaabbdd...",
            "....edddaaaeeeed..",
            "..eeefdddeeeeeeed.",
            ".eeeefeeeeeeeeeed.",
            "eeeeefeeeeeeeeee..",
            "eebbffeeeeeeeee...",
            "bbbeffeeeeeeee....",
            "aaaeeffeeeeeed....",
            "faeeeffeeeeee.....",
            ".ffeeeefffe.......",
            "...fffefghe.......",
            ".....ffggghd......",
            "......ffgged......",
            ".......ffgedd.....",
            ".......ddgggh.....",
            ".....eddddddddd...",
            "....eeeeeeeeeedd..",
            "...eijiijiijiijdd.",
            "..eiiiijjjjjiiiid.",
            ".ejiigiijjjiigiiid",
            ".eiiiigijjjiiigiie",
            ".eiikiiijjjikiiije",
            "..ejiiijjjjjiiije.",
            "...jiijiijiijii..."
        ],
        "key": {
            "a": [18, 24, 101],
            "b": [70, 80, 208],
            "c": [161, 165, 211],
            "d": [167, 129, 104],
            "e": [167, 105, 65],
            "f": [74, 47, 29],
            "g": [149, 149, 149],
            "h": [219, 219, 219],
            "i": [66, 66, 66],
            "j": [33, 21, 13],
            "k": [41, 41, 41]
        }
    },
    "alien-tracks-3-right": {
        "pixels": [
            ".....aaabbcb......",
            "....aaaaabbcb.....",
            "...ddaaaaaaabb....",
            "..dddddaaadddd....",
            ".eddddddddddfddd..",
            ".eedddddddddfdddd.",
            "..eeddddddddfddddd",
            "...eddddddddffbbdd",
            "....edddddddffdbbb",
            "....eedddddffddaaa",
            ".....eeedddffdddad",
            ".......eedfdddddd.",
            ".......eghddeee...",
            "......dggghee.....",
            "......ddggee......",
            ".....dddgee.......",
            ".....ggggff.......",
            "...ddddffffff.....",
            "..dddddddddfff....",
            ".ddiijjijjijjif...",
            ".djjjjiiiiijjjjf..",
            "djjjgjjiiijjgjjjd.",
            "dijgjjjiiijgjjjid.",
            "dijjjkjiiijjjkjjd.",
            ".djjjjiiiiijjjjd..",
            "...jijjijjijjii..."
        ],
        "key": {
            "a": [18, 24, 101],
            "b": [70, 80, 208],
            "c": [161, 165, 211],
            "d": [167, 105, 65],
            "e": [74, 47, 29],
            "f": [167, 129, 104],
            "g": [149, 149, 149],
            "h": [219, 219, 219],
            "i": [33, 21, 13],
            "j": [66, 66, 66],
            "k": [41, 41, 41]
        }
    },
    "alien-tracks-3-left": {
        "pixels": [
            "......abbbbcb.....",
            ".....aaaabbbcb....",
            "....aaaaaaabbdd...",
            "....edddaaaeeeed..",
            "..eeefdddeeeeeeed.",
            ".eeeefeeeeeeeeeed.",
            "eeeeefeeeeeeeeee..",
            "eebbffeeeeeeeee...",
            "bbbeffeeeeeeee....",
            "aaaeeffeeeeeed....",
            "faeeeffeeeeee.....",
            ".ffeeeefffe.......",
            "...fffefghe.......",
            ".....ffggghd......",
            "......ffgged......",
            ".......ffgedd.....",
            ".......ddgggh.....",
            ".....eddddddddd...",
            "....eeeeeeeeeedd..",
            "...eijjijjijjiidd.",
            "..ejjjjiiiiijjjjd.",
            ".ejjjgjjiiijjgjjjd",
            ".eijjjgjiiijjjgjie",
            ".ejjkjjjiiijkjjjie",
            "..ejjjjiiiiijjjje.",
            "...iijjijjijjij..."
        ],
        "key": {
            "a": [18, 24, 101],
            "b": [70, 80, 208],
            "c": [161, 165, 211],
            "d": [167, 129, 104],
            "e": [167, 105, 65],
            "f": [74, 47, 29],
            "g": [149, 149, 149],
            "h": [219, 219, 219],
            "i": [33, 21, 13],
            "j": [66, 66, 66],
            "k": [41, 41, 41]
        }
    },
    "token-blue": {
        "pixels": [
            "..abcca..",
            ".abbbbca.",
            "abbdddbca",
            "bbdefgdbc",
            "bcdeefdbc",
            "bcdfeedbb",
            "abcdddbba",
            ".abccbba.",
            "..abbba.."
        ],
        "key": {
            "a": [99, 99, 99],
            "b": [149, 149, 149],
            "c": [181, 181, 181],
            "d": [41, 74, 104],
            "e": [65, 119, 167],
            "f": [78, 143, 200],
            "g": [236, 236, 236]
        }
    },
    "token-carrier-blue": {
        "pixels": [
            ".......a.......",
            ".a.....a.....b.",
            "..a...aaa...a..",
            "...bacabbcaa...",
            "...acaaaabca...",
            "...caacccabc...",
            "..aaacabbcaba..",
            "aaaabcadbcababa",
            "..cabceaacaaa..",
            "...cabcccaac...",
            "...ccabbaaca...",
            "...accaaacca...",
            "..a...aaa...a..",
            ".a.....a.....a.",
            ".......a......."
        ],
        "key": {
            "a": [149, 149, 149],
            "b": [181, 181, 181],
            "c": [99, 99, 99],
            "d": [65, 119, 167],
            "e": [126, 126, 126]
        }
    },
    "alien-rocket-pack": {
        "pixels": [
            "..abbbb......",
            ".aaaaaabbb...",
            ".ccaaaaaaabb.",
            ".dddaaaaabaab",
            "...dddddaaba.",
            ".......aaaba.",
            "......aaaaaa.",
            ".efefaaaadag.",
            "ggfgfaaadaag.",
            ".hhhddadhhgg.",
            ".....ddaahgg.",
            ".....aaaaggg.",
            ".....hhhhgg..",
            "....aaahggg..",
            "....ddddhhh..",
            "....daaacic..",
            "...daaaaccc..",
            "..daaaa..c...",
            "..daaaa......",
            "...daaa......",
            "...daaaa.....",
            "....daaaj....",
            "....daajj....",
            "....klllj....",
            "...klll......",
            "...kll.......",
            "...kk........"
        ],
        "key": {
            "a": [1, 179, 91],
            "b": [1, 226, 115],
            "c": [196, 43, 38],
            "d": [1, 126, 64],
            "e": [1, 90, 206],
            "f": [0, 0, 0],
            "g": [1, 74, 169],
            "h": [1, 56, 129],
            "i": [255, 142, 0],
            "j": [158, 158, 158],
            "k": [95, 95, 95],
            "l": [115, 115, 115]
        }
    },
    "bullet-rocket-pack": {
        "pixels": [
            ".aaaaaaa...............",
            "abbbbbbaaaaaaaaaaaaa...",
            "bbcccbbbbbbbbbbbbbbaaaa",
            "abbbbbbaaaaaaaaaaaaa...",
            ".aaaaaaa...............",
        ],
        "key": {
            "a": [84, 126, 195],
            "b": [90, 255, 255],
            "c": [255, 255, 255]
        }
    },
    "alien-fork": {
        "pixels": [
            "........abb..",
            "......aaaaab.",
            "....aaaaaaaa.",
            "..aaacaaaa...",
            "caaacaaa.....",
            "ddaccc......c",
            "dccceeecfcfcc",
            "cc...ecccfffc",
            ".....ccccc...",
            "eeaaabbccdca.",
            ".eaaaaabddda.",
            "eeccacaccdca.",
            ".....ccc.....",
            "...caabbb....",
            ".ccaaaaabbb..",
            "ccccccaaaabbb"
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [255, 255, 255],
            "c": [119, 118, 118],
            "d": [184, 27, 27],
            "e": [184, 184, 61],
            "f": [67, 63, 16]
        }
    },
    "alien-gun-bottom": {
        "pixels": [
            ".a......",
            "baacc...",
            ".bcccd..",
            ".ccccdb.",
            ".cccccb.",
            "..ddcaa.",
            "...bbbb.",
            "..aaaaaa"
        ],
        "key": {
            "a": [184, 184, 184],
            "b": [119, 118, 118],
            "c": [203, 147, 48],
            "d": [255, 203, 60]
        }
    },
    "alien-gun-top": {
        "pixels": [
            "..aaaaaa",
            "...bbbb.",
            "..ccdaa.",
            ".dddddb.",
            ".ddddca.",
            ".adddc..",
            "abbdd...",
            ".b......"
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [184, 184, 184],
            "c": [255, 203, 60],
            "d": [203, 147, 48]
        }
    },
    "alien-vertical-rocket": {
        "pixels": [
            "......aa...",
            ".....bcca..",
            ".....bcda..",
            ".....bccc..",
            "....bcbca..",
            "...cccbcc..",
            "..cc.bccb..",
            ".bc..bcbc..",
            "..ba..bb...",
            ".eeba...ee.",
            "ebbcccbccce",
            "efbbbbbbbfe",
            ".ee.....ee."
        ],
        "key": {
            "a": [61, 161, 219],
            "b": [0, 79, 126],
            "c": [0, 124, 197],
            "d": [126, 0, 0],
            "e": [88, 88, 88],
            "f": [49, 49, 49]
        }
    },
    "alien-circle-gun-270": {
        "pixels": [
            "......a......",
            "..ba..c..ab..",
            ".bccabbbaccb.",
            ".cccbdcdbccc.",
            "bccbdbcbdbccb",
            "cccdbcccbdccc",
            "cccabcecbaccc",
            "cccdbcccbdccc",
            "bccbdbbbdbccb",
            ".cfcbdadbccc.",
            ".bcfcbbbcccb.",
            "..bcccccccb..",
            "....bcccb...."
        ],
        "key": {
            "a": [100, 97, 64],
            "b": [119, 118, 118],
            "c": [184, 184, 184],
            "d": [67, 63, 16],
            "e": [65, 119, 167],
            "f": [4, 88, 35]
        }
    },
    "alien-circle-gun-292": {
        "pixels": [
            "....ab...b...",
            "..accca.c....",
            ".accccbaa.bb.",
            ".cccaddabacca",
            "accadaacdcccc",
            "cccdbcccadccc",
            "cccdacecadccc",
            "cfcdacccbdccc",
            "accadbaadacca",
            ".cfcadddaccc.",
            ".accccccccca.",
            "..accccccca..",
            "....accca...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [100, 97, 64],
            "c": [184, 184, 184],
            "d": [67, 63, 16],
            "e": [65, 119, 167],
            "f": [4, 88, 35]
        }
    },
    "alien-circle-gun-315": {
        "pixels": [
            "....abbc.....",
            "..abbbbbc..c.",
            ".abbbbbba.b..",
            ".bbbadddda...",
            "abbacaaabdac.",
            "bebdabbbadbbc",
            "bbbdabfbadbbb",
            "bebdabbbadbbb",
            "abbacaaacabba",
            ".bbbadddabbb.",
            ".abbbbbbbbba.",
            "..abbbbbbba..",
            "....abbba...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [184, 184, 184],
            "c": [100, 97, 64],
            "d": [67, 63, 16],
            "e": [4, 88, 35],
            "f": [65, 119, 167]
        }
    },
    "alien-circle-gun-337": {
        "pixels": [
            "....abbba....",
            "..abbbbbbbc..",
            ".abbbbbbbc...",
            ".bdbaeeeaa...",
            "abbacaaacaabc",
            "bdbeabbbaea..",
            "bbbeabfbaeacc",
            "bbbeabbbaebbb",
            "abbacaaacabba",
            ".bbbaeeeabbb.",
            ".abbbbbbbbba.",
            "..abbbbbbba..",
            "....abbba...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [184, 184, 184],
            "c": [100, 97, 64],
            "d": [4, 88, 35],
            "e": [67, 63, 16],
            "f": [65, 119, 167]
        }
    },
    "alien-circle-gun-dead-270": {
        "pixels": [
            ".............",
            "..ab.....ba..",
            ".accba.abcca.",
            ".accaaaaaccc.",
            "acaaddaddaaca",
            "ccaddd.dddacc",
            "ccaad...daacc",
            "ccaddd.dddacc",
            "acaadddddaaca",
            ".cacadadaacc.",
            ".acaaaaaacca.",
            "..acccaccca..",
            "....acaca...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [100, 97, 64],
            "c": [184, 184, 184],
            "d": [67, 63, 16]
        }
    },
    "alien-circle-gun-dead-292": {
        "pixels": [
            "....ab.......",
            "..accca......",
            ".acaaaba..bb.",
            ".ccaaddabacca",
            "acaadddddaacc",
            "ccaddd.dddacc",
            "ccadd...ddacc",
            "caaddd.dddacc",
            "acaadddddaaca",
            ".caaadddaacc.",
            ".accaaaaacca.",
            "..accacccca..",
            "....aacca...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [100, 97, 64],
            "c": [184, 184, 184],
            "d": [67, 63, 16]
        }
    },
    "alien-circle-gun-dead-315": {
        "pixels": [
            "....abbc.....",
            "..ababbbc....",
            ".abbaaaaa....",
            ".bbaaddda....",
            "abaadddddaac.",
            "baaddd.dddabc",
            "bbadd...ddabb",
            "baaddd.dddabb",
            "abaadddddaaba",
            ".bbaadddaabb.",
            ".abbaaaaabba.",
            "..aaabbbbba..",
            "....abbba...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [184, 184, 184],
            "c": [100, 97, 64],
            "d": [67, 63, 16]
        }
    },
    "alien-circle-gun-dead-337": {
        "pixels": [
            "....abbba....",
            "..abbbbabbc..",
            ".abbaaaaac...",
            ".baaadddaa...",
            "abaaddddda...",
            "baaddd.ddda..",
            "bbadd...ddacc",
            "bbaddd.dddabb",
            "abaadddddaaba",
            ".aaaadddaabb.",
            ".abbaaaaabba.",
            "..abbbbbbba..",
            "....abbba...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [184, 184, 184],
            "c": [100, 97, 64],
            "d": [67, 63, 16]
        }
    },
    "alien-circle-ouchy-270": {  // CAPS letters are vulnerable
        "pixels": [
            ".....AAA.....",
            "...AAABBAA...",
            ".cAAAAAABAAc.",
            ".dEAAEEEAAEd.",
            "cddEABAAAEddc",
            "dddfEAAAEfddd",
            "dddgccEccgddd",
            "dddfcccccfddd",
            "cddcfEABfcddc",
            ".dddcAAAcddd.",
            ".cdddEAEdddc.",
            "..cdddddddc..",
            "....cdddc...."
        ],
        "key": {
            "A": [65, 119, 167],
            "B": [152, 196, 236],
            "c": [119, 118, 118],
            "d": [184, 184, 184],
            "E": [42, 76, 107],
            "f": [67, 63, 16],
            "g": [100, 97, 64]
        }
    },
    "alien-circle-ouchy-292": {
        "pixels": [
            "....aBBBBB...",
            "..acDBBBEEB..",
            ".accDBBDBBEB.",
            ".cccaDEBDBBBa",
            "accafDBBBBBDc",
            "cccfgDBBDDDcc",
            "cccfaaDaafccc",
            "cccDBEaagfccc",
            "accBBBaafacca",
            ".ccDBDffaccc.",
            ".accccccccca.",
            "..accccccca..",
            "....accca...."
        ],
        "key": {
            "a": [119, 118, 118],
            "B": [65, 119, 167],
            "c": [184, 184, 184],
            "D": [42, 76, 107],
            "E": [152, 196, 236],
            "f": [67, 63, 16],
            "g": [100, 97, 64]
        }
    },
    "alien-circle-ouchy-315": {
        "pixels": [
            "....aaBCCC...",
            "..adddBCCCCC.",
            ".adddBCCCCEC.",
            ".dddaBCCBCCEC",
            "addafBECCBCEC",
            "dddgaaCCCCCCC",
            "dddgaaBCCCCBB",
            "dddBCBaaBBBda",
            "addCCEaafadda",
            ".ddBCBggaddd.",
            ".addddddddda.",
            "..addddddda..",
            "....addda...."
        ],
        "key": {
            "a": [119, 118, 118],
            "B": [42, 76, 107],
            "C": [65, 119, 167],
            "d": [184, 184, 184],
            "E": [152, 196, 236],
            "f": [100, 97, 64],
            "g": [67, 63, 16]
        }
    },
    "alien-circle-ouchy-337": {
        "pixels": [
            "....abbba....",
            "..abbbbbCDD..",
            ".abbbbbCDDDD.",
            ".bbbaeeCDDFD.",
            "abbagaaFCDDFD",
            "bbbeaaaDDCDFD",
            "bbbeaaCDDCDDD",
            "bbbCDCaaCDDDD",
            "abbDDFaagCCCa",
            ".bbCDCeeabbb.",
            ".abbbbbbbbba.",
            "..abbbbbbba..",
            "....abbba...."
        ],
        "key": {
            "a": [119, 118, 118],
            "b": [184, 184, 184],
            "C": [42, 76, 107],
            "D": [65, 119, 167],
            "e": [67, 63, 16],
            "F": [152, 196, 236],
            "g": [100, 97, 64]
        }
    },
    "bullet-vertical-rocket": {
        "pixels": [
            ".a.",
            ".b.",
            ".c.",
            ".a.",
            "cbc",
            "cbc",
            ".a."
        ],
        "key": {
            "a": [100, 175, 124],
            "b": [69, 121, 85],
            "c": [151, 0, 0]
        }
    },
    "alien-death-01": {
        "pixels": [
            "....aaaaaaa....",
            "...aaaabbbaac..",
            "..aabbbbbbaaac.",
            ".cabbddddbbaaac",
            ".aabbdeeedbbbaa",
            ".abbdeeeeedbbaa",
            "aabbdeeeeedbbaa",
            "aabbddeeedbbbaa",
            "aaabbdddddbbaac",
            "caabbbdbbbbaaa.",
            ".aabbbbbbbaa...",
            ".caabbbbaaac...",
            "..aabbaaa......",
            "...aaaaa.......",
            ".....ccc......."
        ],
        "key": {
            "a": [255, 79, 79],
            "b": [255, 194, 79],
            "c": [126, 125, 125],
            "d": [246, 255, 27],
            "e": [255, 255, 255]
        }
    },
    "alien-death-02": {
        "pixels": [
            "...aaaaaaab....",
            "..baacccaaab...",
            ".bacccccccaab..",
            ".baccdddcccaa..",
            "..bcddeddcccaa.",
            "...bbbeeddccaa.",
            "...babbedddcca.",
            "...bbbeedddcca.",
            "...bcbdddcccca.",
            "....cdddccccca.",
            "....cccccccaaa.",
            "..baaacccaaaab.",
            "...baaaaaaab...",
            ".....baab......",
            "..............."
        ],
        "key": {
            "a": [126, 125, 125],
            "b": [42, 42, 42],
            "c": [255, 79, 79],
            "d": [255, 194, 79],
            "e": [246, 255, 27]
        }
    },
    "alien-death-03": {
        "pixels": [
            "...............",
            "......aaaa.....",
            "....aaaaaaa....",
            "...bbbbbbaaaa..",
            "...bcccbbbaaa..",
            "...bddccbbaaa..",
            ".....dccbbbbaaa",
            "......dcbbbbbaa",
            "......bccbbaaaa",
            "....ddccbbbaaaa",
            "....cccbbbaaaa.",
            ".....bbbbabaa..",
            "......abbbaaa..",
            ".........aaa...",
            "..............."
        ],
        "key": {
            "a": [42, 42, 42],
            "b": [126, 125, 125],
            "c": [255, 79, 79],
            "d": [255, 194, 79]
        }
    },
    "alien-death-04": {
        "pixels": [
            "...............",
            "...............",
            ".....aaa.......",
            "....aaaaaaaa...",
            "....aabbbaaaa..",
            ".....abcbbbaa..",
            "....aaabcbbaaa.",
            "....aaabcbbaa..",
            "....abbccbbba..",
            "....bbbbbbbaaa.",
            "....aabbbbaaa..",
            "....aaaaaaaaa..",
            "....aaaaaaaa...",
            "...............",
            "..............."
        ],
        "key": {
            "a": [42, 42, 42],
            "b": [126, 125, 125],
            "c": [255, 79, 79]
        }
    },
    "alien-death-05": {
        "pixels": [
            "...............",
            "...............",
            "...............",
            "...............",
            "......aaa......",
            ".....aaaaaa....",
            ".....aabaaa....",
            ".....aaabaaa...",
            ".....aaabaaaa..",
            ".....aabbaaaa..",
            ".....aaaaaaa...",
            "...............",
            "...............",
            "...............",
            "..............."
        ],
        "key": {
            "a": [42, 42, 42],
            "b": [126, 125, 125]
        }
    },
    "bullet": {
        "pixels": [
            "aba",
            "bcb",
            "aba"
        ],
        "key": {
            "a": [69, 61, 28],
            "b": [207, 186, 84],
            "c": [207, 207, 207]
        }
    },
    "alien-boss1-attack": {
        "pixels": [
            "..aaa..",
            ".baaaa.",
            "b.bcaac",
            "b...bac",
            "bb.bbcc",
            ".bcccc.",
            "..bcb.."
        ],
        "key": {
            "a": [255, 255, 255],
            "b": [119, 118, 118],
            "c": [184, 184, 184]
        }
    },
    "alien-boss1-ouchy-closed": {
        "pixels": [
            ".aab....",
            "aabaabb.",
            "abaaaaaa",
            "caaaaaaa",
            "..aaaaaa",
            "caaaaaa.",
            "bbaabb.."
        ],
        "key": {
            "a": [65, 119, 167],
            "b": [42, 76, 107],
            "c": [255, 255, 255]
        }
    },
    "alien-boss1-ouchy-open": {
        "pixels": [
            ".aaaa....",
            "aabbba...",
            "cbaaaabb.",
            "..aaaaaaa",
            "....aaaaa",
            ".....aaaa",
            "...aaaaa.",
            "caaaabb..",
            "baaa....."
        ],
        "key": {
            "a": [65, 119, 167],
            "b": [42, 76, 107],
            "c": [255, 255, 255]
        }
    },
    "alien-boss1": {
        "pixels": [
            "...................abbbb..............................",
            ".................aaaaaaabbb...........................",
            "...............aaaaaaaaaaaabb.........................",
            "..............aaaaaaabbbbbbaabbb......................",
            "..............aaaaaaaaabbbbbbaaabb....................",
            ".............aaaaccaaaaabbbbbbaaaab...................",
            "...........aaaaddddcccaaaaabbbbaaaab..................",
            "..........aaaaeeddcaaacccaaaaccfaaaab.................",
            "........aaaaaeeeeabbaaaaaccccaaaaaaab.................",
            "......abbbbabeeeaabbaaaaaaaaaaaaaaaaab................",
            "....aabbaaaabbbaaabbaaaaaccccaaaaaaaab................",
            "...aaccaaaaaaaaaaaabbaaaaacccccccaaaac................",
            "..aaaaaaaaaaaaaaaaaaaaaaaaaa...ccccc..................",
            ".aaaaaaaaacccaaaaaaaacaaaaaaaa........................",
            ".aaaaaaaaccccccaaaaacccaaaaddaaa......................",
            "aaaaaacccccc...caaaccc.caaddedaaa.....................",
            "aaaaaac.........caac...ccaadddaaaa....................",
            "aaaaaa..........caa......ccaaadedaa...................",
            "aaaaaa..........caa.......cccadddaaa..................",
            "aaaaba..........caa........cccccaedabbbb..............",
            ".abaga..........caa........ccaaaddedaabbbbb...........",
            "..gagg..........aaa.........ccccaaaaaaaaaabb..........",
            "..g..g..........aa...........ccccaaaaaaaaaabb.........",
            ".............g..aa............caaaaabbbbaaaabb........",
            ".............ggaaa............caaaabaaaabaaaabb.......",
            "..............aaa.............ccccacaccaabaaaab.......",
            "...............................ccaacedccaabaaabbbb....",
            "...............................aaacchdhhcabaaaaccbbb..",
            "..............................aaaacdihidicabaaaaaaa...",
            "..............................aaaacdejejecabaaacbb....",
            "..............................aaaachhhehhhcbaaaaccbb..",
            "..............................caaacieihieiaaaaaaaaccb.",
            "..............................caaaafedededcaaaaaaa....",
            "..............................caaacfhdhdkccaaaaacbb...",
            "..............................cccacaffikicaaaaaaaccbb.",
            "...............................cccacaaffcaaaaaaaaaaccb",
            "................................ccccccaacaaaaacaaaa...",
            ".................................aaaaccaaaaaaaaccbb...",
            "................................aaaaaaaaaaaaaaaaaccb..",
            "...............................aaaaaaaaaaaaaaaaaaaacb.",
            "...............................aaaaaaaaaaabbbaaaaaaacb",
            "...............................caaaaaaaabaaaabaacaaa..",
            "...............................ccaaaaaaaaaccaabaacaa..",
            "...............................ccaaaaaacdedecaabaacb..",
            "................................ccaaaacchehhhcabaaacb.",
            ".................................accccceihieihcabaaacb",
            ".................................aaaaacedejejedcbaaac.",
            ".................................aaaacchhhdhhhdcaaaa..",
            ".................................aaaachidihidihaaaaa..",
            ".................................aaaacdededededaaaac..",
            ".................................aaaachehhhehhdcaaa...",
            ".................................caaaaihieihieccaaa...",
            "................................acaaaafejejedccaaaa...",
            "................................aacaacfekekeccaaaac...",
            "...............................caaaaacafieiccaaaaa....",
            "...............................aaaaaaccaffacaaaaaa....",
            "..............................caaaaaaaccaaaaaaaaac....",
            ".............................ccbaaaaaaacccaaaaaaa.....",
            ".............................cccaaaaaaaaaaaaaaaaa.....",
            ".............................iccccaaaaaaaaaaaaaac.....",
            ".............................hi.accccaaaaaaaaaac......",
            "............................ih..abbccccaaaaaaaab......",
            "............................hi...aaabbccaaaaaccc......",
            "...........................ii...aaaaaabccaaaachc......",
            "...........................hi...aaaaaaaaccaaach.......",
            "..........................ih...caaaaaaaabcccc.hi......",
            "..................aaa.....ii.abacaaaaaaaaaccc.hi......",
            ".................cacccaabacaaaaabcaaaaaaabcc..ih......",
            ".................cbacacaaabcaaaaabcaaaaaaac...ih......",
            ".................cbbaacaaaacaaaaaaacaaaaac.....h......",
            ".................cccccaaaaaacaaaaaacaaaaci.....h......",
            ".................hi...ccccabcaaaaabcaccc.i.....h......",
            "................hhg....iihacccccaacccc..iih...hhg.....",
            "ggggggggggggggggggggggggggggggggggggggggggggggggggggg.",
            ".iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii..",
            "...iiii..iiii.........ijii..iiji.........iiii..iiii...",
            "...hhhhiihhhhihhhhhhhihhhhiihhhhihhhhhhhihhhhiihhhh...",
            "...hhhheehhhhee.....eehhhheehhhhee.....eehhhheehhhh...",
            "...ihhiddihhi.........ihhiddihhi.........ihhi..ihhi..."
        ],
        "key": {
            "a": [207, 76, 27],
            "b": [226, 132, 96],
            "c": [141, 59, 26],
            "d": [0, 0, 0],
            "e": [67, 63, 16],
            "f": [228, 144, 111],
            "g": [255, 255, 255],
            "h": [184, 184, 184],
            "i": [119, 118, 118],
            "j": [117, 0, 0],
            "k": [189, 179, 179]
        }
    },
    "alien-boss1-tail": {
        "pixels": [
            ".aaa.",
            "bccda",
            "bccca",
            "bbcca",
            ".bbb."
        ],
        "key": {
            "a": [226, 132, 96],
            "b": [141, 59, 26],
            "c": [207, 76, 27],
            "d": [255, 255, 255]
        }
    },
};

const PHASER_KEY = {
    "a": [168, 168, 168],
    "b": [255, 255, 255]
};

const PHASER_IMAGES = [
    {
        "pixels": [
            ".aab.",
            "aabbb",
            ".aab."
        ],
        "key": PHASER_KEY
    },
    {
        "pixels": [
            "..aaaabb.",
            "aaaabbbbb",
            "..aaaabb."
        ],
        "key": PHASER_KEY
    },
    {
        "pixels": [
            "...aaaaab.",
            "aaaaaaabbb",
            ".aaaaaabbb",
            "....aaaab."
        ],
        "key": PHASER_KEY
    },
    {
        "pixels": [
            "....aaabb.",
            "..aaaabbbb",
            "aaaaabbbbb",
            "...aaaabb."
        ],
        "key": PHASER_KEY
    },
    {
        "pixels": [
            ".......aaaabbb.",
            "....aaaaabbbccb",
            "aaaaaaabbbbcccc",
            "....aaaaabbbccb",
            ".......aaaabbb."
        ],
        "key": {
            "a": [168, 168, 168],
            "b": [255, 255, 255],
            "c": [203, 226, 230]
        }
    }
];

function rotateImage90(image) {
    const num_cols = image.pixels[0].length;
    let pixels = [];
    for (let i = 0; i < num_cols; i++) {
        pixels.push("");
    }

    for (const row of image.pixels) {
        let col_n = 0;
        for (const ch of row) {
            pixels[col_n] = ch + pixels[col_n];
            col_n++;
        }
    }

    return {
        "pixels": pixels,
        "key": image.key
    };
}

function rotateImage180(image) {
    let pixels = [];

    for (const row of image.pixels) {
        pixels.push(row.split("").reverse().join(""));
    }
    pixels.reverse();

    return {
        "pixels": pixels,
        "key": image.key
    };
}

function rotateImage270(image) {
    const num_cols = image.pixels[0].length;
    let pixels = [];
    for (let i = 0; i < num_cols; i++) {
        pixels.push("");
    }

    for (const row of image.pixels) {
        let col_n = 0;
        for (const ch of row) {
            pixels[col_n] = pixels[col_n] + ch;
            col_n++;
        }
    }
    pixels.reverse();

    return {
        "pixels": pixels,
        "key": image.key
    };
}

/**
 * Create rotated images based on templates and insert them into the
 * IMAGES array.
 *
 * Expects angles 270, 292, 315 and 337 to exist - will create the others.
 */
function rotateImages(prefix) {
    for (const quadrant of [0, 90, 180]) {
        for (const add of [0, 22, 45, 67]) {
            const angle = quadrant + add;
            const orig_angle = 270 + (angle % 90)
            let rot;
            if (quadrant === 0) {
                rot = rotateImage90;
            } else if (quadrant === 90) {
                rot = rotateImage180;
            } else {
                rot = rotateImage270;
            }
            IMAGES[prefix + angle] = rot(IMAGES[prefix + orig_angle]);
        }
    }
}

rotateImages("alien-circle-gun-");
rotateImages("alien-circle-gun-dead-");
rotateImages("alien-circle-ouchy-");

const OUCHY_IMAGES = {};

function makeOuchyImages(prefix) {
    for (const k in IMAGES) {
        if (IMAGES.hasOwnProperty(k) && k.startsWith(prefix)) {
            OUCHY_IMAGES[k] = capsLettersOnly(IMAGES[k]);
        }
    }
}

makeOuchyImages("alien-circle-ouchy-");

function image_width(image) {
    return image.pixels[0].length;
}

function image_height(image) {
    return image.pixels.length;
}

function angle_name(vx, vy, min_d, max_d) {
    let d = (360 + 90 + Math.atan2(vy, vx) * 180 / Math.PI) % 360;

    if (d < min_d) {
        d = min_d;
    } else if (d > max_d) {
        d = max_d;
    }

    if (d > 348.5) {
        return "0";
    } else if (d > 326) {
        return "337";
    } else if (d > 303.5) {
        return "315";
    } else if (d > 281) {
        return "292";
    } else if (d > 258.5) {
        return "270";
    } else if (d > 236) {
        return "247";
    } else if (d > 213.5) {
        return "225";
    } else if (d > 191) {
        return "202";
    } else if (d > 168.5) {
        return "180";
    } else if (d > 146) {
        return "157";
    } else if (d > 123.5) {
        return "135";
    } else if (d > 101) {
        return "112";
    } else if (d > 78.5) {
        return "90";
    } else if (d > 56) {
        return "67";
    } else if (d > 33.5) {
        return "45";
    } else if (d > 11) {
        return "22";
    } else {
        return "0";
    }
}

function current_move_cyclic(motion, t) {
    let total_t = 0;
    for (const [tn, move] of motion) {
        total_t += tn;
    }

    return current_move(motion, t % total_t);
}

function current_move(motion, t) {
    let tn_acc = 0;
    for (const [tn, move] of motion) {
        tn_acc += tn;
        if (t < tn_acc) {
            return move;
        }
    }
    return null;
}

const SHIP_WIDTH = image_width(IMAGES["ship"]);
const SHIP_HEIGHT = image_height(IMAGES["ship"]);

const ALIEN_UPDATERS = {
    red_flat: function(model, alien) {
        const alien_image = IMAGES[alien.image];
        alien.x -= 0.2;
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
        alien.y = alien.start_y + Math.sin(alien.x * 0.5) * 4;
        maybeAddBullet(alien.x + 6, alien.y + 5, 0.006, alien, model);
    },
    yellow_line: function(model, alien) {
        const new_y = alien.start_y +
            Math.sin(alien.x_off + alien.x * 0.05) * 20;
        const vx = -0.6;
        const vy = new_y - alien.y;
        alien.image = alien.image_base + angle_name(vx, vy, 180, 315);
        const alien_image = IMAGES[alien.image];
        alien.x += vx;
        alien.y = new_y;
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
        maybeAddBullet(alien.x + 7, alien.y + 7, 0.003, alien, model);
    },
    yellow_circ: function(model, alien) {
        const cos = (degrees) => Math.cos(Math.PI * (degrees/180));
        const sin = (degrees) => Math.sin(Math.PI * (degrees/180));

        const new_x = alien.cx + cos(alien.angle) * alien.radius;
        const new_y = alien.cy + sin(alien.angle) * alien.radius;

        const vx = new_x - alien.x;
        const vy = new_y - alien.y;
        alien.x = new_x;
        alien.y = new_y;
        alien.angle += 1;

        alien.image = alien.image_base + angle_name(vx, vy, 180, 315)
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
        maybeAddBullet(alien.x + 7, alien.y + 7, 0.003, alien, model);
    },
    circle_gun: function(model, alien) {
        const cos = (degrees) => Math.cos(Math.PI * (degrees/180));
        const sin = (degrees) => Math.sin(Math.PI * (degrees/180));

        const new_x = alien.cx + cos(alien.angle) * alien.radius;
        const new_y = alien.cy + sin(alien.angle) * alien.radius;

        const vx = new_x - alien.x;
        const vy = new_y - alien.y;
        alien.x = new_x;
        alien.y = new_y;
        alien.angle += 1;

        alien.image = alien.image_base + angle_name(vx, vy, 0, 360)
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }

        if (alien.dead === false && alien.damage > 0) {
            alien.health--;
            alien.damage--;
            if (alien.health < 0) {
                alien.image_base = "alien-circle-gun-dead-";
                const exploding_me = JSON.parse(JSON.stringify(alien));
                exploding_me.dead = 1;
                model.aliens.push(exploding_me);
            }
        }

        // Single shot from all guns at a set time
        if (
            alien.dead === false
            && alien.image_base === "alien-circle-gun-"
            && (
                (model.screen.x >= 865 && model.screen.x < 865.5)
                || (model.screen.x >= 950 && model.screen.x < 950.5)
            )
        ) {
            model.bullets.push(
                [alien.x + 9, alien.y + 9, -vy * 1.2, vx * 1.2]);
        }
    },
    tracks: function(model, alien) {
        const move = current_move(alien.motion, alien.t);
        if (move === 1 || move === -1) {
            alien.x += move;
            alien.frame += 1;
            if (alien.frame > 2) {
                alien.frame = 0;
            }
        } else if (move === -2) {
            alien.y += 2;
        }
        alien.t += 1;
        alien.image = (
            alien.image_base
            + (alien.frame + 1)
            + ((move > 0) ? "-right": "-left")
        );
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
        maybeAddBullet(alien.x + 9, alien.y + 9, 0.006, alien, model);
    },
    tokenCarrier: function(model, alien) {
        alien.t += 1;
        alien.x += 0.25;
        alien.y += 0.25 * current_move(alien.motion, alien.t);
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
    },
    rocketPack: function(model, alien) {
        alien.t += 1;
        const move = current_move_cyclic(alien.motion, alien.t);
        if (move === null) {
            return;
        }
        alien.x += move[0];
        alien.y += move[1];
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
        if (alien.firing.some(
            (t) => { let d = t - alien.t; return d >= 0 && d < 1; })
        ) {
            model.aliens.unshift(newRocket(alien.x, alien.y))
        }

        if (alien.dead === false && alien.damage > 0) {
            alien.health--;
            alien.damage--;
            model.score += 100;
            if (alien.health < 0) {
                alien.dead = 1;
            }
        }
    },
    rocket: function(model, alien) {
        const alien_image = IMAGES[alien.image];
        alien.x -= 3.5;
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
    },
    fork: function(model, alien) {
        let [dx, dy] = current_move_cyclic(alien.motion, alien.t);
        alien.t += 1;
        alien.x += dx;
        alien.y += dy;
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
        maybeAddBullet(alien.x + 2, alien.y + 7, 0.006, alien, model);
    },
    gun: function(model, alien) {
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }
        maybeAddBullet(
            alien.x + 1, alien.y + alien.bullet_y, 0.006, alien, model);
    },
    verticalRocket: function(model, alien) {
        alien.t += 1;
        const move = current_move_cyclic(alien.motion, alien.t);
        if (move === null) {
            return;
        }
        if (move === STOP_L) {
            if (Math.round(alien.t) % 6 == 0) {
                model.aliens.unshift(newBulletVerticalRocket(alien.x, alien.y));
            }
        } else {
            alien.x += move;
        }
        const alien_image = IMAGES[alien.image];
        if (alien.x + image_width(alien_image) < model.screen.x) {
            alien.dead = true;
            return;
        }

        if (alien.dead === false && alien.damage > 0) {
            alien.health--;
            alien.damage--;
            model.score += 100;
            if (alien.health < 0) {
                alien.dead = 1;
            }
        }
    },
    bulletVerticalRocket: function(model, alien) {
        alien.x += alien.dx;
        alien.y += alien.dy;
        alien.dy += 0.15;
        if (alien.dy > 2) {
            alien.dy = 2;
        }
        const alien_image = IMAGES[alien.image];

        // Disappear if we hit scenery
        const level = LEVELS[model.level];
        for (const scenery of level.scenery) {
            const image = IMAGES[scenery.image]
            if (
                images_overlap(
                    image,
                    scenery.x,
                    scenery.y,
                    alien_image,
                    alien.x,
                    alien.y
                )
            ) {
                alien.dead = true;
            }
        }

        if (
            alien.y > HEIGHT ||
            ( alien.x + image_width(alien_image) < model.screen.x )
        ) {
            alien.dead = true;
            return;
        }
    },
    boss1: function(model, alien) {
        const level = LEVELS[model.level];
        if (model.screen.x + WIDTH < level.width) {
            return;
        }
        alien.x = alien.next_x;
        alien.t += 1;
        const move = current_move_cyclic(alien.motion, alien.t);
        if (move !== STOP_L) {
            alien.next_x += move * 0.25;
        }

        if (alien.dead === false && alien.damage > 0) {
            alien.health--;
            alien.damage--;
            if (alien.health < 0) {
                alien.dead = 1;
                model.aliens.push(newExplosion(alien.x + 17, alien.y +  2));
                model.aliens.push(newExplosion(alien.x + 10, alien.y +  3));
                model.aliens.push(newExplosion(alien.x +  3, alien.y + 11));
                model.aliens.push(newExplosion(alien.x + 26, alien.y + 12));
                model.aliens.push(newExplosion(alien.x + 40, alien.y + 21));
                model.aliens.push(newExplosion(alien.x + 30, alien.y + 24));
                model.aliens.push(newExplosion(alien.x + 42, alien.y + 30));
                model.aliens.push(newExplosion(alien.x + 31, alien.y + 33));
                model.aliens.push(newExplosion(alien.x + 43, alien.y + 36));
                model.aliens.push(newExplosion(alien.x + 32, alien.y + 42));
                model.aliens.push(newExplosion(alien.x + 43, alien.y + 49));
                model.aliens.push(newExplosion(alien.x + 30, alien.y + 52));
                model.aliens.push(newExplosion(alien.x + 33, alien.y + 60));
                model.aliens.push(newExplosion(alien.x + 26, alien.y + 66));
            }
        }
    },
    boss1attack: function(model, alien) {
        alien.x -= 5;
        alien.y += alien.vy;
        alien.vy += alien.ay;
    },
    boss1ouchy: function(model, alien) {
        const body = find_alien(model, "alien-boss1");
        if (!body) {
            return;
        }
        const level = LEVELS[model.level];
        if (model.screen.x + WIDTH < level.width) {
            return;
        }
        alien.t += 1;
        const move = current_move_cyclic(alien.motion, alien.t);
        alien.move = move;
        if (move === FIRE_L) {
            if (alien.t % 2 === 0 && alien.fire_count > 0) {
                alien.fire_count--;
                let ay = 0;
                const ydiff = model.ship.y - alien.y;
                if (ydiff < -10) {
                    ay = -0.2;
                } else if (ydiff > 10) {
                    ay = 0.2;
                }
                model.aliens.push(
                    newBoss1Attack(alien.x - 1, alien.y + 1, ay));
            }
        } else if (move === RETRACTED) {
            alien.fire_count = 5;
        } else if (move === STOP_L) {
            // Do nothing
        } else {
            alien.rel_x += move;
        }

        if (move == FIRE_L) {
            alien.rel_y = alien.initial_rel_y - 1;
            alien.image = "alien-boss1-ouchy-open";
        } else {
            alien.rel_y = alien.initial_rel_y;
            alien.image = "alien-boss1-ouchy-closed";
        }

        if (alien.dead === false && alien.damage > 0) {
            alien.health--;
            alien.damage--;
            model.score += 100;
            if (alien.health < 0) {
                alien.dead = 1;
                model.won = true;
            }
        }

        alien.x = body.next_x + alien.rel_x;
        alien.y = body.y + alien.rel_y;
    },
    boss1tailroot: function(model, alien, body) {
        if (!body) {
            return;
        }
        alien.t += 1;
        alien.move = current_move_cyclic(alien.motion, alien.t);
        alien.x = body.x + alien.rel_x;
        alien.y = body.y + alien.rel_y;

        if (alien.dead === false && alien.damage > 0) {
            alien.health--;
            alien.damage--;
            if (alien.health < 0) {
                alien.dead = 1;
            }
        }
    },
    boss1tail: function(model, alien, prev) {
        if (!prev) {
            return;
        }
        const cos = (degrees) => Math.cos(Math.PI * (degrees/180));
        const sin = (degrees) => Math.sin(Math.PI * (degrees/180));
        alien.moves.push(prev.move);
        if (alien.moves.length > 4) {
            alien.move = alien.moves.shift();
        } else {
            alien.move = STOP_L;
        }
        if (alien.move === CLOCKWISE) {
            alien.rel_d += 1.2;
            if (alien.rel_d > 20) {
                alien.rel_d = 20;
            }
        } else if (alien.move === ANTICLOCKWISE) {
            alien.rel_d -= 1.2;
            if (alien.rel_d < -2) {
                alien.rel_d = -2;
            }
        }
        alien.d = prev.d + alien.rel_d;
        alien.x = prev.x + (5 * cos(alien.d));
        alien.y = prev.y + (5 * sin(alien.d));
        alien.t += 1;

        if (alien.dead === false && alien.damage > 0) {
            alien.health--;
            alien.damage--;
            if (alien.health < 0) {
                alien.dead = 1;
            }
        }
    },
    explosion: function(model, alien, prev) {
    }
};

function maybeAddBullet(x, y, delta, alien, model) {
    alien.bullet_countdown -= delta;
    if (alien.bullet_countdown < 0) {
        alien.bullet_countdown = 0.5 + Math.random() * 0.5;
        const dir_x = model.ship.x + 5 - x;
        const dir_y = model.ship.y + 1 - y;
        const dist = Math.sqrt(dir_x*dir_x + dir_y*dir_y);
        const speed_mult = 0.6 / dist;
        const vx = dir_x * speed_mult;
        const vy = dir_y * speed_mult;
        model.bullets.push([x, y, vx + SCROLL_SPEED, vy]);
    }
}

function damage(bullet_size) {
    switch (bullet_size) {
        case 4: return 10;
        case 3: return 5;
        case 2: return 3
        case 1: return 2;
        default: return 1;
    }
}

function capsLettersOnly(image) {
    let pixels = image.pixels.map(
        row => row.replace(/[^A-Z]/g, ".")
    );

    return {
        "pixels": pixels,
        "key": image.key
    };
}

const ALIEN_COLLIDERS = {
    weak: function(model, alien) {
        if (alien.dead === true) {
            return;
        }
        if (alien.dead !== false) {
            alien.dead += 1;
            if (alien.dead > 5) {
                alien.dead = true;
            }
            return;
        }

        const alien_image = IMAGES[alien.image];

        for (const bullet of model.ship.bullets) {
            if (bullet.dead) {
                continue;
            }
            if (
                images_overlap(
                    PHASER_IMAGES[bullet.size], bullet.x, bullet.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                if (bullet.size < 1) {
                    bullet.dead = true;
                }
                alien.dead = 1;
                model.score += 100;
                return;
            }
        }

        for (const shot of model.ship.diagonals.shots) {
            const front = shot.pixels[shot.pixels.length - 1];
            if (front) {
                const [x, y] = front;
                if (
                    !shot.dead
                    && hits_image(alien_image, alien.x, alien.y, x, y)
                ) {
                    alien.dead = 1;
                    model.score += 100;
                    return;
                }
            }
        }

        if (model.ship.dead === false) {
            if (model.ship.upgrades !== "") {
                const nose_attach_image = IMAGES["ship-nose-attach"];
                if (
                    images_overlap(
                        nose_attach_image, model.ship.x + 12, model.ship.y,
                        alien_image, alien.x, alien.y
                    )
                ) {
                    alien.dead = 1;
                    model.score += 100;
                    return;
                }
            }

            const ship_image = IMAGES["ship"];
            if (
                images_overlap(
                    ship_image, model.ship.x, model.ship.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                alien.dead = 1;
                model.ship.dead = 1;
                model.score += 100;
                return;
            }
        }
    },
    rock: function(model, alien) {
        if (alien.dead === true) {
            return;
        }
        if (alien.dead !== false) {
            alien.dead += 1;
            if (alien.dead > 5) {
                alien.dead = true;
            }
            return;
        }

        const alien_image = IMAGES[alien.image];

        for (const bullet of model.ship.bullets) {
            if (bullet.dead) {
                continue;
            }
            if (
                images_overlap(
                    PHASER_IMAGES[bullet.size], bullet.x, bullet.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                bullet.dead = true;
            }
        }

        if (model.ship.dead === false) {
            const ship_image = IMAGES["ship"];
            if (
                images_overlap(
                    ship_image, model.ship.x, model.ship.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                model.ship.dead = 1;
            }
        }
    },
    tokenCarrier: function(model, alien) {
        const d = alien.dead;
        ALIEN_COLLIDERS.weak(model, alien);
        if (d === false && alien.dead !== false) {
            model.tokens.push([alien.x + 3, alien.y + 3]);
        }
    },
    rocket: function(model, alien) {
        if (alien.dead === true) {
            return;
        }
        // Bullets and nose attachements have no effect, and hitting
        // the ships kills it but not us.
        const alien_image = IMAGES[alien.image];
        if (model.ship.dead === false) {
            const ship_image = IMAGES["ship"];
            if (
                images_overlap(
                    ship_image, model.ship.x, model.ship.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                model.ship.dead = 1;
            }
        }
    },
    strong: function(model, alien) {
        if (alien.dead === true) {
            return;
        }
        if (alien.dead !== false) {
            alien.dead += 1;
            if (alien.dead > 5) {
                alien.dead = true;
            }
            return;
        }

        const alien_image = IMAGES[alien.image];

        for (const bullet of model.ship.bullets) {
            if (bullet.dead) {
                continue;
            }
            if (
                images_overlap(
                    PHASER_IMAGES[bullet.size], bullet.x, bullet.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                bullet.dead = true;
                alien.damage += damage(bullet.size);
            }
        }

        for (const shot of model.ship.diagonals.shots) {
            const front = shot.pixels[shot.pixels.length - 1];
            if (front) {
                const [x, y] = front;
                if (
                    !shot.dead
                    && hits_image(alien_image, alien.x, alien.y, x, y)
                ) {
                    shot.dead = true;
                    alien.damage += damage(1);
                }
            }
        }

        if (model.ship.dead === false) {
            if (model.ship.upgrades !== "") {
                const nose_attach_image = IMAGES["ship-nose-attach"];
                if (
                    images_overlap(
                        nose_attach_image, model.ship.x + 12, model.ship.y,
                        alien_image, alien.x, alien.y
                    )
                ) {
                    if (model.screen.x % 2 == 0) {
                        alien.damage += 1;
                    }
                }
            }

            const ship_image = IMAGES["ship"];
            if (
                images_overlap(
                    ship_image, model.ship.x, model.ship.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                alien.damage += 5;
                model.ship.dead = 1;
            }
        }
    },
    circle_ouchy: function(model, alien) {
        if (alien.dead === true) {
            return;
        }
        if (alien.dead !== false) {
            alien.dead += 1;
            if (alien.dead > 5) {
                alien.dead = true;
            }
            return;
        }

        const alien_image = IMAGES[alien.image];

        function inflict(damage) {
            alien.damage += damage;
            for (const other_alien of model.aliens) {
                if (other_alien.collide === ALIEN_COLLIDERS.rock.name) {
                    other_alien.damage += damage;
                }
            }
        }

        // ouchy_image can be undefined if this image does not
        // have ouchies defined.
        const ouchy_image = OUCHY_IMAGES[alien.image];

        for (const bullet of model.ship.bullets) {
            if (bullet.dead) {
                continue;
            }
            const bullet_image = PHASER_IMAGES[bullet.size];
            if (
                images_overlap(
                    bullet_image, bullet.x, bullet.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                bullet.dead = true;
                if (
                    ouchy_image
                    && images_overlap(
                        bullet_image, bullet.x, bullet.y,
                        ouchy_image, alien.x, alien.y
                    )
                ) {
                    inflict(damage(bullet.size));
                }
            }
        }

        for (const shot of model.ship.diagonals.shots) {
            const front = shot.pixels[shot.pixels.length - 1];
            if (front) {
                const [x, y] = front;
                if (
                    !shot.dead
                    && hits_image(alien_image, alien.x, alien.y, x, y)
                ) {
                    shot.dead = true;
                    if (
                        ouchy_image
                        && hits_image(ouchy_image, alien.x, alien.y, x, y)
                    ) {
                        inflict(damage(1));
                    }
                }
            }
        }

        if (model.ship.dead === false) {
            if (model.ship.upgrades !== "") {
                const nose_attach_image = IMAGES["ship-nose-attach"];
                if (
                    images_overlap(
                        nose_attach_image, model.ship.x + 12, model.ship.y,
                        alien_image, alien.x, alien.y
                    )
                ) {
                    if (
                        ouchy_image
                        && images_overlap(
                            nose_attach_image, model.ship.x + 12, model.ship.y,
                            ouchy_image, alien.x, alien.y
                        )
                        && model.screen.x % 2 == 0
                    ) {
                        inflict(1);
                    }
                }
            }

            const ship_image = IMAGES["ship"];
            if (
                images_overlap(
                    ship_image, model.ship.x, model.ship.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                model.ship.dead = 1;
                if (
                    ouchy_image
                    && images_overlap(
                        ship_image, model.ship.x, model.ship.y,
                        ouchy_image, alien.x, alien.y
                    )
                ) {
                    inflict(5);
                }
            }
        }
    },
    boss1ouchy: function(model, alien) {
        // No collisions if we are back inside the body
        if (alien.dead === true || alien.move === RETRACTED) {
            return;
        }
        if (alien.dead !== false) {
            alien.dead += 1;
            if (alien.dead > 5) {
                alien.dead = true;
            }
            return;
        }

        const alien_image = IMAGES[alien.image];

        function inflict(damage) {
            alien.damage += damage;
            for (const other_alien of model.aliens) {
                if (other_alien.collide === ALIEN_COLLIDERS.rock.name) {
                    other_alien.damage += damage;
                }
            }
        }

        for (const bullet of model.ship.bullets) {
            if (bullet.dead) {
                continue;
            }
            const bullet_image = PHASER_IMAGES[bullet.size];
            if (
                images_overlap(
                    bullet_image, bullet.x, bullet.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                bullet.dead = true;
                inflict(damage(bullet.size));
            }
        }

        for (const shot of model.ship.diagonals.shots) {
            const front = shot.pixels[shot.pixels.length - 1];
            if (front) {
                const [x, y] = front;
                if (
                    !shot.dead
                    && hits_image(alien_image, alien.x, alien.y, x, y)
                ) {
                    shot.dead = true;
                    inflict(damage(1));
                }
            }
        }

        if (model.ship.dead === false) {
            if (model.ship.upgrades !== "") {
                const nose_attach_image = IMAGES["ship-nose-attach"];
                if (
                    images_overlap(
                        nose_attach_image, model.ship.x + 12, model.ship.y,
                        alien_image, alien.x, alien.y
                    )
                ) {
                    if (model.screen.x % 2 == 0) {
                        inflict(1);
                    }
                }
            }

            const ship_image = IMAGES["ship"];
            if (
                images_overlap(
                    ship_image, model.ship.x, model.ship.y,
                    alien_image, alien.x, alien.y
                )
            ) {
                model.ship.dead = 1;
                inflict(5);
            }
        }
    }
};

function newRedFlat(x, y) {
    return {
        spawn_x: x - 10,
        start_y: y,
        x: x,
        y: y,
        dead: false,
        update: ALIEN_UPDATERS.red_flat.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image: "alien-red-flat"
    };
}

function newYellowLine(x, y, x_off) {
    return {
        spawn_x: x - 10,
        start_y: y,
        x: x,
        y: y,
        dead: false,
        x_off: x_off,
        update: ALIEN_UPDATERS.yellow_line.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image_base: "alien-yellow-line-"
    };
}

function newYellowCirc(spawn_x, cx, cy, radius, angle) {
    return {
        spawn_x: spawn_x,
        cx: cx,
        cy: cy,
        radius: radius,
        angle: angle,
        x: cx,
        y: cy,
        dead: false,
        update: ALIEN_UPDATERS.yellow_circ.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image_base: "alien-yellow-line-"
    };
}

function newCircleGun(spawn_x, cx, cy, radius, angle) {
    return {
        spawn_x: spawn_x,
        cx: cx,
        cy: cy,
        radius: radius,
        angle: angle,
        x: cx,
        y: cy,
        dead: false,
        health: 10,
        damage: 0,
        update: ALIEN_UPDATERS.circle_gun.name,
        collide: ALIEN_COLLIDERS.rock.name,
        image_base: "alien-circle-gun-"
    };
}

function newCircleOuchy(spawn_x, cx, cy, radius, angle) {
    return {
        spawn_x: spawn_x,
        cx: cx,
        cy: cy,
        radius: radius,
        angle: angle,
        x: cx,
        y: cy,
        dead: false,
        health: 10,
        damage: 0,
        update: ALIEN_UPDATERS.circle_gun.name,
        collide: ALIEN_COLLIDERS.circle_ouchy.name,
        image_base: "alien-circle-ouchy-"
    };
}

function newTracks(x, y, motion) {
    return {
        spawn_x: x - 10,
        start_x: x,
        x: x,
        y: y,
        dead: false,
        motion: motion,
        t: 0,
        frame: 0,
        update: ALIEN_UPDATERS.tracks.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image_base: "alien-tracks-"
    };
}

function newTokenCarrier(x, y, motion) {
    return {
        spawn_x: x - 10,
        x: x,
        y: y,
        dead: false,
        motion: motion,
        t: 0,
        update: ALIEN_UPDATERS.tokenCarrier.name,
        collide: ALIEN_COLLIDERS.tokenCarrier.name,
        image: "token-carrier-blue"
    };
}

function newRocketPack(x, y, motion, firing) {
    return {
        spawn_x: x - 10,
        x: x,
        y: y,
        dead: false,
        health: 10,
        damage: 0,
        motion: motion,
        firing: firing,
        t: 0,
        update: ALIEN_UPDATERS.rocketPack.name,
        collide: ALIEN_COLLIDERS.strong.name,
        image: "alien-rocket-pack"
    };
}

function newRocket(x, y) {
    return {
        spawn_x: x - 10,
        x: x - 11,
        y: y + 6,
        dead: false,
        update: ALIEN_UPDATERS.rocket.name,
        collide: ALIEN_COLLIDERS.rocket.name,
        image: "bullet-rocket-pack"
    };
}

function newFork(x, y, motion) {
    return {
        spawn_x: x - 10,
        x: x,
        y: y,
        dead: false,
        motion: motion,
        t: 0,
        update: ALIEN_UPDATERS.fork.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image: "alien-fork"
    };
}

function newGunTop(x, y, image) {
    return {
        spawn_x: x - 10,
        x: x,
        y: y,
        bullet_y: 5,
        dead: false,
        update: ALIEN_UPDATERS.gun.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image: "alien-gun-top"
    };
}

function newVerticalRocket(x, y, motion) {
    return {
        spawn_x: x - 10,
        x: x,
        y: y,
        dead: false,
        health: 10,
        damage: 0,
        motion: motion,
        t: 0,
        update: ALIEN_UPDATERS.verticalRocket.name,
        collide: ALIEN_COLLIDERS.strong.name,
        image: "alien-vertical-rocket"
    };
}

function newBulletVerticalRocket(x, y) {
    return {
        spawn_x: x - 10,
        x: x + 6,
        y: y,
        dy: -3.5,
        dx: -0.3,
        dead: false,
        update: ALIEN_UPDATERS.bulletVerticalRocket.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image: "bullet-vertical-rocket"
    };
}

function newGunBottom(x, y, image) {
    return {
        spawn_x: x - 10,
        x: x,
        y: y,
        bullet_y: 0,
        dead: false,
        update: ALIEN_UPDATERS.gun.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image: "alien-gun-bottom"
    };
}

function newExplosion(x, y) {
    return {
        x: x,
        y: y,
        dead: 1,
        update: ALIEN_UPDATERS.explosion.name,
        collide: ALIEN_COLLIDERS.weak.name,
        image: "alien-red-flat"
    }
}

function newBoss1Body(x, y, motion) {
    return {
        name: "alien-boss1",
        spawn_x: x - 10,
        x: x,
        next_x: x,
        y: y,
        dead: false,
        health: 20,
        damage: 0,
        motion: motion,
        t: 0,
        update: ALIEN_UPDATERS.boss1.name,
        collide: ALIEN_COLLIDERS.rock.name,
        image: "alien-boss1"
    };
}

function newBoss1Attack(x, y, ay) {
    return {
        x: x,
        y: y,
        vy: 0,
        ay: ay,
        dead: false,
        update: ALIEN_UPDATERS.boss1attack.name,
        collide: ALIEN_COLLIDERS.rock.name,
        image: "alien-boss1-attack"
    }
}

function newBoss1Ouchy(rel_x, rel_y, body, motion) {
    return {
        spawn_x: body.spawn_x - 1,
        x: body.x + rel_x,
        y: body.y + rel_y,
        rel_x: rel_x,
        rel_y: rel_y,
        initial_rel_y: rel_y,
        fire_count: 5,
        dead: false,
        health: 20,
        damage: 0,
        motion: motion,
        move: RETRACTED,
        t: 0,
        update: ALIEN_UPDATERS.boss1ouchy.name,
        collide: ALIEN_COLLIDERS.boss1ouchy.name,
        image: "alien-boss1-ouchy-closed"
    };
}

function newTailRoot(rel_x, rel_y, d, body, motion) {
    return {
        spawn_x: body.spawn_x,
        x: body.x + rel_x,
        y: body.y + rel_y,
        d: d,
        rel_x: rel_x,
        rel_y: rel_y,
        dead: false,
        health: 20,
        damage: 0,
        motion: motion,
        t: 0,
        update: ALIEN_UPDATERS.boss1tailroot.name,
        collide: ALIEN_COLLIDERS.rock.name,
        image: "alien-boss1-tail"
    };
}

function newTail(rel_d, prev) {
    return {
        spawn_x: prev.spawn_x,
        x: prev.x,
        y: prev.y,
        rel_d: rel_d,
        moves: [],
        dead: false,
        health: 20,
        damage: 0,
        update: ALIEN_UPDATERS.boss1tail.name,
        collide: ALIEN_COLLIDERS.rock.name,
        image: "alien-boss1-tail"
    };
}

function createBoss1(x, y) {
    const body_motion = [
        [284, STOP_L],
        [160, MOVE_L],
        [106, STOP_L],
        [160, MOVE_R]
    ];
    const body = newBoss1Body(x, y, body_motion);
    const ouchy_motion = [
        [80, RETRACTED],
        [9, MOVE_L],
        [2, STOP_L],
        [40, FIRE_L],
        [2, STOP_L],
        [9, MOVE_R],
    ];
    const ouchy = newBoss1Ouchy(32, 38, body, ouchy_motion);
    const tail_motion = [
        [37, CLOCKWISE],
        [37, ANTICLOCKWISE],
        [11, STOP_L]
    ];
    const tail_root = newTailRoot(16, 66, 180, body, tail_motion);
    const tail = [tail_root];

    let prev_piece = tail_root;
    for (let i = 0; i < 12; i++) {
        const piece = newTail(i * -2, prev_piece);
        tail.push(piece);
        prev_piece = piece;
    }
    return {body, ouchy, tail}
}

const boss1parts = createBoss1(1472, 9);

const LEVELS = [
    {
        scenery: [
            { x:   0, y: 80, image: "machinery-20x16-01"},
            { x:  20, y: 88, image: "machinery-20x08-01"},
            { x:  40, y: 88, image: "machinery-20x08-02"},
            { x:  60, y: 88, image: "machinery-20x08-03"},
            { x:  80, y: 72, image: "machinery-20x24-01"},
            { x: 100, y: 80, image: "machinery-20x16-01"},
            { x: 120, y: 88, image: "machinery-20x08-03"},
            { x: 140, y: 88, image: "machinery-20x08-02"},
            { x: 160, y: 88, image: "machinery-20x08-01"},
            { x: 180, y: 88, image: "machinery-20x08-01"},
            { x: 200, y: 88, image: "machinery-20x08-03"},
            { x: 220, y: 80, image: "machinery-20x16-01"},
            { x: 240, y: 88, image: "machinery-20x08-03"},
            { x: 260, y: 72, image: "machinery-20x24-01"},
            { x: 280, y: 88, image: "machinery-20x08-02"},
            { x: 300, y: 88, image: "machinery-20x08-01"},
            { x: 320, y: 88, image: "machinery-20x08-03"},
            { x: 340, y: 88, image: "machinery-20x08-03"},
            { x: 360, y: 88, image: "machinery-20x08-02"},
            { x: 380, y: 88, image: "machinery-20x08-03"},
            { x: 400, y: 88, image: "machinery-20x08-01"},
            { x: 420, y: 80, image: "machinery-20x16-01"},
            { x: 440, y: 88, image: "machinery-20x08-03"},
            { x: 460, y: 88, image: "machinery-20x08-02"},
            { x: 480, y: 88, image: "machinery-20x08-03"},
            { x: 500, y: 88, image: "machinery-20x08-01"},
            { x: 520, y: 88, image: "machinery-20x08-03"},
            { x: 540, y: 88, image: "machinery-20x08-02"},
            { x: 560, y: 88, image: "machinery-20x08-03"},
            { x: 580, y: 88, image: "machinery-20x08-01"},
            { x: 600, y: 88, image: "machinery-20x08-03"},
            { x: 620, y: 88, image: "machinery-20x08-02"},
            { x: 640, y: 88, image: "machinery-20x08-03"},
            { x: 660, y: 88, image: "machinery-20x08-01"},
            { x: 680, y: 80, image: "machinery-20x16-01"},
            { x: 700, y: 88, image: "machinery-20x08-02"},
            { x: 726, y:  0, image: "machinery-gateway-top-40x40"},
            { x: 726, y: 56, image: "machinery-gateway-bottom-40x40"},
            { x: 766, y:  0, image: "machinery-top-20x08-01"},
            { x: 766, y: 88, image: "machinery-20x08-01"},
            { x: 786, y:  0, image: "machinery-top-20x08-02"},
            { x: 786, y: 88, image: "machinery-20x08-02"},
            { x: 806, y:  0, image: "machinery-top-20x08-03"},
            { x: 806, y: 88, image: "machinery-20x08-03"},
            { x: 826, y:  0, image: "machinery-top-20x16-01"},
            { x: 826, y: 80, image: "machinery-20x16-01"},
            { x: 846, y:  0, image: "machinery-top-20x24-01"},
            { x: 846, y: 72, image: "machinery-20x24-01"},
            { x: 866, y:  0, image: "machinery-top-20x08-02"},
            { x: 866, y: 88, image: "machinery-20x08-02"},
            { x: 886, y:  0, image: "machinery-top-20x08-01"},
            { x: 886, y: 88, image: "machinery-20x08-01"},
            { x: 906, y: 88, image: "machinery-20x08-03"},
            { x: 926, y:  0, image: "machinery-top-20x08-01"},
            { x: 926, y: 88, image: "machinery-20x08-01"},
            { x: 946, y:  0, image: "machinery-curve-tl-20x16"},
            { x: 946, y: 80, image: "machinery-curve-bl-20x16"},
            { x: 966, y:  0, image: "machinery-top-20x08-02"},
            { x: 966, y: 88, image: "machinery-20x08-02"},
            { x: 986, y:  0, image: "machinery-curve-tr-20x16"},
            { x: 986, y: 80, image: "machinery-curve-br-20x16"},
            { x: 1006, y: 88, image: "machinery-20x08-03"},
            { x: 1006, y:  0, image: "machinery-top-20x08-03"},
            { x: 1026, y: 88, image: "machinery-20x08-02"},
            { x: 1026, y:  0, image: "machinery-top-20x08-01"},
            { x: 1046, y: 72, image: "machinery-20x24-01"},
            { x: 1046, y:  0, image: "machinery-top-20x16-01"},
            { x: 1066, y: 88, image: "machinery-20x08-01"},
            { x: 1066, y:  0, image: "machinery-top-20x08-03"},
            { x: 1086, y: 88, image: "machinery-20x08-02"},
            { x: 1086, y:  0, image: "machinery-top-20x08-01"},
            { x: 1106, y: 88, image: "machinery-20x08-01"},
            { x: 1106, y:  0, image: "machinery-top-20x08-02"},
            { x: 1126, y: 80, image: "machinery-20x16-01"},
            { x: 1146, y: 72, image: "machinery-20x24-01"},
            { x: 1146, y:  0, image: "machinery-top-20x24-01"},
            { x: 1166, y: 88, image: "machinery-20x08-01"},
            { x: 1166, y:  0, image: "machinery-top-20x08-01"},
            { x: 1186, y: 59, image: "machinery-hands-60x37"},
            { x: 1186, y:  0, image: "machinery-hands-top-60x37"},
            { x: 1246, y: 88, image: "machinery-20x08-01"},
            { x: 1246, y:  0, image: "machinery-top-20x08-01"},
            { x: 1266, y: 88, image: "machinery-20x08-01"},
            { x: 1266, y:  0, image: "machinery-top-20x08-01"},
            { x: 1286, y: 80, image: "machinery-20x16-01"},
            { x: 1286, y:  0, image: "machinery-top-20x16-01"},
            { x: 1306, y: 88, image: "machinery-20x08-02"},
            { x: 1306, y:  0, image: "machinery-top-20x08-02"},
            { x: 1326, y: 88, image: "machinery-20x08-01"},
            { x: 1326, y:  0, image: "machinery-top-20x08-03"},
            { x: 1346, y: 88, image: "machinery-20x08-02"},
            { x: 1346, y:  0, image: "machinery-top-20x08-02"},
            { x: 1366, y: 88, image: "machinery-20x08-01"},
            { x: 1366, y:  0, image: "machinery-top-20x08-01"},
            { x: 1386, y: 80, image: "machinery-20x16-01"},
            { x: 1386, y:  0, image: "machinery-top-20x16-01"},
            { x: 1406, y: 72, image: "machinery-20x24-01"},
            { x: 1406, y:  0, image: "machinery-top-20x24-01"},
            { x: 1426, y: 88, image: "machinery-20x08-01"},
            { x: 1426, y:  0, image: "machinery-top-20x08-01"},
            { x: 1446, y: 88, image: "machinery-20x08-03"},
            { x: 1446, y:  0, image: "machinery-top-20x08-02"},
            { x: 1466, y: 88, image: "machinery-20x08-01"},
            { x: 1466, y:  0, image: "machinery-top-20x08-03"},
            { x: 1486, y: 88, image: "machinery-20x08-02"},
            { x: 1486, y:  0, image: "machinery-top-20x08-01"},
            { x: 1506, y: 88, image: "machinery-20x08-03"},
            { x: 1506, y:  0, image: "machinery-top-20x08-03"}
        ],
        width: 1526,
        aliens: [
            newRedFlat(130, 20),
            newRedFlat(145, 25),
            newRedFlat(160, 15),
            newRedFlat(175, 25),
            newRedFlat(210, 50),
            newRedFlat(225, 55),
            newRedFlat(240, 45),
            newRedFlat(255, 55),
            newYellowLine(280, 25, -100),
            newYellowLine(287, 25, -100),
            newYellowLine(294, 25, -100),
            newYellowLine(301, 25, -100),
            newYellowLine(308, 25, -100),
            newYellowLine(315, 25, -100),
            newTracks(
                320,
                62,
                [
                    [38, MOVE_L],
                    [25, STOP_R],
                    [79, MOVE_R],
                    [25, STOP_L],
                    [40, MOVE_R]
                ]
            ),
            newTracks(
                325,
                62,
                [
                    [38, STOP_R],
                    [25, MOVE_R],
                    [79, STOP_L],
                    [25, MOVE_L],
                    [40, MOVE_R]
                ]
            ),
            newTokenCarrier(330, 20, [[100, MOVE_D], [100, MOVE_U]]),
            newRedFlat(335, 45),
            newRedFlat(350, 55),
            newRocketPack(
                430,
                20,
                [
                    [60, [0, 0.025]],
                    [30, [0.3, 0.6]],
                    [30, [0.7, -0.3]],
                    [30, [0.7, -0.3]]
                ],
                [60, 120, 180, 240, 300, 360, 420, 480, 540]
            ),
            newRedFlat(435, 30),
            newRedFlat(450, 35),
            newRedFlat(465, 25),
            newRedFlat(480, 35),
            newRedFlat(500, 60),
            newRedFlat(510, 65),
            newRedFlat(525, 55),
            newRedFlat(540, 65),
            newYellowLine(541, 25, -100),
            newYellowLine(548, 25, -100),
            newYellowLine(555, 25, -100),
            newRedFlat(580, 20),
            newRedFlat(595, 65),
            newRedFlat(610, 35),
            newRedFlat(625, 45),
            newYellowLine(630, 25, -100),
            newYellowLine(637, 25, -100),
            newYellowLine(644, 25, -100),
            newYellowLine(651, 25, -100),
            newYellowLine(658, 25, -100),
            newYellowLine(665, 25, -100),
            newRedFlat(640, 60),
            newRedFlat(655, 15),
            newRedFlat(670, 55),
            newRedFlat(685, 35),
            newTracks(
                670,
                62,
                [
                    [50, MOVE_L],
                    [25, STOP_R],
                    [40, MOVE_R],
                    [25, STOP_L],
                    [40, MOVE_L]
                ]
            ),
            newTracks(
                701,
                -30,
                [
                    [38, STOP_L],
                    [46, FALL_L],
                    [19, STOP_L],
                    [19, STOP_R],
                    [ 9, MOVE_R],
                    [20, STOP_L],
                    [ 9, MOVE_L],
                    [20, STOP_R],
                    [ 9, MOVE_R]
                ]
            ),
            newFork(780, 20, [[70, DL], [70, DR], [70, UR], [70, UL]]),
            newFork(785, 40, [[60, DL], [60, DR], [60, UR], [60, UL]]),
            newFork(790,  5, [[70, DL], [70, DR], [70, UR], [70, UL]]),
            newFork(800, 60, [[70, UL], [70, UR], [70, DR], [70, DL]]),
            newFork(805, 10, [[70, DL], [70, DR], [70, UR], [70, UL]]),
            newFork(810, 30, [[70, DL], [70, DR], [70, UR], [70, UL]]),
            newFork(820, 15, [[70, DL], [70, DR], [70, UR], [70, UL]]),
            newFork(825, 55, [[40, UL], [40, UR], [40, DR], [40, DL]]),
            newGunTop(826, 16),
            newGunBottom(826, 72),
            newGunTop(835, 16),
            newGunBottom(835, 72),
            newFork(830, 20, [[40, DL], [40, DR], [40, UR], [40, UL]]),
            newFork(840, 40, [[30, DL], [30, DR], [30, UR], [30, UL]]),
            newFork(845, 35, [[20, DL], [20, DR], [20, UR], [20, UL]]),
            newGunTop(846, 24),
            newGunBottom(846, 64),
            newFork(850, 25, [[30, DL], [30, DR], [30, UR], [30, UL]]),
            newGunTop(855, 24),
            newGunBottom(855, 64),
            newTokenCarrier(
                856,
                30,
                [[100, MOVE_D], [100, MOVE_U], [100, MOVE_D], [100, MOVE_U]]
            ),
            newFork(860, 20, [[20, DL], [20, DR], [20, UR], [20, UL]]),
            newFork(865, 30, [[20, DL], [20, DR], [20, UR], [20, UL]]),
            newFork(870, 20, [[50, DL], [50, DR], [50, UR], [50, UL]]),
            newFork(880, 50, [[50, UL], [50, UR], [50, DR], [50, DL]]),
            newVerticalRocket(
                895,
                75,
                [[27, MOVE_L], [80, STOP_L], [42, MOVE_R], [80, STOP_L]]
            ),
            newYellowCirc(900, 863, 0, 45, 260),
            newYellowCirc(900, 863, 0, 45, 280),
            newYellowCirc(900, 863, 0, 45, 300),
            newYellowCirc(900, 863, 0, 45, 320),
            newYellowCirc(900, 863, 0, 45, 340),
            newGunTop(926, 8),
            newGunTop(935, 8),
            newCircleGun(940, 969, 41, 30,  60),
            newCircleGun(940, 969, 41, 30,  90),
            newCircleGun(940, 969, 41, 30, 120),
            newCircleGun(940, 969, 41, 30, 150),
            newCircleOuchy(940, 969, 41, 30, 180),
            newCircleGun(940, 969, 41, 30, 210),
            newCircleGun(940, 969, 41, 30, 240),
            newCircleGun(940, 969, 41, 30, 270),
            newCircleGun(940, 969, 41, 30, 300),
            newCircleGun(940, 969, 41, 30, 330),
            newGunTop(1046, 16),
            newGunTop(1055, 16),
            newTracks(
                1050,
                46,
                [
                    [50, STOP_L],
                    [22, MOVE_L],
                    [ 8, FALL_L],
                    [19, STOP_L],
                    [21, MOVE_L],
                    [10, STOP_R],
                    [21, MOVE_R],
                    [99, STOP_R]
                ]
            ),
            newGunTop(1066, 8),
            newGunTop(1075, 8),
            newGunTop(1086, 8),
            newRedFlat(1090, 50),
            newGunTop(1095, 8),
            newVerticalRocket(
                1095,
                75,
                [[27, MOVE_L], [80, STOP_L], [42, MOVE_R], [80, STOP_L]]
            ),
            newTokenCarrier(
                1100,
                30,
                [[100, MOVE_D], [100, MOVE_U], [100, MOVE_D], [100, MOVE_U]]
            ),
            newRedFlat(1105, 60),
            newGunTop(1106, 8),
            newGunTop(1115, 8),
            newYellowCirc(1120, 1083, 0, 45, 260),
            newYellowCirc(1120, 1083, 0, 45, 280),
            newYellowCirc(1120, 1083, 0, 45, 300),
            newYellowCirc(1120, 1083, 0, 45, 320),
            newYellowCirc(1120, 1083, 0, 45, 340),
            newRedFlat(1120, 55),
            newRedFlat(1135, 25),
            newGunTop(1146, 24),
            newGunBottom(1146, 64),
            newGunTop(1155, 24),
            newGunBottom(1155, 64),
            newTokenCarrier(1190, 40, []),
            newGunTop(1246, 8),
            newGunTop(1255, 8),
            newGunTop(1266, 8),
            newGunTop(1275, 8),
            newRocketPack(
                1270,
                30,
                [
                    [60, [0, 0.025]],
                    [30, [0.3, 0.6]],
                    [30, [0.7, -0.3]],
                    [30, [0.7, -0.3]],
                    [60, [0, 0.1]],
                    [200, [-0.2, 0]]
                ],
                [60, 120, 180, 240, 300, 360, 420, 480, 540]
            ),
            newRocketPack(
                1330,
                25,
                [
                    [60, [0, 0.025]],
                    [30, [0.3, 0.6]],
                    [30, [0.7, -0.3]],
                    [30, [0.7, -0.3]],
                    [60, [0, 0.1]],
                    [200, [-0.2, 0]]
                ],
                [60, 120, 180, 240, 300, 360, 420, 480, 540]
            ),
            boss1parts.body,
            boss1parts.ouchy,
            ...boss1parts.tail
        ]
    }
];

// Maybe should be in Smolpxl:

function images_overlap(image1, x1, y1, image2, x2, y2) {
    const rx1 = Math.round(x1);
    const ry1 = Math.round(y1);
    const rx2 = Math.round(x2);
    const ry2 = Math.round(y2);
    const width1 = image_width(image1);
    const width2 = image_width(image2);
    const height1 = image_height(image1);
    const height2 = image_height(image2);

    if (
        rx1 + width1 < rx2 ||
        rx2 + width2 < rx1 ||
        ry1 + height1 < ry2 ||
        ry2 + height2 < ry1
    ) {
        return false;
    }

    const startx = Math.max(rx1, rx2);
    const starty = Math.max(ry1, ry2);
    const endx = Math.min(rx1 + width1, rx2 + width2);
    const endy = Math.min(ry1 + height1, ry2 + height2);

    const pixels1 = image1.pixels;
    const pixels2 = image2.pixels;

    for (let x = startx; x < endx; x++) {
        for (let y = starty; y < endy; y++) {
            const ch1 = pixels1[y - ry1][x - rx1];
            const ch2 = pixels2[y - ry2][x - rx2];
            if (ch1 !== '.' && ch2 !== '.') {
                return true;
            }
        }
    }
    return false;
}

function hits_image(image, x, y, pixel_x, pixel_y) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    const rpx = Math.round(pixel_x);
    const rpy = Math.round(pixel_y);
    const relx = rpx - rx;
    const rely = rpy - ry;

    const width = image_width(image);
    const height = image_height(image);
    if (
        relx >= 0 &&
        relx < width &&
        rely >= 0 &&
        rely < height
    ) {
        return (image.pixels[rely][relx] !== '.');
    } else {
        return false;
    }
}


// Model

function new10Stars(list, speed) {
    for (let i = 0; i < 10; i++) {
        list.push([
            speed,
            Smolpxl.randomInt(0, WIDTH - 1),
            Smolpxl.randomInt(0, HEIGHT - 1)
        ]);
    }
}

function newStars() {
    let ret = [];
    new10Stars(ret, 0.05);
    new10Stars(ret, 0.125);
    new10Stars(ret, 0.25);
    return ret;
}

function find_alien(model, name) {
    return model.aliens.find(alien => alien.name === name);
}

function newShip(x, lives, upgrades) {
    return {
        x: x + 20,
        y: (HEIGHT / 2) - (IMAGES["ship"].pixels.length / 2),
        dead: false,  // true, false, or a number while dying
        deadTime: 0,
        phaser: 0,
        bullets: [],
        diagonals: {
            delay: 0,
            shots: []
        },
        lives: lives,
        upgrades: upgrades
    };
}

function newKeys() {
    return {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false,
        FIRE: false
    };
}

function newModel() {
    const ret = {
        screen: {},
        stars: newStars(),
        level: 0,
        highScore: 0,
        score: 0
    };
    resetModel(ret, 0, 3, "");
    return ret;
}

function resetModel(model, x, lives, upgrades) {
    model.screen.x = x;
    model.ship = newShip(x, lives, upgrades);
    model.aliens = [];
    model.bullets = [];
    model.tokens = [];
    model.keys = newKeys();
    model.won = false;
}

// Update

function updateInput(runningGame, model) {
    for (const input of runningGame.input()) {
        if (input.name === "UP") {
            model.keys.UP = true;
        } else if (input.name === "RELEASE_UP") {
            model.keys.UP = false;
        } else if (input.name === "DOWN") {
            model.keys.DOWN = true;
        } else if (input.name === "RELEASE_DOWN") {
            model.keys.DOWN = false;
        } else if (input.name === "LEFT") {
            model.keys.LEFT = true;
        } else if (input.name === "RELEASE_LEFT") {
            model.keys.LEFT = false;
        } else if (input.name === "RIGHT") {
            model.keys.RIGHT = true;
        } else if (input.name === "RELEASE_RIGHT") {
            model.keys.RIGHT = false;
        } else if (input.name === "BUTTON1" || input.name === "LEFT_CLICK") {
            model.keys.FIRE = true;
        } else if (
            input.name === "RELEASE_BUTTON1" ||
            input.name === "RELEASE_LEFT_CLICK"
        ) {
            model.keys.FIRE = false;
        }
    }
}

function updatePhaser(model) {
    if (model.keys.FIRE) {
        model.ship.phaser += 2;
        if (model.ship.phaser > 100) {
            model.ship.phaser = 100;
        }
    } else {
        if (model.ship.phaser > 0) {
            const size = Math.floor(model.ship.phaser / 25);
            const offset = size > 3 ? 0 : 1;
            model.ship.bullets.push({
                x: model.ship.x + 11,
                y: model.ship.y + offset,
                size: size,
                dead: false
            });
            model.score -= 1;
            if (model.score < 0) {
                model.score = 0;
            }

            if (
                model.ship.upgrades === "diagonal"
                && model.ship.diagonals.delay <= 0
            ) {
                addDiagonals(model);
            }
        }
        model.ship.phaser = 0;
    }
}


function hitsScenery(x, y, model) {
    const level = LEVELS[model.level];
    for (const scenery of level.scenery) {
        const image = IMAGES[scenery.image]
        if (hits_image(image, scenery.x, scenery.y, x, y)) {
            return true;
        }
    }
    return false;
}

function hitsRockAlien(x, y, model) {
    for (const alien of model.aliens) {
        if (alien.collide === ALIEN_COLLIDERS.rock.name) {
            const alien_image = IMAGES[alien.image];
            if (hits_image(alien_image, alien.x, alien.y, x, y)) {
                return true;
            }
        }
    }
    return false;
}

function updateDiagonals(model) {
    const diagonals = model.ship.diagonals;
    if (diagonals.delay > 0) {
        diagonals.delay--;
    }
    for (const shot of diagonals.shots) {
        shot.age++;
        if (shot.age > 100) {
            shot.dead = true;
        }
        for (let i = 0; i < 3; i++) {
            if (!shot.dead) {
                let bounce = NO_BOUNCE;

                let next_x = shot.x + shot.vx;
                let next_y = shot.y + shot.vy;
                if (hitsScenery(next_x, next_y, model)) {
                    if (
                        !hitsScenery(next_x + shot.vy, next_y - shot.vy, model)
                    ) {
                        bounce = BOUNCE_VERTICAL;
                    } else {
                        bounce = BOUNCE_HORIZONTAL;
                    }
                } else if (hitsRockAlien(next_x, next_y, model)) {
                    if (
                        !hitsRockAlien(
                            next_x + shot.vy, next_y - shot.vy, model)
                    ) {
                        bounce = BOUNCE_VERTICAL;
                    } else {
                        bounce = BOUNCE_HORIZONTAL;
                    }
                }

                if (bounce === BOUNCE_VERTICAL) {
                    shot.vy = -shot.vy;
                    next_y = shot.y + shot.vy;
                } else if (bounce === BOUNCE_HORIZONTAL) {
                    shot.vx = -shot.vx;
                    next_x = shot.x + shot.vx;
                }

                shot.x = next_x;
                shot.y = next_y;
                shot.pixels.push([next_x, next_y]);
                if (
                    shot.x < model.screen.x
                    || shot.y < 0
                    || shot.x > model.screen.x + WIDTH
                    || shot.y > HEIGHT
                ) {
                    shot.dead = true;
                }
            }
            shot.pixels.shift();
        }
    }
    diagonals.shots = diagonals.shots.filter(
        shot => !(shot.dead && shot.pixels.length === 0));
}

function addDiagonals(model) {
    const diagonals = model.ship.diagonals;
    diagonals.delay = 20;
    const x = model.ship.x + 13;
    const y = model.ship.y + 3;
    diagonals.shots.push(
        {
            x: x,
            y: y,
            vx: 1,
            vy: 1,
            pixels: Array(10).fill(0).map(_ => [x, y]),
            dead: false,
            age: 0
        }
    );
    diagonals.shots.push(
        {
            x: x,
            y: y,
            vx: 1,
            vy: -1,
            pixels: Array(10).fill(0).map(_ => [x, y]),
            dead: false,
            age: 0
        }
    );
}

function updateShipBullets(model) {
    const level = LEVELS[model.level];
    for (const bullet of model.ship.bullets) {
        bullet.x += 10;
        if (bullet.x > model.screen.x + WIDTH + 30) {
            bullet.dead = true;
        } else {
            const bullet_image = PHASER_IMAGES[bullet.size];
            for (const scenery of level.scenery) {
                const image = IMAGES[scenery.image]
                if (
                    images_overlap(
                        image,
                        scenery.x,
                        scenery.y,
                        bullet_image,
                        bullet.x,
                        bullet.y
                    )
                ) {
                    bullet.dead = true;
                }
            }
        }
    }
    model.ship.bullets = model.ship.bullets.filter(
        bullet => bullet.dead !== true);
}

function updateMoveShip(model) {
    const rel_x = model.ship.x - model.screen.x;

    if (model.keys.UP && model.ship.y > 0) {
        model.ship.y -= 1;
    }
    if (model.keys.DOWN && model.ship.y + SHIP_HEIGHT < HEIGHT) {
        model.ship.y += 1;
    }
    if (model.keys.LEFT && rel_x > 0) {
        model.ship.x -= 1;
    }
    if ( model.keys.RIGHT && rel_x + SHIP_WIDTH < WIDTH) {
        model.ship.x += 1;
    }
}

function updateTokens(model) {
    const token_image = IMAGES["token-blue"];
    const ship_image = IMAGES["ship"];
    const ship_x = model.ship.x;
    const ship_y = model.ship.y;
    if (model.ship.dead === false) {
        for (const token of model.tokens) {
            if (
                images_overlap(
                    ship_image,
                    ship_x,
                    ship_y,
                    token_image,
                    token[0],
                    token[1]
                )
            ) {
                token.dead = true;
                if (model.ship.upgrades === "diagonal") {
                    model.ship.lives++;
                } else if (model.ship.upgrades === "nose-attach") {
                    model.ship.upgrades = "diagonal";
                } else {
                    model.ship.upgrades = "nose-attach";
                }
            }
        }
    }
    model.tokens = model.tokens.filter(
        token => token.dead !== true);
}

function updateScroll(model) {
    const level = LEVELS[model.level];
    if (model.screen.x + WIDTH >= level.width || model.ship.dead === true) {
        return;
    }
    model.screen.x += SCROLL_SPEED;
    model.ship.x += SCROLL_SPEED;
}

function endGame(runningGame, model) {
    runningGame.endGame();
    resetModel(model, 0, 3, "");
    if (model.score > model.highScore) {
        model.highScore = model.score;
    }
    model.score = 0;
}

function updateWon(runningGame, model) {
    if (
        runningGame.receivedInput("SELECT") ||
        runningGame.receivedInput("LEFT_CLICK")
    ) {
        endGame(runningGame, model);
    }
}

function updateDyingShip(runningGame, model) {
    if (model.ship.dead !== false && model.ship.dead !== true) {
        model.ship.dead += 0.5;
        if (model.ship.dead > 5) {
            model.ship.dead = true;
            model.ship.deadTime = 0;
            model.ship.lives--;
            runningGame.stopRecordingReplay();
            runningGame.startPlayingGameOverReplay();
        }
    }
    if (model.ship.dead === true) {
        if (model.ship.deadTime <= PAUSE_BEFORE_DEATH_REPLAY) {
            model.ship.deadTime++;
        }
        if (
            runningGame.receivedInput("SELECT") ||
            runningGame.receivedInput("LEFT_CLICK")
        ) {
            if (model.ship.lives < 1) {
                endGame(runningGame, model);
            } else {
                runningGame.startRecordingReplay();
                let x = model.screen.x - 150;
                if (x < 0) {
                    x = 0;
                }
                let upgrades = "";
                if (model.ship.upgrades === "diagonal") {
                    upgrades = "nose-attach";
                }
                resetModel(model, x, model.ship.lives, upgrades);
            }
        }
    }
}

function updateCollideWithScenery(model) {
    const level = LEVELS[model.level];
    const ship_image = IMAGES["ship"];
    for (const scenery of level.scenery) {
        const image = IMAGES[scenery.image]
        if (
            images_overlap(
                image,
                scenery.x,
                scenery.y,
                ship_image,
                model.ship.x,
                model.ship.y
            )
        ) {
            model.ship.dead = 1;
        }
    }
}

function newAlien(alien_spec) {
    const alien = JSON.parse(JSON.stringify(alien_spec));
    delete alien.spawn_x;
    alien.dead = false; // true, false or a number while dying
    alien.bullet_countdown = Math.random();
    return alien;
}

function updateNewAliens(model) {
    const level = LEVELS[model.level];
    for (const alien_spec of level.aliens) {
        const d = model.screen.x + WIDTH - alien_spec.spawn_x;
        if (0 < d && d <= 0.5) {
            model.aliens.push(newAlien(alien_spec));
        }
    }
}

function updateAliens(model) {
    let previous_alien = null;
    for (const alien of model.aliens) {
        const fn = ALIEN_UPDATERS[alien.update];
        fn(model, alien, previous_alien);
        previous_alien = alien;
    }
}

function updateBullets(model) {
    for (const bullet of model.bullets) {
        bullet[0] += bullet[2];
        bullet[1] += bullet[3];
        if (
            bullet[0] < model.screen.x - 10
            || bullet[0] > model.screen.x + WIDTH + 10
            || bullet[1] < -10
            || bullet[1] > HEIGHT + 10
        ) {
            bullet.dead = true;
        }
    }
}

function updateAlienCollisions(model) {
    for (const alien of model.aliens) {
        const fn = ALIEN_COLLIDERS[alien.collide];
        fn(model, alien);
    }
    model.aliens = model.aliens.filter(alien => alien.dead !== true);
}

function updateBulletCollisions(model) {
    const bullet_image = IMAGES["bullet"];
    const ship_image = IMAGES["ship"];
    const nose_attach_image = IMAGES["ship-nose-attach"];
    const ship_x = model.ship.x;
    const ship_y = model.ship.y;
    if (model.ship.dead === false) {
        for (const bullet of model.bullets) {
            if (
                model.ship.upgrades !== "" &&
                images_overlap(
                    nose_attach_image,
                    ship_x + 12,
                    ship_y,
                    bullet_image,
                    bullet[0],
                    bullet[1]
                )
            ) {
                bullet.dead = true;
            } else if (
                images_overlap(
                    ship_image,
                    ship_x,
                    ship_y,
                    bullet_image,
                    bullet[0],
                    bullet[1]
                )
            ) {
                bullet.dead = true;
                model.ship.dead = 1;
            }
        }
    }

    const level = LEVELS[model.level];
    for (const bullet of model.bullets) {
        for (const scenery of level.scenery) {
            const image = IMAGES[scenery.image]
            if (
                images_overlap(
                    image,
                    scenery.x,
                    scenery.y,
                    bullet_image,
                    bullet[0],
                    bullet[1]
                )
            ) {
                bullet.dead = true;
            }
        }
    }
    model.bullets = model.bullets.filter(bullet => bullet.dead !== true);
}

function update(runningGame, model) {
    if (model.won) {
        updateWon(runningGame, model);
    } else {
        updateDyingShip(runningGame, model);
        updateScroll(model);
        updateNewAliens(model);
        updateAliens(model);
        updateBullets(model);
        updateShipBullets(model);
        updateDiagonals(model);
        if (model.ship.dead === false) {
            updateInput(runningGame, model);
            updatePhaser(model);
            updateMoveShip(model);
            updateTokens(model);
            updateCollideWithScenery(model);
        }
        updateAlienCollisions(model);
        updateBulletCollisions(model);
        if (model.won) {
            runningGame.startPlayingFullReplay();
        }
    }
    return model;
}

// View

function starColor(speed) {
    return [300 * speed, 300 * speed, 500 * speed];
}

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function viewStars(screen, model) {
    for (const [speed, x, y] of model.stars) {
        screen.set(
            modulo((x - model.screen.x * speed), WIDTH),
            y,
            starColor(speed)
        );
    }
}

function viewShip(screen, model) {
    if (model.ship.dead === false) {
        const ship_image = IMAGES["ship"];
        screen.draw(
            Math.floor(model.ship.x - model.screen.x),
            model.ship.y,
            ship_image.pixels,
            ship_image.key
        );
        if (model.ship.upgrades !== "") {
            const attach_image = IMAGES["ship-nose-attach"];
            screen.draw(
                Math.floor(model.ship.x + 12 - model.screen.x),
                model.ship.y,
                attach_image.pixels,
                attach_image.key
            );
        }
    } else if (model.ship.dead !== true) {
        const ship_image = IMAGES[`ship-death-0${Math.round(model.ship.dead)}`];
        screen.draw(
            Math.floor(model.ship.x - model.screen.x) - 2,
            model.ship.y - 2,
            ship_image.pixels,
            ship_image.key
        );
    }
}

function viewShipBullets(screen, model) {
    for (const bullet of model.ship.bullets) {
        const bullet_image = PHASER_IMAGES[bullet.size];
        screen.draw(
            Math.floor(bullet.x - model.screen.x),
            bullet.y,
            bullet_image.pixels,
            bullet_image.key
        );
    }
    for (const diagonal of model.ship.diagonals.shots) {
        for (const pixel of diagonal.pixels) {
            screen.set(pixel[0] - model.screen.x, pixel[1], [0, 0, 255]);
        }
    }
}

function viewTokens(screen, model) {
    for (const token of model.tokens) {
        const token_image = IMAGES["token-blue"];
        screen.draw(
            Math.floor(token[0] - model.screen.x),
            token[1],
            token_image.pixels,
            token_image.key
        );
    }
}

function viewAliens(screen, model) {
    for (const alien of model.aliens) {
        if (alien.dead === false) {
            const alien_image = IMAGES[alien.image];
            const key = (
                (alien.damage && (alien.damage % 2 == 1))
                ? WHITE_KEY
                : alien_image.key
            );
            screen.draw(
                Math.floor(alien.x - model.screen.x),
                alien.y,
                alien_image.pixels,
                key
            );
        } else if (alien.dead !== true) {
            const image = IMAGES[`alien-death-0${Math.round(alien.dead)}`];
            screen.draw(
                Math.floor(alien.x) - Math.floor(model.screen.x) - 1,
                alien.y - 1,
                image.pixels,
                image.key
            );
        }
    }
}

function viewBullets(screen, model) {
    const image = IMAGES["bullet"];
    for (const bullet of model.bullets) {
        screen.draw(
            Math.floor(bullet[0] - model.screen.x),
            Math.floor(bullet[1]),
            image.pixels,
            image.key
        );
    }
}

function viewScenery(screen, model) {
    const level = LEVELS[model.level];
    for (const scenery of level.scenery) {
        const relx = Math.floor(scenery.x - model.screen.x);
        if (relx > WIDTH) {
            break;  // Assuming scenery is sorted, we are done
        }
        const image = IMAGES[scenery.image]
        if (relx + image_width(image) >= 0) {
            screen.draw(
                relx,
                scenery.y,
                image.pixels,
                image.key
            );
        }
    }
}

function viewBottomBar(screen, model) {
    const life_image = IMAGES["life"];
    const life_width = image_width(life_image);
    screen.rect(0, HEIGHT, WIDTH, BOTTOM_BAR_HEIGHT, Smolpxl.colors.BLACK);
    const gap = Math.floor(Math.min(50 / model.ship.lives, 10));
    for (let i = 0; i < model.ship.lives; ++i) {
        const x = 1 + i * gap;
        screen.draw(x, HEIGHT, life_image.pixels, life_image.key);
        if (x + life_width > 49) {
            screen.rect(
                49, HEIGHT, 10, BOTTOM_BAR_HEIGHT, Smolpxl.colors.BLACK);
        }
    }
    const phaser_len = 45;
    screen.rect(51, HEIGHT, phaser_len + 2, 1, PHASER_OUTLINE_COL);
    screen.rect(
        51,
        HEIGHT + BOTTOM_BAR_HEIGHT - 1,
        phaser_len + 2,
        1,
        PHASER_OUTLINE_COL
    );
    screen.rect(50, HEIGHT + 1, 2, 2, PHASER_OUTLINE_COL);
    screen.rect(51 + phaser_len + 1, HEIGHT + 1, 2, 2, PHASER_OUTLINE_COL);

    if (model.ship.phaser > 0) {
        const len = Math.round(45 * model.ship.phaser / 100);
        screen.rect(52, HEIGHT + 1, len, 1, PHASER_TOP_COL);
        screen.rect(52, HEIGHT + 2, len - 1, 1, PHASER_BOTTOM_COL);
        screen.set(
            52 + Math.min(len, phaser_len - 1), HEIGHT + 1, PHASER_END_COL);
        if (len > 0) {
            screen.set(52 + len - 1, HEIGHT + 2, PHASER_END_COL);
        }
    }
}

function viewWonOverlay(screen, model) {
    const newHigh = ((model.score > model.highScore) ?
       ["New High Score!"] : []);

    screen.message([
        "",
        "Well done, you won!",
        `Score: ${model.score}`,
        ...newHigh,
        "",
        "Now try firing as few shots as possible.",
        "",
        "<SELECT> to continue",
        ""
    ]);
    screen.dim();
}

function viewDeadOverlay(screen, model) {
    const newHigh = ((model.score > model.highScore) ?
       ["New High Score!"] : []);

    if (model.ship.lives < 1) {
        screen.message([
            "",
            "Game over!",
            `Score: ${model.score}`,
            ...newHigh,
            "",
            "Well played.",
            "",
            "<SELECT> to continue",
            ""
        ]);
    } else {
        screen.message([
            "",
            "Ship lost!",
            "",
            "<SELECT> to continue",
            ""
        ]);
    }
    screen.dim();
}

function viewWon(screen, model) {
    viewAlive(screen, screen.playbackFrame());
    viewWonOverlay(screen, model);
}

function viewDead(screen, model) {
    let m = model;
    if (model.ship.deadTime > PAUSE_BEFORE_DEATH_REPLAY) {
        m = screen.playbackFrame();
        if (!m) {
            m = model;
        }
    }
    viewAlive(screen, m);
    viewDeadOverlay(screen, model);
}

function viewAlive(screen, model) {
    viewStars(screen, model);
    viewScenery(screen, model);
    viewBullets(screen, model);
    viewTokens(screen, model);
    viewAliens(screen, model);
    viewShipBullets(screen, model);
    viewShip(screen, model);
    viewBottomBar(screen, model);
}

function view(screen, model, realModel) {
    // During a replay, model will be the moment of the replay we
    // should show, and realModel will be the actual current model
    // containing e.g. high scores.
    // If we're not within a replay, realModel will be empty.
    if (!realModel) {
        realModel = model;
    }

    if (model.won) {
        viewWon(screen, model);
    } else if (model.ship.dead === true) {
        viewDead(screen, model);
    } else {
        viewAlive(screen, model);
    }
    screen.messageTopLeft(`Score: ${realModel.score}`);
    screen.messageTopRight(`High: ${realModel.highScore}`);
}

// Game

const game = new Smolpxl.Game();
game.setBorderColor([15, 15, 15]);
game.sendPopularityStats();
game.setFps(FPS);
game.showSmolpxlBar();
game.showControlsLeft(["MENU", "SELECT"]);
game.showControlsMiddle(["ARROWS"]);
game.showControlsRight([{control: "BUTTON1", name: "Fire"}]);
game.setSourceCodeUrl("https://gitlab.com/smolpxl/rightwaves");
game.setSize(WIDTH, HEIGHT + BOTTOM_BAR_HEIGHT);
game.setTitle("Rightwaves");
game.enableReplays(defaultReplay());

game.start("rightwaves", newModel(), view, update);
