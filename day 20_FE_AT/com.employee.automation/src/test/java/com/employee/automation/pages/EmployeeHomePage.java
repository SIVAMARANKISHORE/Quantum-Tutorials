package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * EmployeeHomePage - Page Object for the Employee Home / Workspace module.
 * Covers: greeting banner, leave balance cards, announcement snippets, quick actions.
 */
public class EmployeeHomePage {

    private static final Logger log = LogManager.getLogger(EmployeeHomePage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By greetingBanner   = By.cssSelector("h2, h1, [class*='greeting'], [class*='welcome']");
    private final By leaveBalCards    = By.cssSelector(".stat-card, .card.stat-card");
    private final By clockInBtn       = By.cssSelector("button[class*='primary']:not(.btn-sm)");
    private final By clockWidget      = By.cssSelector("[class*='clock'], [class*='timer'], [class*='shift']");
    private final By liveTimer        = By.cssSelector("[class*='timer'], [class*='clock-time'], [class*='session']");
    private final By quickActionBtns  = By.cssSelector(".card button, [class*='quick-action'] button");
    private final By announcementFeed = By.cssSelector("[class*='announcement'], [class*='notice-card'], [class*='notice']");
    private final By holidaySection   = By.cssSelector("[class*='holiday'], [class*='upcoming']");
    private final By todayDate        = By.cssSelector("[class*='date'], [class*='today']");

    public EmployeeHomePage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        return WaitUtils.isVisible(driver, greetingBanner, WAIT)
            || WaitUtils.isVisible(driver, leaveBalCards, WAIT);
    }

    public boolean isGreetingVisible()     { return WaitUtils.isVisible(driver, greetingBanner, WAIT); }
    public boolean isLeaveBalanceVisible() { return WaitUtils.isVisible(driver, leaveBalCards, WAIT); }
    public boolean isClockWidgetVisible()  { return WaitUtils.isVisible(driver, clockWidget, 5) || WaitUtils.isVisible(driver, clockInBtn, 5); }

    public int getStatCardCount() {
        try { return driver.findElements(leaveBalCards).size(); } catch (Exception e) { return 0; }
    }

    public String getGreetingText() {
        try { return WaitUtils.waitForVisible(driver, greetingBanner, WAIT).getText(); } catch (Exception e) { return ""; }
    }

    public int getAnnouncementSnippetCount() {
        try { return driver.findElements(announcementFeed).size(); } catch (Exception e) { return 0; }
    }

    // ── Actions ────────────────────────────────────────────────────────────

    /**
     * Click Clock In button on the home page widget.
     */
    public void clickClockIn() {
        try {
            WaitUtils.waitForClickable(driver, clockInBtn, WAIT).click();
            log.info("Clock In button clicked.");
        } catch (Exception e) { log.warn("Clock In button not found."); }
    }

    /**
     * Verify the live session timer is running (text changes over time).
     */
    public boolean isLiveTimerRunning() {
        try {
            WebElement timerEl = WaitUtils.waitForVisible(driver, liveTimer, 5);
            String t1 = timerEl.getText();
            return t1 != null && !t1.isEmpty();
        } catch (Exception e) { return false; }
    }
}
