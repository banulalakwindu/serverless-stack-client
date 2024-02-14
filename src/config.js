const dev = {
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY: "pk_test_51Oh6fHA5Huvr1m74tv1IrHj6kNtc7CROe7mrS86ox8kvtKHuZ3c2w8G0wEDR8efwdcSCZw5EjYkKhJSunSRtZlaD0066brrnDh",
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-testmy",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://ieijiv72w1.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_09N45S4wW",
    APP_CLIENT_ID: "3vv7r10arkqtnu6svv7qrfgar7",
    IDENTITY_POOL_ID: "us-east-1:93558616-845e-4d3b-b374-90abcffc90d4",
  },
};

export default dev;
