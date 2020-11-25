const Nightmare = require('nightmare');
const screenshotSelector = require('nightmare-screenshot-selector');

Nightmare.action('screenshotSelector', screenshotSelector)

async function scrape(username, password) {
    const nightmare = Nightmare({
        show: true,
        gotoTimeout: 60000,
    });

    const url = 'https://parents.education.gov.il/prhnet/parents/rights-obligations-regulations/health-statement-kindergarden';
    return await nightmare
        .viewport(360, 740)
        .goto(url)
        .click('input[type=button][value="מילוי הצהרת בריאות מקוונת"]')
        .wait(() => document.querySelector('button[data-login-tab="user-pass-login"]') != null)
        .wait(500)
        .click('button[data-login-tab="user-pass-login"]')
        .wait(() => document.querySelector('#HIN_USERID') != null)
        .wait(500)
        .click('div.login-box')
        .type('#HIN_USERID', username)
        .type('#Ecom_Password', password)
        .wait(500)
        .click('#loginButton2')
        .wait(() => document.querySelector('.row.kid-container i.fa-check-circle') != null)
        .screenshotSelector('health-declaration') // get the image in a buffer
        .end();
}

module.exports = scrape;
