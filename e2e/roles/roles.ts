import { ClientFunction, Role } from 'testcafe';
import { LoginPage } from '../page-models/login';

const getSessionStorageItem = ClientFunction(prop => sessionStorage.getItem(prop));

async function login(t: TestController, username: string, password: string, otpSecret: string, appName: string): Promise<any> {
  await t
    .typeText(LoginPage.usernameInput, username)
    .click(LoginPage.nextButton)
    .typeText(LoginPage.passwordInput, password)
    .click(LoginPage.loginButton);

  if (await LoginPage.otpInput.exists) {
    await t
      .wait(LoginPage.otpWait)
      .typeText(LoginPage.otpInput, LoginPage.getOtpToken(otpSecret))
      .click(LoginPage.verifyButton);
  }

  for (let retries = 10; retries >= 0 && !await getSessionStorageItem(`urn:abraxas:${appName}:access_token`); retries++) {
    await t.wait(1000);
  }
}

export function user(url: string, appName: string) {
  return Role(url, t => login(t, 'angulare2e', '<password>', '<otp-secret>', appName));
}
