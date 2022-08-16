const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

function randInt(cap) {
    return Math.floor(Math.random()*(cap+1))
}

function randString() {
    var result = "";
    length = Math.floor(Math.random()*100)
    for (i=0; i<length; i++) {
        var num = Math.floor(Math.random() * (95) + 33);
        result += String.fromCharCode(num);
    }
    return result;
}    

const fields = ["salutation", "firstName", "lastName", "phoneNumber", "email", 
"requests", "CCN", "expDate", "CVC", "billaddrs"];

function TestForm() {

        driver.get('http://localhost:3000/form');
        driver.manage().window().maximize();
        var select = randInt(fields.length);
        //console.log(select);

        for (j=0; j<select; j++) {
            test = driver.wait(until.elementLocated(By.name(fields[randInt(fields.length-1)])));
            var input = randString();
            //console.log(input);
            test.sendKeys(input);
        }

        driver.wait(until.elementLocated(By.name("submit"))).click()
}

//let testnum = 0;
async function run() {
    //while(testnum<10){
    while(driver.wait(until.alertIsPresent())){
        TestForm();
        await new Promise(res => setTimeout(res, 6500));
        //testnum++;
    }
}

try {
    run();
}
catch(error) {
    run();
}