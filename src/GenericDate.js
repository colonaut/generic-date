var GenericDate = (function () {
    function GenericDate(rule, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        var _this = this;
        this._applyOverlapping = function () {
            var pY = _this._year, pM = _this._month, pD = _this._month_day, pYD = _this._year_day, rule = _this._rule;
            //determine if months are overlapping, adding year and month leap days to days
            if (pM > rule.months.length) {
                pY += GenericDate._divI(_this._month, rule.months.length);
                pM = pM % rule.months.length;
                pD += rule.getLeapYearsSince(pY, _this._year) * (rule.leapYearDays - rule.yearDays);
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
                pY += GenericDate._divI(pD, rule.yearDays);
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
                    ruleMonthDays = rule.isLeapYear(pY) ? rule.leapMonths[pM] : rule.months[pM];
                }
                console.log('-> year now:', pY, 'month now:', pM, 'day now:', pD);
            }
            if (_this._year != pY || _this._month != pM || _this._month_day != pD) {
                _this._year = pY;
                _this._month = pM;
                _this._month_day = pD;
                _this._year_day = pYD;
            }
        };
        this._rule = rule;
        if (typeof arg1 == 'string') {
            var date_time = arg1.split('T');
            var date = date_time[0].split('-');
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
                var time = date_time[1].split(':');
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
                var passed_milliseconds = this._time = arg1;
                var passed_seconds = GenericDate._divI(passed_milliseconds, 1000);
                var passed_minutes = GenericDate._divI(passed_seconds, 60);
                var passed_hours = GenericDate._divI(passed_minutes, 60);
                var passed_days = GenericDate._divI(passed_hours, 24);
                var passed_leap_days = rule.getLeapDaysSince(passed_days);
                var passed_years = GenericDate._divI((passed_days - passed_leap_days), rule.yearDays);
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
            throw new Error("TypeError:" + typeof arg1);
    }
    GenericDate._divI = function (n1, n2) {
        return (n1 - (n1 % n2)) / n2;
    };
    GenericDate._padLeft = function (value, digits, char) {
        return new Array(digits - String(value).length + 1).join(char || '0') + value;
    };
    GenericDate.prototype.toISOString = function () {
        return GenericDate._padLeft(this._year, 4) + "-" + GenericDate._padLeft(this._month + 1, String(this._rule.months.length + 1).length) + "-" + GenericDate._padLeft(this._month_day, String(Math.max.apply(null, this._rule.months)).length) + "T" + GenericDate._padLeft(this._hour, 2) + ":" + GenericDate._padLeft(this._minute, 2) + ":" + GenericDate._padLeft(this._second, 2) + "." + GenericDate._padLeft(this._millisecond, 3) + "G";
    };
    Object.defineProperty(GenericDate.prototype, "isLeapYear", {
        get: function () {
            if (!this._is_leap_year)
                this._is_leap_year = this._rule.isLeapYear(this._year);
            return this._is_leap_year;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "time", {
        get: function () {
            if (!this._time)
                this._time = (this._rule.getDaysSince(this.year) + this.yearDay) * 24 * 60 * 60 * 1000;
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "ms", {
        get: function () {
            return this._millisecond;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "second", {
        get: function () {
            return this._second;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "minute", {
        get: function () {
            return this._minute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "hour", {
        get: function () {
            return this._hour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "weekDay", {
        get: function () {
            if (!this._week_day)
                this._week_day = this.yearDay % this._rule.weekDays;
            return this._week_day;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "monthDays", {
        get: function () {
            if (!this._month_days)
                this._month_days = this.isLeapYear ? this._rule.leapMonths[this._month] : this._rule.months[this._month];
            return this._month_days;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "monthDay", {
        get: function () {
            return this._month_day;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "month", {
        get: function () {
            return this._month;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "yearDay", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericDate.prototype, "year", {
        get: function () {
            return this._year;
        },
        enumerable: true,
        configurable: true
    });
    return GenericDate;
})();
module.exports = GenericDate;
//# sourceMappingURL=GenericDate.js.map