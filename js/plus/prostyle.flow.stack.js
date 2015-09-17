/*!
 * VERSION: 1.1.0
 * DATE: 17-Sep-2015
 * UPDATES AND DOCS AT: https://prostyle.io/plus/
 * 
 * This file is part of ProStyle Plus, a set of premium extensions for ProStyle.
 * 
 * @copyright - Copyright (c) 2013-2015, Pro Graphics, Inc. All rights reserved. 
 * @license - This work is subject to the terms at https://prostyle.io/plus/
 * @author: Gary Chamberlain, gary@pro.graphics.
 * 
 **/

/// <reference path="../../../ts/prostyle.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Flows;
        (function (Flows) {
            var Stack;
            (function (Stack) {
                var Models = ProStyle.Models;
                var StackFlowModel = (function (_super) {
                    __extends(StackFlowModel, _super);
                    function StackFlowModel(story, placement, overriddenPageClass, pageAspectRatio, stacks) {
                        _super.call(this, story, "stack", placement, overriddenPageClass, pageAspectRatio, "stackedpage");
                        this.overriddenPageClass = overriddenPageClass;
                        this.stacks = stacks;
                    }
                    StackFlowModel.prototype.serialize = function () {
                        return Stack.serialize(this);
                    };
                    StackFlowModel.prototype.createView = function (camera, flowIndex) {
                        return new Stack.StackFlowView(this, camera, flowIndex);
                    };
                    StackFlowModel.defaultStacksJson = {
                        current: {
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: 100,
                            opacity: 100
                        },
                        future: {
                            position: [140, 0, -200],
                            rotation: [0, -10, 5],
                            scale: 100,
                            opacity: 80,
                            offset: {
                                position: [130, 80, -200],
                                rotation: [0, -5, 2],
                                scale: 100,
                                opacity: 50
                            }
                        },
                        past: {
                            position: [-140, 0, -200],
                            rotation: [0, 10, -5],
                            scale: 100,
                            opacity: 80,
                            offset: {
                                position: [-130, 80, -200],
                                rotation: [0, 5, -2],
                                scale: 100,
                                opacity: 50
                            }
                        }
                    };
                    return StackFlowModel;
                })(Models.Flows.PlacementFlowModel);
                Stack.StackFlowModel = StackFlowModel;
            })(Stack = Flows.Stack || (Flows.Stack = {}));
        })(Flows = Extensions.Flows || (Extensions.Flows = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="StackFlowModel.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Flows;
        (function (Flows) {
            var Stack;
            (function (Stack) {
                var Views = ProStyle.Views;
                var StackFlowView = (function (_super) {
                    __extends(StackFlowView, _super);
                    function StackFlowView(stackFlow, camera, flowIndex) {
                        _super.call(this, stackFlow, camera, flowIndex);
                        this.stackFlow = stackFlow;
                    }
                    StackFlowView.prototype.initializePages = function (timeline) {
                        var _this = this;
                        var pageSize = this.camera.size.getContainedSize(this.stackFlow.pageAspectRatio);
                        this.pages.forEach(function (pageElem, index) {
                            var css = {
                                width: pageSize.width,
                                height: pageSize.height,
                                perspective: 10000
                            };
                            timeline.set(_this.pages[index].div, css, "initialize");
                        });
                    };
                    StackFlowView.prototype.generatePageMovement = function (timeline, label, pageIndex) {
                        var current = this.stackFlow.stacks.current;
                        var future = this.stackFlow.stacks.future;
                        var futureOffset = this.stackFlow.stacks.futureOffset;
                        var past = this.stackFlow.stacks.past;
                        var pastOffset = this.stackFlow.stacks.pastOffset;
                        var pageSize = this.camera.size.getContainedSize(this.stackFlow.pageAspectRatio);
                        var css = current.renderCss(pageSize);
                        this.applyCss(timeline, this.pages[pageIndex].div, label, 1, css, Expo.easeOut);
                        past = past.duplicate();
                        for (var i = pageIndex - 1; i >= 0; i--) {
                            css = past.renderCss(pageSize);
                            this.applyCss(timeline, this.pages[i].div, label, 1, css, Expo.easeOut);
                            past.adjust(pastOffset);
                        }
                        future = future.duplicate();
                        for (var i = pageIndex + 1; i < this.pages.length; i++) {
                            css = future.renderCss(pageSize);
                            this.applyCss(timeline, this.pages[i].div, label, 1, css, Expo.easeOut);
                            future.adjust(futureOffset);
                        }
                    };
                    StackFlowView.prototype.applyCss = function (timeline, div, label, duration, css, ease) {
                        if (label === "initialize") {
                            timeline.set(div, css, label);
                        }
                        else {
                            css.ease = ease;
                            timeline.to(div, duration, css, label);
                        }
                    };
                    return StackFlowView;
                })(Views.Flows.PlacementFlowView);
                Stack.StackFlowView = StackFlowView;
            })(Stack = Flows.Stack || (Flows.Stack = {}));
        })(Flows = Extensions.Flows || (Extensions.Flows = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var bs = 28;
        var bx2 = 1 << bs;
        var bm = bx2 - 1;
        var bx = bx2 >> 1;
        var bd = bs >> 1;
        var bdm = (1 << bd) - 1;
        var log2 = Math.log(2);
        var a;
        var b;
        function badd(a, b) {
            var al = a.length, bl = b.length;
            if (al < bl)
                return badd(b, a);
            var c = 0, r = [], n = 0;
            for (; n < bl; n++) {
                c += a[n] + b[n];
                r[n] = c & bm;
                c >>>= bs;
            }
            for (; n < al; n++) {
                c += a[n];
                r[n] = c & bm;
                c >>>= bs;
            }
            if (c)
                r[n] = c;
            return r;
        }
        function beq(a, b) {
            if (a.length != b.length)
                return 0;
            for (var n = a.length - 1; n >= 0; n--)
                if (a[n] != b[n])
                    return 0;
            return 1;
        }
        function bsub(a, b) {
            var al = a.length, bl = b.length, c = 0, r = [];
            if (bl > al) {
                return [];
            }
            if (bl == al) {
                if (b[bl - 1] > a[bl - 1])
                    return [];
                if (bl == 1)
                    return [a[0] - b[0]];
            }
            for (var n = 0; n < bl; n++) {
                c += a[n] - b[n];
                r[n] = c & bm;
                c >>= bs;
            }
            for (; n < al; n++) {
                c += a[n];
                r[n] = c & bm;
                c >>= bs;
            }
            if (c) {
                return [];
            }
            if (r[n - 1])
                return r;
            while (n > 1 && r[n - 1] == 0)
                n--;
            return r.slice(0, n);
        }
        function bmul(a, b) {
            b = b.concat([0]);
            var al = a.length, bl = b.length, r = [], n, nn, aa, c, m;
            var g, gg, h, hh, ghhb;
            for (n = al + bl; n >= 0; n--)
                r[n] = 0;
            for (n = 0; n < al; n++) {
                if (aa = a[n]) {
                    c = 0;
                    hh = aa >> bd;
                    h = aa & bdm;
                    m = n;
                    for (nn = 0; nn < bl; nn++, m++) {
                        g = b[nn];
                        gg = g >> bd;
                        g = g & bdm;
                        var ghh = g * hh + h * gg;
                        ghhb = ghh >> bd;
                        ghh &= bdm;
                        c += r[m] + h * g + (ghh << bd);
                        r[m] = c & bm;
                        c = (c >> bs) + gg * hh + ghhb;
                    }
                }
            }
            n = r.length;
            if (r[n - 1])
                return r;
            while (n > 1 && r[n - 1] == 0)
                n--;
            return r.slice(0, n);
        }
        function blshift(a, b) {
            var n, c = 0, r = [];
            for (n = 0; n < a.length; n++) {
                c |= (a[n] << b);
                r[n] = c & bm;
                c >>= bs;
            }
            if (c)
                r[n] = c;
            return r;
        }
        function brshift(a) {
            var c = 0, n, cc, r = [];
            for (n = a.length - 1; n >= 0; n--) {
                cc = a[n];
                c <<= bs;
                r[n] = (cc | c) >> 1;
                c = cc & 1;
            }
            while (r.length > 1 && r[r.length - 1] == 0) {
                r = r.slice(0, -1);
            }
            this.a = r;
            this.c = c;
            return this;
        }
        function zeros(n) { var r = []; while (n-- > 0)
            r[n] = 0; return r; }
        function toppart(x, start, len) {
            var n = 0;
            while (start >= 0 && len-- > 0)
                n = n * bx2 + x[start--];
            return n;
        }
        function bdiv(x, y) {
            var n = x.length - 1, t = y.length - 1, nmt = n - t;
            if (n < t || n == t && (x[n] < y[n] || n > 0 && x[n] == y[n] && x[n - 1] < y[n - 1])) {
                this.q = [0];
                this.mod = x;
                return this;
            }
            if (n == t && toppart(x, t, 2) / toppart(y, t, 2) < 4) {
                var q = 0, xx;
                for (;;) {
                    xx = bsub(x, y);
                    if (xx.length == 0)
                        break;
                    x = xx;
                    q++;
                }
                this.q = [q];
                this.mod = x;
                return this;
            }
            var shift, shift2;
            shift2 = Math.floor(Math.log(y[t]) / log2) + 1;
            shift = bs - shift2;
            if (shift) {
                x = x.concat();
                y = y.concat();
                for (i = t; i > 0; i--)
                    y[i] = ((y[i] << shift) & bm) | (y[i - 1] >> shift2);
                y[0] = (y[0] << shift) & bm;
                if (x[n] & ((bm << shift2) & bm)) {
                    x[++n] = 0;
                    nmt++;
                }
                for (i = n; i > 0; i--)
                    x[i] = ((x[i] << shift) & bm) | (x[i - 1] >> shift2);
                x[0] = (x[0] << shift) & bm;
            }
            var i, j, x2, y2, q = zeros(nmt + 1);
            y2 = zeros(nmt).concat(y);
            for (;;) {
                x2 = bsub(x, y2);
                if (x2.length == 0)
                    break;
                q[nmt]++;
                x = x2;
            }
            var yt = y[t], top = toppart(y, t, 2);
            for (i = n; i > t; i--) {
                var m = i - t - 1;
                if (i >= x.length)
                    q[m] = 1;
                else if (x[i] == yt)
                    q[m] = bm;
                else
                    q[m] = Math.floor(toppart(x, i, 2) / yt);
                var topx = toppart(x, i, 3);
                while (q[m] * top > topx)
                    q[m]--;
                y2 = y2.slice(1);
                x2 = bsub(x, bmul([q[m]], y2));
                if (x2.length == 0) {
                    q[m]--;
                    x2 = bsub(x, bmul([q[m]], y2));
                }
                x = x2;
            }
            if (shift) {
                for (i = 0; i < x.length - 1; i++)
                    x[i] = (x[i] >> shift) | ((x[i + 1] << shift2) & bm);
                x[x.length - 1] >>= shift;
            }
            while (q.length > 1 && q[q.length - 1] == 0)
                q = q.slice(0, q.length - 1);
            while (x.length > 1 && x[x.length - 1] == 0)
                x = x.slice(0, x.length - 1);
            this.mod = x;
            this.q = q;
            return this;
        }
        function bmod(p, m) {
            if (m.length == 1) {
                if (p.length == 1)
                    return [p[0] % m[0]];
                if (m[0] < bdm)
                    return [simplemod(p, m[0])];
            }
            var r = bdiv(p, m);
            return r.mod;
        }
        function simplemod(i, m) {
            if (m > bdm)
                return bmod(i, [m]);
            var c = 0, v;
            for (var n = i.length - 1; n >= 0; n--) {
                v = i[n];
                c = ((v >> bd) + (c << bd)) % m;
                c = ((v & bdm) + (c << bd)) % m;
            }
            return c;
        }
        function bmodexp(xx, y, m) {
            var r = [1], n, an, a, x = xx.concat();
            var mu = [];
            n = m.length * 2;
            mu[n--] = 1;
            for (; n >= 0; n--)
                mu[n] = 0;
            mu = bdiv(mu, m).q;
            for (n = 0; n < y.length; n++) {
                for (a = 1, an = 0; an < bs; an++, a <<= 1) {
                    if (y[n] & a)
                        r = bmod2(bmul(r, x), m, mu);
                    x = bmod2(bmul(x, x), m, mu);
                }
            }
            return r;
        }
        function bmod2(x, m, mu) {
            var xl = x.length - (m.length << 1);
            if (xl > 0) {
                return bmod2(x.slice(0, xl).concat(bmod2(x.slice(xl), m, mu)), m, mu);
            }
            var ml1 = m.length + 1, ml2 = m.length - 1, rr;
            var q3 = bmul(x.slice(ml2), mu).slice(ml1);
            var r1 = x.slice(0, ml1);
            var r2 = bmul(q3, m).slice(0, ml1);
            var r = bsub(r1, r2);
            if (r.length == 0) {
                r1[ml1] = 1;
                r = bsub(r1, r2);
            }
            for (var n = 0;; n++) {
                rr = bsub(r, m);
                if (rr.length == 0)
                    break;
                r = rr;
                if (n >= 3)
                    return bmod2(r, m, mu);
            }
            return r;
        }
        function sub2(a, b) {
            var r = bsub(a, b);
            if (r.length == 0) {
                this.a = bsub(b, a);
                this.sign = 1;
            }
            else {
                this.a = r;
                this.sign = 0;
            }
            return this;
        }
        function signedsub(a, b) {
            if (a.sign) {
                if (b.sign) {
                    return sub2(b, a);
                }
                else {
                    this.a = badd(a, b);
                    this.sign = 1;
                }
            }
            else {
                if (b.sign) {
                    this.a = badd(a, b);
                    this.sign = 0;
                }
                else {
                    return sub2(a, b);
                }
            }
            return this;
        }
        function modinverse(x, n) {
            var y = n.concat(), t, r, bq, a = [1], b = [0], ts;
            a.sign = 0;
            b.sign = 0;
            while (y.length > 1 || y[0]) {
                t = y.concat();
                r = bdiv(x, y);
                y = r.mod;
                var q = r.q;
                x = t;
                t = b.concat();
                ts = b.sign;
                bq = bmul(b, q);
                bq.sign = b.sign;
                r = signedsub(a, bq);
                b = r.a;
                b.sign = r.sign;
                a = t;
                a.sign = ts;
            }
            if (beq(x, [1]) == 0)
                return [0];
            if (a.sign) {
                a = bsub(n, a);
            }
            return a;
        }
        function crt_RSA(m, d, p, q) {
            var xp = bmodexp(bmod(m, p), bmod(d, bsub(p, [1])), p);
            var xq = bmodexp(bmod(m, q), bmod(d, bsub(q, [1])), q);
            var t = bsub(xq, xp);
            if (t.length == 0) {
                t = bsub(xp, xq);
                t = bmod(bmul(t, modinverse(p, q)), q);
                t = bsub(q, t);
            }
            else {
                t = bmod(bmul(t, modinverse(p, q)), q);
            }
            return badd(bmul(t, p), xp);
        }
        function t2b(s) {
            var bits = s.length * 8, bn = 1, r = [0], rn = 0, sn = 0, sb = 1;
            var c = s.charCodeAt(0);
            for (var n = 0; n < bits; n++) {
                if (bn > bm) {
                    bn = 1;
                    r[++rn] = 0;
                }
                if (c & sb)
                    r[rn] |= bn;
                bn <<= 1;
                if ((sb <<= 1) > 255) {
                    sb = 1;
                    c = s.charCodeAt(++sn);
                }
            }
            return r;
        }
        function b2t(b) {
            var bits = b.length * bs, bn = 1, bc = 0, r = [0], rb = 1, rn = 0;
            for (var n = 0; n < bits; n++) {
                if (b[bc] & bn)
                    r[rn] |= rb;
                if ((rb <<= 1) > 255) {
                    rb = 1;
                    r[++rn] = 0;
                }
                if ((bn <<= 1) > bm) {
                    bn = 1;
                    bc++;
                }
            }
            while (r[rn] == 0) {
                rn--;
            }
            var rr = '';
            for (var n = 0; n <= rn; n++)
                rr += String.fromCharCode(r[n]);
            return rr;
        }
        var b64s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
        function textToBase64(t) {
            var r = '';
            var m = 0;
            var a = 0;
            var tl = t.length - 1;
            var c;
            for (var n = 0; n <= tl; n++) {
                c = t.charCodeAt(n);
                r += b64s.charAt((c << m | a) & 63);
                a = c >> (6 - m);
                m += 2;
                if (m == 6 || n == tl) {
                    r += b64s.charAt(a);
                    if ((n % 45) == 44) {
                        r += "\n";
                    }
                    m = 0;
                    a = 0;
                }
            }
            return r;
        }
        function base64ToText(t) {
            var r = '';
            var m = 0;
            var a = 0;
            var c;
            for (var n = 0; n < t.length; n++) {
                c = b64s.indexOf(t.charAt(n));
                if (c >= 0) {
                    if (m) {
                        r += String.fromCharCode((c << (8 - m)) & 255 | a);
                    }
                    a = c >> m;
                    m += 2;
                    if (m == 8) {
                        m = 0;
                    }
                }
            }
            return r;
        }
        function rc4(key, text) {
            var i, x, y, t, x2, kl = key.length;
            var s = [];
            for (i = 0; i < 256; i++)
                s[i] = i;
            y = 0;
            for (var j = 0; j < 2; j++) {
                for (x = 0; x < 256; x++) {
                    y = (key.charCodeAt(x % kl) + s[x] + y) % 256;
                    t = s[x];
                    s[x] = s[y];
                    s[y] = t;
                }
            }
            var z = "";
            for (x = 0; x < text.length; x++) {
                x2 = x & 255;
                y = (s[x2] + y) & 255;
                t = s[x2];
                s[x2] = s[y];
                s[y] = t;
                z += String.fromCharCode((text.charCodeAt(x) ^ s[(s[x2] + s[y]) % 256]));
            }
            return z;
        }
        function ror(a, n) { n &= 7; return n ? ((a >> n) | ((a << (8 - n)) & 255)) : a; }
        function hash(s, l) {
            var sl = s.length, r = [], rr = '', v = 1, lr = 4;
            for (var n = 0; n < l; n++)
                r[n] = (v = ((v * v * 5081 + n) & 255));
            while (sl--) {
                lr = r[sl % l] ^= ror(s.charCodeAt(sl), lr) ^ r[r[(sl * 5081) % l] % l];
            }
            for (var n = 0; n < l; n++)
                rr += String.fromCharCode(r[n] ^
                    ror(r[r[(n * 171) % l] % l], r[n]));
            return rr;
        }
        function rsaDecode(key, text) {
            text = base64ToText(text);
            var sessionKeyLength = text.charCodeAt(0);
            var sessionKeyEncryptedText = text.substr(1, sessionKeyLength);
            text = text.substr(sessionKeyLength + 1);
            var sessionKeyEncrypted = t2b(sessionKeyEncryptedText);
            var sessionkey = crt_RSA(sessionKeyEncrypted, key[0], key[1], key[2]);
            sessionkey = b2t(sessionkey);
            text = rc4(sessionkey, text);
            return text;
        }
        function c() {
            if (ProStyle["pl"])
                return;
            var hn = window.location.hostname.trim().toLowerCase();
            if (hn === '' || hn === 'localhost' || hn === '127.0.0.1')
                return;
            ProStyle["hn"] = hn;
            var plk = ProStyle["plusLicense"];
            if (plk === undefined) {
                ProStyle["pl"] = 2;
            }
            else {
                var k = [[239800443, 61606552, 84], [201280845, 11], [166507101, 13]];
                var pld = rsaDecode(k, plk);
                ProStyle["pld"] = pld;
                ProStyle["pl"] = pld === hn ? 1 : 3;
            }
        }
        Extensions.c = c;
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="StackFlowModel.ts" />
/// <reference path="../../l.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Flows;
        (function (Flows) {
            var Stack;
            (function (Stack) {
                var Util = ProStyle.Util;
                function deserialize(story, json) {
                    Extensions.c();
                    var placement = ProStyle.Types.Placement.fromJson(Util.getSetup(json, "placement"));
                    var pageAspectRatio = Util.convertToNumber(Util.getSetup(json, "pageAspectRatio"), 4 / 3);
                    var stacks = ProStyle.Types.Stacks.fromJson(Util.getSetup(json, "stacks") || Stack.StackFlowModel.defaultStacksJson);
                    return new Stack.StackFlowModel(story, placement, Util.getSetup(json, "pageClass"), pageAspectRatio, stacks);
                }
                Stack.deserialize = deserialize;
            })(Stack = Flows.Stack || (Flows.Stack = {}));
        })(Flows = Extensions.Flows || (Extensions.Flows = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
/// <reference path="../../../ts/prostyle.d.ts" />
/// <reference path="StackFlowModel.ts" />
var ProStyle;
(function (ProStyle) {
    var Extensions;
    (function (Extensions) {
        var Flows;
        (function (Flows) {
            var Stack;
            (function (Stack) {
                function serialize(model) {
                    //TODO: write the json configuration back out.
                    // Important,
                    //   don't write current page placement values if it is default
                    //   don't write future and past page placements and their offsets if they equal the defaults
                    var json = {};
                    json.setup = {};
                    if (model.overriddenPageClass !== undefined)
                        json.setup.pageClass = model.overriddenPageClass;
                    return json;
                }
                Stack.serialize = serialize;
            })(Stack = Flows.Stack || (Flows.Stack = {}));
        })(Flows = Extensions.Flows || (Extensions.Flows = {}));
    })(Extensions = ProStyle.Extensions || (ProStyle.Extensions = {}));
})(ProStyle || (ProStyle = {}));
//# sourceMappingURL=prostyle.flow.stack.js.map