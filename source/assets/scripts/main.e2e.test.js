import {strict as assert} from "node:assert";
import {describe, it, beforeEach} from "mocha";
import puppeteer from 'puppeteer-core';
import { exit } from "node:process";

describe("test App end to end", async () => {

	let browser;
	let page;

	beforeEach(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		try{
			await page.goto('http://localhost:8080', {timeout: 1000});
		}
		catch (error) {
			console.log("❌ failed to connect to localhost webserver on port 8080")
			exit(1);
		}
	});

	it("page should have correct title", async () => {
		assert.strictEqual(await page.title(), "Food Journal");
	});

	afterEach(async () => {
		await page.close();
		await browser.close();
	});
});