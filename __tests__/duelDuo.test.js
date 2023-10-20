const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.get("http://localhost:8000");

});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    // Sorry that I try to move url into beforeEach method
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test('Check that clicking the Draw button displays the div with id = “choices”', async () => {
    await driver.findElement(By.id('draw')).click();
    await driver.sleep(1000);
    const renderCards = await driver.wait(until.elementLocated(By.className('bot-card')));
    let totalCards = await renderCards.getAttribute('childElementCount')
    expect(totalCards).toEqual("6");
  });

  test('Check that clicking an “Add to Duo” button displays the div with id = “player-duo”', async () => {
    await driver.findElement(By.id('draw')).click();
    await driver.findElement(By.className('bot-btn')).click()
    await driver.sleep(1000);
    const renderCardOfPlayer = await driver.wait(until.elementLocated(By.id('player-duo'))).getTagName();
    expect(renderCardOfPlayer).toBe('div');
    
  })

});

// test('can check off a movie', async () => {
//   await driver.findElement(By.css('input[type="checkbox"]')).click()
//   const watchMessage = await driver.wait(until.elementLocated(By.id('message')))
//   expect(await watchMessage.getText()).toContain('Watched')
// });