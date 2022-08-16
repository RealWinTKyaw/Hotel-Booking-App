const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

const ccn = 4532190168720538;
const pn = 95557761;
const testemail = "Please use your own email";
const testpass = "Not Password";
const ids = ["country-select", ":r7:", ":r9:", ":rb:", ":rd:"];
const fields = ["salutation", "firstName", "lastName", "phoneNumber", "email", 
"requests", "CCN", "expDate", "CVC", "billaddrs"];
const inputs = ["Mr", "Bean", "Esquire", pn, testemail,
"Extra towels and blankets", ccn, 1224, 321, "SUTD 8 Sompapah Road"];

const goButton="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root  css-mbxz31-MuiButtonBase-root-MuiButton-root";
const hotelcard="MuiButtonBase-root MuiCardActionArea-root css-b6lsxj-MuiButtonBase-root-MuiCardActionArea-root";
const roomcard="MuiButtonBase-root MuiCardActionArea-root css-ubkqll-MuiButtonBase-root-MuiCardActionArea-root";
const selectroom="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButtonBase-root  css-15vefbn-MuiButtonBase-root-MuiButton-root";
const googleButtonClass="nsm7Bb-HzV7m-LgbsSe-BPrWId";
const emailclass="whsOnd zHQkBf";
const nextButtonClass="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b";
const passClass="whsOnd zHQkBf";

var handles;
function randomAlphabet() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)]
  }

function randInt(cap) {
    return Math.floor((Math.random() * cap) + 1);
}

async function googleSignIn() {

    driver.get('http://localhost:3000/');
    driver.manage().window().maximize();
    let signIn = driver.wait(until.elementLocated(By.className( googleButtonClass )));
    signIn.click().then(async function(){
        handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
        let email = driver.wait(until.elementLocated(By.className( emailclass )));
        email.sendKeys(testemail);
        let next = driver.wait(until.elementLocated(By.className( nextButtonClass )));
        next.click().then(function(){
            typePass();
        })
    })
    await new Promise(res => setTimeout(res, 2000));

}

async function typePass(){

    await new Promise(res => setTimeout(res, 2000));
    let pw = driver.wait(until.elementLocated(By.className( passClass )));
    pw.sendKeys(testpass);
    let next2 = driver.wait(until.elementLocated(By.className( nextButtonClass )));
    next2.click();
    await new Promise(res => setTimeout(res, 2000)).then(function(){
        driver.switchTo().window(handles[0]);
    })

}

async function selectDest() {

    alphabet = randomAlphabet();
    num = randInt(10);
    await new Promise(res => setTimeout(res, 10000));

    dest = driver.wait(until.elementLocated(By.id( ids[0] )));
    dest.sendKeys(alphabet);
    for (i=1; i<num; i++) {
        direction = randInt(2);
        dest.sendKeys(Arrows[direction]);
        await new Promise(res => setTimeout(res, 500));
    }
    dest.sendKeys(Keys.ENTER);
    await new Promise(res => setTimeout(res, 1000));

    for (j=3; j<5; j++) {
        rooms = driver.wait(until.elementLocated(By.id( ids[j] )));
        times = randInt(10);
        for (i=1; i<times; i++) {
            direction = randInt(2);
            rooms.sendKeys(Arrows[direction]);
            await new Promise(res => setTimeout(res, 500));
        }
    }
    await new Promise(res => setTimeout(res, 1000));
    go = driver.wait(until.elementLocated(By.className(goButton)));
    go.click();
    await new Promise(res => setTimeout(res, 1000));

}

function makeBooking() {

    let hotel = driver.wait(until.elementLocated(By.className(hotelcard)),30000);
    hotel.click();
    let room = driver.wait(until.elementLocated(By.className(roomcard)),30000);
    room.click();
    let form = driver.wait(until.elementLocated(By.className(selectroom)));
    form.click().then(function(){
        for (i=0; i<fields.length; i++) {
            test = driver.wait(until.elementLocated(By.name(fields[i])));
            test.sendKeys(inputs[i]);
        }
    
        driver.wait(until.elementLocated(By.name("submit"))).click();
    })

}

async function run() {

    await googleSignIn();
    await selectDest();
    makeBooking();
}

try {
    run();
}
catch(TimeoutError) {
    run();
}

const Keys = {
    NULL: '\uE000',
    CANCEL: '\uE001',
    HELP: '\uE002',
    BACK_SPACE: '\uE003',
    TAB: '\uE004',
    CLEAR: '\uE005',
    RETURN: '\uE006',
    ENTER: '\uE007',
    SHIFT: '\uE008',
    CONTROL: '\uE009',
    ALT: '\uE00A',
    PAUSE: '\uE00B',
    ESCAPE: '\uE00C',
    SPACE: '\uE00D',
    PAGE_UP: '\uE00E',
    PAGE_DOWN: '\uE00F',
    END: '\uE010',
    HOME: '\uE011',
    ARROW_LEFT: '\uE012',
    LEFT: '\uE012',
    ARROW_UP: '\uE013',
    UP: '\uE013',
    ARROW_RIGHT: '\uE014',
    RIGHT: '\uE014',
    ARROW_DOWN: '\uE015',
    DOWN: '\uE015',
    INSERT: '\uE016',
    DELETE: '\uE017',
    SEMICOLON: '\uE018',
    EQUALS: '\uE019',
}

const Arrows = ["nil", Keys.UP, Keys.DOWN, Keys.LEFT, Keys.RIGHT]