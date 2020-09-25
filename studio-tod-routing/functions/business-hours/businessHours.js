//Holiday definitions
var _holidays = {
  M: {
    //Month, Day
    "01-01": "New Year's Day",
    "07-04": "Independence Day",
    "11-11": "Veteran's Day",
    "11-28": "Thanksgiving Day",
    "11-29": "Day after Thanksgiving",
    "12-24": "Christmas Eve",
    "12-25": "Christmas Day",
    "12-31": "New Year's Eve",
  },
  W: {
    //Month, Week of Month, Day of Week
    "1-3-1": "Martin Luther King Jr. Day",
    "2-3-1": "Washington's Birthday",
    "5-5-1": "Memorial Day",
    "9-1-1": "Labor Day",
    "10-2-1": "Columbus Day",
    "11-4-4": "Thanksgiving Day",
  },
};

exports.handler = function (context, event, callback) {
  // Timezone function reference: https://momentjs.com/timezone/
  let moment = require("moment-timezone");

  /**
   * Pass timezone via event or hardcode to desired timezone
   */
  let timezone = event.timezone || "America/Chicago";

  /**
   * Pass Dynamic Open/Close hours via the event paramater. Defaults to open
   */
  let openClosedTime = ["00:00", "23:59"];
  if (
    typeof event.hours != "undefined" &&
    event.hours != "" &&
    event.hours.length > 1
  ) {
    openClosedTime = event.hours.split(",");
  }

  moment.fn.holiday = function () {
    var diff = 1 + (0 | ((this._d.getDate() - 1) / 7)),
      memorial =
        this._d.getDay() === 1 && this._d.getDate() + 7 > 30 ? "5" : null;

    return (
      _holidays["M"][this.format("MM-DD")] ||
      _holidays["W"][this.format("M-" + (memorial || diff) + "/d")]
    );
  };

  const format = "hh:mm";
  let currentTime = moment().tz(timezone);
  let isOpen = false;

  const dayOfWeek = moment().format("d");

  // Check for Holiday
  let isHoliday = moment().holiday();
  if (isHoliday) {
    return callback(null, { isOpen: false, holiday: true });
  }

  /**
   * The default will be used unless a more specific range is defined for each day. uncomment the break; statement when defining specific days
   */
  switch (dayOfWeek) {
    case 0: // Sunday
    // break;
    case 1: // Monday
    // break;
    case 2: // Tuesday
    // break;
    case 3: // Wednesday
    // break;
    case 4: // Thursday
    // break;
    case 5: // Friday
    // break;
    case 6: // Saturday
    // break;
    default:
      if (
        currentTime.isBetween(
          moment(openClosedTime[0], format).tz(timezone),
          moment(openClosedTime[1], format).tz(timezone)
        )
      ) {
        isOpen = true;
      }
  }

  callback(null, {
    isOpen: isOpen,
    holiday: false,
    open: moment(openClosedTime[0], "hh:mm").format("LT"),
    closed: moment(openClosedTime[1], "hh:mm").format("LT"),
  });
};

exports.testHarness = {
  _holidays: _holidays,
};
