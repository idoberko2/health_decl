const Nightmare = require('nightmare');
const screenshotSelector = require('nightmare-screenshot-selector');

Nightmare.action('screenshotSelector', screenshotSelector)

async function scrape(username, password) {
    const nightmare = Nightmare({
        // show: true,
        gotoTimeout: 60000,
    });

    const url = 'https://parents.education.gov.il/prhnet/parents/rights-obligations-regulations/health-statement-kindergarden';
    const kidContainerIds = await nightmare
        .viewport(360, 1024)
        .goto(url)
        .click('input[type=button][value="מילוי הצהרת בריאות מקוונת"]')
        .wait(() => document.querySelector('button[data-login-tab="user-pass-login"]') != null)
        .wait(500)
        .click('button[data-login-tab="user-pass-login"]')
        .wait(() => document.querySelector('input[title="קוד משתמש"]') != null)
        .wait(500)
        .click('div.login-box')
        .type('input[title="קוד משתמש"]', username)
        .type('input[title="סיסמה"]', password)
        .wait(500)
        .click('button[title="כניסה"]')
        .wait(5000)
        .wait(() => document.querySelector('.row.kid-container') != null)
        .wait(2000)
        .evaluate(selector => {
            const ids = [];
            const kids = document.querySelectorAll(selector);

            for (const kidContainer of kids) {
                if (kidContainer.querySelector('i.fa-check-circle') != null) {
                    continue;
                }

                ids.push(kidContainer.id);
            }

            return ids;
        }, '.row.kid-container');

    for (kidId of kidContainerIds) {
        const selector = "#\\" + kidId.toString().charCodeAt(0).toString(16) + " " + kidId.toString().substr(1);
        await nightmare
            .click(selector + ' input[type=button][value="מילוי הצהרת בריאות"]')
            .wait(1000)
            .click(selector + ' input[type=button][value="אישור"]')
            .wait(1000);
    }

    return await nightmare
        .screenshotSelector('health-declaration') // get the image in a buffer
        .end();
}

module.exports = scrape;
