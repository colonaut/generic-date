/**
 * Created by kalle on 13.05.2015.
 */
import IGenericCalendarRule = require('./IGenericCalendarRule');
import Int = require('./Int');

class GenericCalendarRule implements IGenericCalendarRule {
    private _rule;

    constructor(json:string) {
        this._rule = JSON.parse(json);
    }

    get yearDays():number {
        return this._rule.year_days;
    }

    get seconds():number {
        return this._rule.seconds;
    }

    get minutes():number {
        return this._rule.minutes;
    }

    get hours():number {
        return this._rule.hours;
    }

    get weekDays():number {
        return this._rule.week_days;
    }

    get leapMonths():Array<number> {
        return this._rule.leap_months;
    }

    get months():Array<number> {
        return this._rule.months;
    }

    get leapYear():Array<number> {
        return this._rule.leap_year;
    }

    get leapYearDays():number {
        return this._rule.leap_year_days;
    }

    isLeapYear(year:number):boolean {
        return (year % this._rule.leap_year[2] == 0 || (year % this._rule.leap_year[1] != 0 && year % this._rule.leap_year[0] == 0)); //TODO: modolos must be nullable and: this must be designed so. that index1 index2 ALWAYS must be % value0 = 0. Anything else does not make sense! (because it's no exception and no force then)
    }

    getLeapYearsSince(year:number, since?:number):number {
        var leap_years_until_year = 0;
        if (since)
            leap_years_until_year = this.getLeapYearsSince(since + 1);

        var leap_years_since_0 = Int.div(year - 1, this._rule.leap_year[0])
            - Int.div(year - 1, this._rule.leap_year[1])
            + Int.div(year - 1, this._rule.leap_year[2]);

        return leap_years_since_0 - leap_years_until_year;
    }

    getLeapDaysSince(day:number, since?:number):number {
        var leap_days_since = 0;
        if (since)
            leap_days_since = this.getLeapDaysSince(since);

        var days_rule0 = this._rule.leap_year[0] * this._rule.year_days
            + this._rule.leap_year_days - this._rule.year_days;
        var days_rule1 = this._rule.leap_year[1] * this._rule.year_days
            - this._rule.leap_year[1] / this._rule.leap_year[0] * (this._rule.leap_year_days - this._rule.year_days);
        var days_rule2 = this._rule.leap_year[2] * this._rule.year_days
            + this._rule.leap_year[2] / this._rule.leap_year[0] * (this._rule.leap_year_days - this._rule.year_days)
            - this._rule.leap_year[2] / this._rule.leap_year[1] * (this._rule.leap_year_days - this._rule.year_days);

        var rule2 = Int.div(day, days_rule2);
        var rule1 = Int.div(day, days_rule1);
        var rule0 = Int.div(day, days_rule0);

        var leap_days = rule0 - rule1 + rule2;
        var day_of_year = (day - leap_days) % this._rule.year_days;
        var year = Int.div(day - leap_days, this._rule.year_days);

        var leap_months = this._rule.leap_months;
        var months = this._rule.months;
        var count_days = 0;
        if (this.isLeapYear(year + 1)) {
            for (var i = 0; i < leap_months.length; i++) {
                count_days = count_days + leap_months[i];
                leap_days = leap_days + leap_months[i] - months[i];
                if (count_days >= day_of_year)
                    break;
            }
        }

        return leap_days - leap_days_since;
    }

    getDaysSince(year:number, since?:number):number {
        if (since != undefined)
            return (year - 1 - since) * this._rule.year_days + this.getLeapYearsSince(year, since) * (this._rule.leapYearDays - this._rule.year_days);

        return (year - 1) * this._rule.year_days + this.getLeapYearsSince(year) * (this._rule.leap_year_days - this._rule.year_days);
    }

}
export = GenericCalendarRule;