/**
 * test stylesheet
 * note: font-size ios bug
 * @author yiminghe@gmail.com
 */

var $ = require('node');
var StyleSheet = require('stylesheet');
/*jshint quotmark:false*/
function filter(str) {
    var left = str.indexOf('{'), right = str.indexOf('}'),
        remain;

    if (left !== -1) {
        remain = str.slice(left + 1, right);
    } else {
        remain = str;
    }

    remain = remain.toLowerCase().replace(/\s/g, '')
        .split(/;/).sort().join(";")
        .replace(/rgb\(255,0,0\)/, "#ff0000")
        .replace(/rgb\(51,51,51\)/, "#333333")
        .replace(/rgb\(0,0,0\)/, "#000000");

    if (left !== -1) {
        remain = str.slice(0, left + 1) + remain + str.slice(right);
    }

    return remain;
}

describe("stylesheet", function () {
    it("works for link at same domain", function (done) {
        var n = $("<p class='test1'>test1</p>").appendTo('body');
        var n2 = $("<p class='test2'>test1</p>").appendTo('body');

        var style = require.load("/tests/browser/specs/test.css", function () {
            expect(n.css('height')).to.be("120px");

            var styleSheet = new StyleSheet(style);

            expect(filter(styleSheet.get())).to.be(filter(".test1 {color: #ff0000; " +
                "height: 120px;}"));
            expect(filter(styleSheet.get(".test1"))).to.be(filter("color: #ff0000; " +
                "height: 120px;"));

            // set
            styleSheet.set(".test1", {
                height: "200px"
            });

            expect(filter(styleSheet.get())).to.be(filter(".test1 {color: #ff0000;" +
                " height: 200px;}"));

            expect(n.css('height')).to.be("200px");

            // unset
            styleSheet.set(".test1", {
                height: ""
            });

            expect(filter(styleSheet.get())).to.be(filter(".test1 {color: #ff0000;}"));

            expect(n.css('height')).not.to.be("200px");

            expect(filter(n.css("color"))).to.be("#ff0000");

            // unset all
            styleSheet.set(".test1", {
                color: ""
            });

            expect(filter(styleSheet.get())).to.be(filter(""));

            expect(filter(n.css("color"))).to.be("#000000");

            // add
            styleSheet.set(".test2", {
                height: "120px"
            });

            expect(filter(styleSheet.get())).to.be(filter(".test2 {height: 120px;}"));

            expect(n2.css('height')).to.be("120px");

            // disable
            styleSheet.disable();
            expect(n2.css('height')).not.to.be("120px");

            // enable
            styleSheet.enable();
            expect(n2.css('height')).to.be("120px");

            n.remove();
            n2.remove();
            $(style).remove();
            done();
        });
    });

    it("works for inline style", function (done) {
        var n = $("<p class='test1'>test1</p>").appendTo('body');

        var n2 = $("<p class='test2'>test1</p>").appendTo('body');

        var style = $("<style>.test1 {" +
            "color:#ff0000;" +
            "height: 120px;" +
            "}</style>").appendTo('body')[0];

        (function () {

            expect(n.css('height')).to.be("120px");

            var styleSheet = new StyleSheet(style);

            expect(filter(styleSheet.get()))
                .to.be(filter(".test1 {color: #ff0000; height: 120px;}"));
            expect(filter(styleSheet.get(".test1")))
                .to.be(filter("color: #ff0000; height: 120px;"));

            // set
            styleSheet.set(".test1", {
                height: "200px"
            });

            expect(filter(styleSheet.get()))
                .to.be(filter(".test1 {color: #ff0000; height: 200px;}"));

            expect(n.css('height')).to.be("200px");

            // unset
            styleSheet.set(".test1", {
                height: ""
            });

            expect(filter(styleSheet.get())).to.be(filter(".test1 {color: #ff0000;}"));

            expect(n.css('height')).not.to.be("200px");

            expect(filter(n.css("color"))).to.be("#ff0000");

            // unset all
            styleSheet.set(".test1", {
                color: ""
            });

            expect(filter(styleSheet.get())).to.be(filter(""));
            expect(filter(n.css("color"))).to.be("#000000");

            // add
            styleSheet.set(".test2", {
                height: "120px"
            });

            expect(filter(styleSheet.get())).to.be(filter(".test2 {height: 120px;}"));

            expect(n2.css('height')).to.be("120px");

            // disable
            styleSheet.disable();
            expect(n2.css('height')).not.to.be("120px");

            // enable
            styleSheet.enable();
            expect(n2.css('height')).to.be("120px");

            n.remove();
            n2.remove();
            $(style).remove();
            done();
        })();
    });
});