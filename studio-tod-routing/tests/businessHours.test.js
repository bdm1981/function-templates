const helpers = require("../../test/test-helper");
const moment = require("moment-timezone");
const businessHours = require("../functions/business-hours/businessHours");

const mockTwilioClient = {
  messages: {
    create: jest.fn(() =>
      Promise.resolve({
        sid: "my-new-sid",
      })
    ),
  },
};

const context = {
  getTwilioClient: () => mockTwilioClient,
};

beforeAll(() => {
  helpers.setup(context);
});

afterAll(() => {
  helpers.teardown();
});

describe("Business Hour Tests", () => {
  test("should return isOpen === true", () => {
    const callback = (err, result) => {
      expect(result.isOpen).toBe(true);
      expect(result.holiday).toBe(false);
      expect(result.open).toBe("12:00 AM");
      expect(result.closed).toBe("11:59 PM");
    };

    const event = {};

    businessHours.handler(context, event, callback);
  });

  test("should return isOpen === false", () => {
    const callback = (err, result) => {
      expect(result.isOpen).toBe(false);
      expect(result.holiday).toBe(false);
    };

    const event = {
      hours: "00:00,00:00",
    };

    businessHours.handler(context, event, callback);
  });

  test("should return isOpen === false && holiday === true", () => {
    let today = moment().format("MM-DD");
    businessHours.testHarness._holidays.M = {
      [today]: "test holiday",
    };

    const callback = (err, result) => {
      expect(result.isOpen).toBe(false);
      expect(result.holiday).toBe(true);
    };

    const event = {
      hours: "00:00,00:00",
    };

    businessHours.handler(context, event, callback);
  });
});
