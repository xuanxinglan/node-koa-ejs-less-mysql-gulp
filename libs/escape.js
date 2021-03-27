let REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

let REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;

let REGX_TRIM = /(^\s*)|(\s*$)/g;

let HTML_DECODE = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&nbsp;": " ",
    "&quot;": "\"",
    "&copy;": "©",
};

module.exports = {
    html_encode(s) {
        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_HTML_ENCODE,
                function ($0) {
                    var c = $0.charCodeAt(0), r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c);
                    r.push(";");
                    return r.join("");
                }).replace(/\?/g, "&#63;");


    },
    html_decode(s) {

        s = (s != undefined) ? s : this.toString();
        return (typeof s != "string") ? s :
            s.replace(REGX_HTML_DECODE,
                function ($0, $1) {
                    var c = HTML_DECODE[$0];
                    if (c == undefined) {
                        // Maybe is Entity Number
                        if (!isNaN($1)) {
                            c = String.fromCharCode(($1 == 160) ? 32 : $1);
                        } else {
                            c = $0;
                        }
                    }
                    return c;
                }).replace(/&#63;/g, "?");
    },



}
