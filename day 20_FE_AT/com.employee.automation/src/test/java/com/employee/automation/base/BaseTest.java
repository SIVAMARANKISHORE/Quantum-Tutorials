package com.employee.automation.base;

import com.employee.automation.utils.ConfigReader;
import com.employee.automation.utils.ExtentManager;
import com.employee.automation.utils.ScreenshotUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import java.time.Duration;

/**
 * BaseTest - Parent class for all test classes.
 * Manages browser lifecycle, explicit waits, and common utilities.
 */
public class BaseTest {

    protected static final Logger log = LogManager.getLogger(BaseTest.class);
    protected static WebDriver driver;
    protected static WebDriverWait wait;
    protected static final int WAIT_TIMEOUT = ConfigReader.getExplicitWait();

    @BeforeSuite(alwaysRun = true)
    public void setUpSuite() {
        log.info("============================================================");
        log.info("  EMS Automation Framework - Suite Starting");
        log.info("============================================================");

        // Initialize driver once
        driver = DriverFactory.initDriver();
        wait   = new WebDriverWait(driver, Duration.ofSeconds(WAIT_TIMEOUT));

        // Initialize Extent Reports
        ExtentManager.initReports();

        log.info("Browser launched. Navigating to: " + ConfigReader.getUrl());
        driver.get(ConfigReader.getUrl());
    }

    @AfterSuite(alwaysRun = true)
    public void tearDownSuite() {
        log.info("============================================================");
        log.info("  EMS Automation Framework - Suite Complete");
        log.info("============================================================");
        ExtentManager.flushReports();
        DriverFactory.quitDriver();
    }

    // ── Explicit Wait Helpers ──────────────────────────────────────────────

    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected WebElement waitForClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected boolean waitForUrl(String partialUrl) {
        return wait.until(ExpectedConditions.urlContains(partialUrl));
    }

    protected boolean waitForTextInElement(By locator, String text) {
        return wait.until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
    }

    protected void waitForPresence(By locator) {
        wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    // ── Navigation Helpers ─────────────────────────────────────────────────

    protected void navigateTo(String path) {
        String fullUrl = ConfigReader.getUrl() + path;
        log.debug("Navigating to: " + fullUrl);
        driver.get(fullUrl);
    }

    protected void clickElement(By locator) {
        WebElement el = waitForClickable(locator);
        scrollIntoView(el);
        el.click();
    }

    protected void typeText(By locator, String text) {
        WebElement el = waitForVisible(locator);
        el.clear();
        el.sendKeys(text);
    }

    protected String getText(By locator) {
        return waitForVisible(locator).getText();
    }

    protected boolean isElementVisible(By locator) {
        try {
            return waitForVisible(locator).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    protected void scrollIntoView(WebElement element) {
        try {
            ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
        } catch (Exception ignored) {}
    }

    protected void jsClick(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    // ── Screenshot Helper ──────────────────────────────────────────────────

    protected String captureScreenshot(String name) {
        return ScreenshotUtil.captureScreenshot(driver, name);
    }

    // ── Timing Utility ─────────────────────────────────────────────────────

    protected long getElapsedMs(long startTime) {
        return System.currentTimeMillis() - startTime;
    }
}
