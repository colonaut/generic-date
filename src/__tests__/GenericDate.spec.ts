import {assert, expect} from 'chai';
import GenericCalendarRule from '../GenericCalendarRule';
import GenericDate from '../GenericDate';

//import gregorian_rule_json from '../../test/gregorian-calendar-rule.json';

const gregorian_rule_json = JSON.stringify({
    year_days: 365,
    leap_year_days: 366,
    leap_year: [
        4,
        100,
        400
    ],
    months: [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ],
    leap_months: [
        31,
        29,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ],
    week_days: 7,
    hours: 24,
    minutes: 60,
    seconds: 60
});

const gregorian_rule = new GenericCalendarRule(gregorian_rule_json);

describe("A GenericCalendarRule instance", function () {

    describe("which describes the gregorian calendar", function () {

        it("should getLeapYearsSince(1970) return 477", function () {
            assert.equal(gregorian_rule.getLeapYearsSince(1970), 477);
        });

        it("should getLeapDaysSince(719162) return 477", function () {
            assert.equal(gregorian_rule.getLeapDaysSince(719162), 477);
        });
        it("should getLeapDaysSince(719162, 719162 - 1461) return 1", function () {
            assert.equal(gregorian_rule.getLeapDaysSince(719162, 719162 - 1461), 1);
        });
        it("should getLeapDaysSince(719162, 1461) return 476", function () {
            assert.equal(gregorian_rule.getLeapDaysSince(719162, 1461), 476);
        });

        it("should return getLeapYearsSince(1970, 4) return 476", function () {
            assert.equal(gregorian_rule.getLeapYearsSince(1970, 4), 476);
        });

        it("should getLeapYearsSince(2013, 1521) return 120", function () {
            assert.equal(gregorian_rule.getLeapYearsSince(2013, 1521), 120);
        });

        it("should getDaysSince(1970) be 719162", function () {
            assert.equal(gregorian_rule.getDaysSince(1970), 719162);
        });

        it("should getDaysSince(1970) calculated to ms be 62135596800000", function () {
            assert.equal(gregorian_rule.getDaysSince(1970) * 1000 * 60 * 60 * 24, 62135596800000);
        });

        it("should getDaysSince(1) be 0", function () {
            assert.equal(gregorian_rule.getDaysSince(1), 0);
        });
        it("should getDaysSince(2) be 365", function () {
            assert.equal(gregorian_rule.getDaysSince(2), 365);
        });

        it("should getDaysSince(5) be 1461", function () {
            assert.equal(gregorian_rule.getDaysSince(5), 1461);
        });

        it("should getDaysSince(2016) be 735963", function () {
            assert.equal(gregorian_rule.getDaysSince(2016), 735963);
        });

        it("should return getLeapYearsSince(1970) 477", function () {
            assert.equal(gregorian_rule.getLeapYearsSince(1970), 477);
        });

        it("should return getLeapDaysSince(719527) 477", function () {
            assert.equal(gregorian_rule.getLeapDaysSince(719527), 477);
        });

        //735963 -> 2016
        it("should return getLeapDaysSince(735963) 489", function () {
            assert.equal(gregorian_rule.getLeapDaysSince(735963 + 60), 489);
        });


    });
});


