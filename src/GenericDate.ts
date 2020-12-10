import IGenericCalendarRule from './IGenericCalendarRule';
import GenericCalendarRule from './GenericCalendarRule';
import IGenericDate from './IGenericDate';
import Int from './Int';

export default class GenericDate implements IGenericDate {
    private _year:number;
    private _year_day:number;
    private _month:number;
    private _month_day:number;
    private _month_days:number;
    private _week_day:number;
    readonly _hour:number;
    readonly _minute:number;
    readonly _second:number;
    readonly _millisecond:number;
    private _is_leap_year:boolean;
    private _time:number;
    readonly _rule:IGenericCalendarRule;

    constructor(rule:GenericCalendarRule, milliseconds:number);
    constructor(rule:GenericCalendarRule, isoString:string);
    constructor(rule:GenericCalendarRule, year:number, month:number, day:number);
    constructor(rule:GenericCalendarRule, year:number, month:number, day:number, hour:number);
    constructor(rule:GenericCalendarRule, year:number, month:number, day:number, hour:number, minute:number);
    constructor(rule:GenericCalendarRule, year:number, month:number, day:number, hour:number, minute:number, second:number);
    constructor(rule:GenericCalendarRule, year:number, month:number, day:number, hour:number, minute:number, second:number, millisecond:number);

    constructor(rule:GenericCalendarRule, arg1:any, arg2?:any, arg3?:any, arg4?:any, arg5?:any, arg6?:any, arg7?:any) {
        this._rule = rule;

        if (typeof arg1 == 'string') { //TODO: x-y-z, vs x-y. x-y y should be yeardays then. as some calendars might not have months....
            var date_time:Array<string> = arg1.split('T');
            var date:Array<string> = date_time[0].split('-');

            this._year = parseInt(date[0]);
            this._month = parseInt(date[1] || '1') - 1;
            this._month_day = parseInt(date[2] || '1');
            this._is_leap_year = rule.isLeapYear(this._year);

            var months = this.isLeapYear ? rule.leapMonths : rule.months;
            this._year_day = 0;
            for (var i = 0; i < this._month; i++) {
                this._year_day += months[i];
            }
            this._year_day += this._month_day;

            this._applyOverlapping();

            if (date_time.length > 1) {
                //TODO: implement times incl. overlapping
                var time:Array<string> = date_time[1].split(':');
                //console.log(time, time.length);
            }
            else {
                this._hour = this._minute = this._second = this._millisecond = 0;
            }
        }
        else if (typeof arg1 == 'number') {
            //TODO: implement year_day as second param
            if (typeof arg2 == 'number') {
                this._year = arg1;
                this._month = arg2;
                this._month_day = 1;
                this._hour = 0;
                this._minute = 0;
                this._second = 0;
                this._millisecond = 0;

                if (typeof arg3 == 'number') {
                    this._month_day = arg3;
                    if (typeof arg4 == 'number') {
                        this._hour = arg4;
                        if (typeof arg5 == 'number') {
                            this._minute = arg5;
                            if (typeof arg6 == 'number') {
                                this._second = arg6;
                                if (typeof arg7 == 'number') {
                                    this._millisecond = arg7;
                                }
                            }
                        }
                    }
                }

                var months = this.isLeapYear ? rule.leapMonths : rule.months;
                this._year_day = 0;
                for (var i = 0; i < this.month; i++)
                    this._year_day += months[i];

                this._year_day += this._month_day;

                this._applyOverlapping();
            }
            else {
                var passed_milliseconds:number = this._time = arg1;
                var passed_seconds:number = Int.div(passed_milliseconds, 1000);
                var passed_minutes:number = Int.div(passed_seconds, 60);
                var passed_hours:number = Int.div(passed_minutes, 60);
                var passed_days:number = Int.div(passed_hours, 24);
                var passed_leap_days:number = rule.getLeapDaysSince(passed_days);
                var passed_years:number = Int.div((passed_days - passed_leap_days), rule.yearDays);

                this._hour = passed_hours - passed_days * 24;
                this._minute = passed_minutes - passed_hours * 60;
                this._second = passed_seconds - passed_minutes * 60;
                this._millisecond = passed_milliseconds - passed_seconds * 1000;
                this._year = passed_years + 1;
                this._is_leap_year = rule.isLeapYear(this._year);
                this._year_day = (passed_days - passed_leap_days) % rule.yearDays + 1;

                var months = this._is_leap_year ? rule.leapMonths : rule.months;
                var month_day = this._year_day;
                for (var i = 0; i < rule.months.length; i++) {
                    this._month = i;
                    if (months[i] > month_day)
                        break;
                    month_day = month_day - months[i];
                }
                this._month_day = month_day;
            }
        }
        else
            throw new Error("TypeError:" + typeof arg1)
    }

