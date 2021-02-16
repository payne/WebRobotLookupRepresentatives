const puppeteer = require('puppeteer');
const fs = require('fs');
const getAddresses = require('./input');
      
async function findDistrict(page, address) {
  await page.goto('https://dogis.org/citycouncil_lookup/');
  let input = await page.waitForSelector('#searchDiv_input');
  input.type(`${address}\n`);
  await page.waitForTimeout(2000); // Sadly, seems needed....
  const popup= '#esri_dijit__PopupRenderer_0';
  let mainSection = await page.waitForSelector('.mainSection');
  let t = await page.evaluate(() => document.querySelector('.mainSection').textContent);
  return t;
}

async function main() {
  // const browser = await puppeteer.launch();
  console.log('launching...');
  const browser = await puppeteer.launch({headless:false}); // default is true
  const page = await browser.newPage();
  const addresses = getAddresses();
  console.log(`addresses are:`);
  console.log(addresses);
  let addrAndDistricts=[];
  for (const addr of addresses) {
    console.log(addr);
    let district = await findDistrict(page, addr);
    console.log(`processed: ${addr}\n\tgot: ${district}`);
    const withDistrict = { addr, district };
    addrAndDistricts.push(withDistrict);
  }
  allJson = JSON.stringify(addrAndDistricts);
  fs.writeFileSync("output.json",allJson);
  await page.waitForTimeout(4000);
  await browser.close();
}
main();