describe("A GenericDate instance", function () {

    describe("with gregorian calendar rule and time 62135596800000", function () {
        var g_date = new GenericDate(gregorian_rule, 62135596800000);//62167132800000

        it("should property year be 1970", function () {
            assert.equal(g_date.year, 1970)
        });
        it("should toISOString() return the same as new Date(0).toISOString() with G instead of Z", function () {
            assert.equal(g_date.toISOString(), new Date(0).toISOString().replace('Z', 'G'));
        });
    });

    describe("with gregorian calendar rule and time 0", function () {
        var g_date = new GenericDate(gregorian_rule, 0);

        it("should toISOString() return 0001-01-01T00:00:00.000G", function () {
            assert.equal(g_date.toISOString(), "0001-01-01T00:00:00.000G");
        });
        it("should property isLeapYear be false", function () {
            assert.equal(g_date.isLeapYear, false);
        });
    });

    describe("with gregorian calendar rule and number 63618825600000", function () {

        var g_date = new GenericDate(gregorian_rule, 63618825600000 - 31622400000);

        it("should return toISOString 2016-01-01T00:00:00.000G", function () {
            assert.equal(g_date.toISOString(), '2016-01-01T00:00:00.000G');
        });
    });

    describe("with gregorian calendar rule and number 63587203200000", function () { //63587203200000 // old:63596275200000 (wrong?)
        /*generic to gregorian 0 (1970-1-1): 62167132800000
        //gregorian 2016: 1460764800000
        //gregorian 2015: 1429142400000
        //31536000000 one gregorian regular year
         //one gregorian leapyear 31622400000*/
        var g_date = new GenericDate(gregorian_rule, 63596448000000);//62167132800000 + 1460764800000 - 31622400000));

        it("should property time be 63596448000000", function () {
            assert.equal(g_date.time, 63596448000000);
        });
        it("should property isLeapYear be true", function () {
            assert.equal(g_date.isLeapYear, true);
        });
        it("should property yearDay return 107", function () {
            assert.equal(g_date.yearDay, 107, "yearDay is not correct");
        });
        it("should property monthDay return 16", function () {
            assert.equal(g_date.monthDay, 16, "monthDay is not correct");
        });
        it("should property monthDays return 30", function () {
            assert.equal(g_date.monthDays, 30, "monthDays is not correct");
        });
        it("should return toISOString 2016-04-16T00:00:00.000G", function () {
            assert.equal(g_date.toISOString(), '2016-04-16T00:00:00.000G');
        });
    });


    describe("with with gregorian calendar rule and args 2016 3 16", function () {
        var g_date = new GenericDate(gregorian_rule, 2016, 3, 16);

        it("should property time be 63596448000000", function () {
            assert.equal(g_date.time, 63596448000000);
        });
        it("should property isLeapYear be true", function () {
            assert.equal(g_date.isLeapYear, true);
        });
        it("should property yearDay return 107", function () {
            assert.equal(g_date.yearDay, 107, "yearDay is not correct");
        });
        it("should property monthDay return 16", function () {
            assert.equal(g_date.monthDay, 16, "monthDay is not correct");
        });
        it("should property monthDays return 30", function () {
            assert.equal(g_date.monthDays, 30, "monthDays is not correct");
        });
        it("should return toISOString 2016-04-16T00:00:00.000G", function () {
            assert.equal(g_date.toISOString(), '2016-04-16T00:00:00.000G');
        });
    });

    describe("with with gregorian calendar rule and string 2015 14 60", function () {
        var g_date = new GenericDate(gregorian_rule, 2015, 14, 60);

        it("should property yearDay return 121", function () {
            assert.equal(g_date.yearDay, 121);
        });
        it("should property month return 3 (April)", function () {
            assert.equal(g_date.month, 3);
        });
        it("should property monthDay return 30 ????", function () {
            assert.equal(g_date.monthDay, 30);
        });
        it("should return toISOString 2016-04-30T00:00:00.000G", function () {
            assert.equal(g_date.toISOString(), '2016-04-30T00:00:00.000G');
        });
    });


    describe("with with gregorian calendar rule and string 2016-04-16", function () {
        var g_date = new GenericDate(gregorian_rule, '2016-04-16');

        it("time property be 63596448000000", function () {
            assert.equal(g_date.time, 63596448000000);
        });
        it("should property isLeapYear be true", function () {
            assert.equal(g_date.isLeapYear, true);
        });
        it("should property monthDays return 30", function () {
            assert.equal(g_date.monthDays, 30, "monthDays is not correct");
        });
        it("should property yearDay return 107", function () {
            assert.equal(g_date.yearDay, 107, "yearDay is not correct");
        });
        it("should return toISOString 2016-04-16T00:00:00.000G", function () {
            assert.equal(g_date.toISOString(), '2016-04-16T00:00:00.000G');
        });
    });

    describe("with with gregorian calendar rule and string 2015-15-60", function () {
        var g_date = new GenericDate(gregorian_rule, '2015-15-60');

        it("should property yearDay return 121", function () {
            assert.equal(g_date.yearDay, 121);
        });
        it("should property month return 3 (April)", function () {
            assert.equal(g_date.month, 3);
        });
        it("should property monthDay return 30 ????", function () {
            assert.equal(g_date.monthDay, 30);
        });
        it("should return toISOString 2016-04-30T00:00:00.000G", function () {
            assert.equal(g_date.toISOString(), '2016-04-30T00:00:00.000G');
        });
    });

    describe("with with gregorian calendar rule and string 2016-11-400", function () {
        var g_date = new GenericDate(gregorian_rule, '2016-11-400');

        it("should property yearDay return 339", function () {
            assert.equal(g_date.yearDay, 339);
        });
        it("should property month return 11", function () {
            assert.equal(g_date.month, 11);
        });
        it("should property monthDay return 5", function () {
            assert.equal(g_date.monthDay, 5);
        });

    });

});
