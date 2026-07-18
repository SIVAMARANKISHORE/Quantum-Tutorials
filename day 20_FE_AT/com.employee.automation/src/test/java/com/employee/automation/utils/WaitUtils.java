package com.employee.automation.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * WaitUtils - Centralized explicit wait utility methods.
 * No Thread.sleep() is used anywhere in this class.
 */
public class WaitUtils {

    private static final Logger log = LogManager.getLogger(WaitUtils.class);

    private WaitUtils() {}

    public static WebDriverWait getWait(WebDriver driver, int timeoutSeconds) {
        return new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
    }

    /** Wait until element is visible */
    public static WebElement waitForVisible(WebDriver driver, By locator, int timeoutSeconds) {
        log.debug("Waiting for visible: " + locator);
        return getWait(driver, timeoutSeconds)
            .until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /** Wait until element is clickable */
    public static WebElement waitForClickable(WebDriver driver, By locator, int timeoutSeconds) {
        log.debug("Waiting for clickable: " + locator);
        return getWait(driver, timeoutSeconds)
            .until(ExpectedConditions.elementToBeClickable(locator));
    }

    /** Wait until element is present in DOM */
    public static WebElement waitForPresence(WebDriver driver, By locator, int timeoutSeconds) {
        log.debug("Waiting for presence: " + locator);
        return getWait(driver, timeoutSeconds)
            .until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    /** Wait until all elements matching the locator are visible */
    public static List<WebElement> waitForAllVisible(WebDriver driver, By locator, int timeout) {
        return getWait(driver, timeout)
            .until(ExpectedConditions.visibilityOfAllElementsLocatedBy(locator));
    }

    /** Wait until URL contains a partial string */
    public static boolean waitForUrlContains(WebDriver driver, String partialUrl, int timeout) {
        log.debug("Waiting for URL to contain: " + partialUrl);
        return getWait(driver, timeout)
            .until(ExpectedConditions.urlContains(partialUrl));
    }

    /** Wait until page title contains text */
    public static boolean waitForTitle(WebDriver driver, String titlePart, int timeout) {
        return getWait(driver, timeout)
            .until(ExpectedConditions.titleContains(titlePart));
    }

    /** Wait until element is invisible */
    public static boolean waitForInvisible(WebDriver driver, By locator, int timeout) {
        return getWait(driver, timeout)
            .until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }

    /** Wait until text is present in an element */
    public static boolean waitForTextPresent(WebDriver driver, By locator, String text, int timeout) {
        return getWait(driver, timeout)
            .until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
    }

    /** Wait until page JavaScript load is complete */
    public static void waitForPageLoad(WebDriver driver, int timeout) {
        getWait(driver, timeout).until(d ->
            ((JavascriptExecutor) d)
                .executeScript("return document.readyState").equals("complete")
        );
        log.debug("Page DOM load complete.");
    }

    /** Safe element visibility check (no exception thrown) */
    public static boolean isVisible(WebDriver driver, By locator, int timeout) {
        try {
            waitForVisible(driver, locator, timeout);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