    private _applyOverlapping = ():void => {
        var pY = this._year,
            pM = this._month,
            pD = this._month_day,
            pYD = this._year_day,
            rule = this._rule;

        //determine if months are overlapping, adding year and month leap days to days
        if (pM > rule.months.length) {
            pY += Int.div(this._month, rule.months.length);
            pM = pM % rule.months.length;
            pD += rule.getLeapYearsSince(pY, this._year) * (rule.leapYearDays - rule.yearDays);
            pYD = 0;
            var pIsLeapYear = rule.isLeapYear(pY);
            for (var i = 0; i < pM; i++) {
                pYD += rule.months[i];
                if (pIsLeapYear) {
                    pD += rule.leapMonths[i] - rule.months[i];
                    pYD += rule.leapMonths[i] - rule.months[i];
                }

            }
            pYD += pD;
            console.log('-> year mow:', pY, 'month now:', pM, 'day now:', pD);
        }
        //determine if days are overlapping
        if (pD > rule.months[pM]) {
            console.log('-> days are more than possible:' + pD);
            pY += Int.div(pD, rule.yearDays);
            var ruleMonthDays = rule.isLeapYear(pY) ? rule.leapMonths[pM] : rule.months[pM];
            while (pD > ruleMonthDays) {
                console.log('->-> mth, mthdays, left overlapping days', pM, ruleMonthDays, pD);
                pD = pD - ruleMonthDays;
                pM++;
                if (pM == rule.months.length) {
                    pY++;
                    pM = 0;
                    pYD = pD;
                }
                ruleMonthDays = rule.isLeapYear(pY) ? rule.leapMonths[pM] : rule.months[pM]

            }
            console.log('-> year now:', pY, 'month now:', pM, 'day now:', pD);
        }

        if (this._year != pY || this._month != pM || this._month_day != pD) {
            this._year = pY;
            this._month = pM;
            this._month_day = pD;
            this._year_day = pYD;
            /* 0;
             for (var i = 0; i < this._month; i++) {
             this._year_day += months[i];
             }
             this._year_day += this._month_day;*/
        }
    };

    toISOString():string {
        return Int.padLeft(this._year, 4)
            + "-" + Int.padLeft(this._month + 1, String(this._rule.months.length + 1).length)
            + "-" + Int.padLeft(this._month_day, String(Math.max.apply(null, this._rule.months)).length)
            + "T" + Int.padLeft(this._hour, 2)
            + ":" + Int.padLeft(this._minute, 2)
            + ":" + Int.padLeft(this._second, 2)
            + "." + Int.padLeft(this._millisecond, 3) + "G";
    }

    get isLeapYear():boolean {
        if (!this._is_leap_year)
            this._is_leap_year = this._rule.isLeapYear(this._year);

        return this._is_leap_year;
    }

    get time():number {
        if (!this._time)
            this._time = (this._rule.getDaysSince(this.year) + this.yearDay) * 24 * 60 * 60 * 1000;
        return this._time;
    }

    get ms():number {
        return this._millisecond;
    }

    get second():number {
        return this._second;
    }

    get minute():number {
        return this._minute;
    }

    get hour():number {
        return this._hour;
    }

    get weekDay():number {
        if (!this._week_day)
            this._week_day = this.yearDay % this._rule.weekDays;

        return this._week_day;
    }

    get monthDays():number {
        if (!this._month_days)
            this._month_days = this.isLeapYear
                ? this._rule.leapMonths[this._month]
                : this._rule.months[this._month];

        return this._month_days;
    }

    get monthDay():number {
        return this._month_day;
    }

    get month():number {
        return this._month;
    }

    get yearDay():number {
        //TODO: code must be removed, once this is done in constructor.
        if (!this._year_day) {
            var months = this.isLeapYear ? this._rule.leapMonths : this._rule.months;
            this._year_day = 0;
            for (var i = 0; i < this.month; i++) {
                this._year_day += months[i];
            }
            this._year_day += this.monthDay;
        }

        return this._year_day;
    }

    get year():number {
        return this._year;
    }
}