package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * AttendancePage - Page Object for both Admin (monitor) and Employee (clock in/out) modules.
 */
public class AttendancePage {

    private static final Logger log = LogManager.getLogger(AttendancePage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading      = By.cssSelector("h2");
    private final By clockInBtn       = By.cssSelector("button.btn-primary:not(.btn-sm)");
    private final By clockWidget      = By.cssSelector("[class*='clock'], [class*='shift'], [class*='timer']");
    private final By shiftTimer       = By.cssSelector("[class*='timer'], [class*='time'], [class*='clock-time']");
    private final By attendanceTable  = By.cssSelector(".table, table");
    private final By tableRows        = By.cssSelector("tbody tr");
    private final By statCards        = By.cssSelector(".stat-card, .card.stat-card");
    private final By searchInput      = By.cssSelector(".search-panel input, input[placeholder*='Search']");
    private final By filterSelect     = By.cssSelector("select");
    private final By activeShiftRows  = By.cssSelector("[class*='active-shift'], tbody tr[class*='active']");
    private final By toastMsg         = By.cssSelector(".toast, [class*='toast']");
    private final By emptyState       = By.cssSelector(".empty-state, .empty-text");

    public AttendancePage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        return WaitUtils.isVisible(driver, pageHeading, WAIT)
            || WaitUtils.isVisible(driver, clockWidget, WAIT)
            || WaitUtils.isVisible(driver, clockInBtn, WAIT);
    }

    public boolean isClockWidgetVisible() {
        return WaitUtils.isVisible(driver, clockWidget, 5) || WaitUtils.isVisible(driver, clockInBtn, 5);
    }

    public boolean isTableVisible()  { return WaitUtils.isVisible(driver, attendanceTable, 5); }
    public boolean isSearchVisible() { return WaitUtils.isVisible(driver, searchInput, 5); }

    public int getStatCardCount() {
        try { return WaitUtils.waitForAllVisible(driver, statCards, WAIT).size(); } catch (Exception e) { return 0; }
    }

    public int getRowCount() {
        try { return WaitUtils.waitForAllVisible(driver, tableRows, 5).size(); } catch (Exception e) { return 0; }
    }

    // ── Employee: Clock In / Clock Out ─────────────────────────────────────

    public void clickClockIn() {
        try {
            List<WebElement> btns = driver.findElements(clockInBtn);
            if (!btns.isEmpty()) {
                btns.get(0).click();
                log.info("Clock In clicked.");
            } else {
                log.warn("Clock In button not found.");
            }
        } catch (Exception e) { log.warn("Clock In error: " + e.getMessage()); }
    }

    public boolean isTimerRunning() {
        try {
            WebElement el = WaitUtils.waitForVisible(driver, shiftTimer, 5);
            return el.isDisplayed() && !el.getText().isEmpty();
        } catch (Exception e) { return false; }
    }

    public String getTimerText() {
        try { return WaitUtils.waitForVisible(driver, shiftTimer, 5).getText(); } catch (Exception e) { return ""; }
    }

    // ── Admin: Search & Filter ─────────────────────────────────────────────

    public void searchAttendance(String query) {
        try {
            WebElement input = WaitUtils.waitForVisible(driver, searchInput, WAIT);
            input.clear(); input.sendKeys(query);
            log.info("Attendance searched: " + query);
        } catch (Exception e) { log.warn("Search input not found."); }
    }

    public void clearSearch() {
        try { WaitUtils.waitForVisible(driver, searchInput, 5).clear(); }
        catch (Exception e) { log.warn("Could not clear search."); }
    }

    public void applyDateFilter(String option) {
        try {
            new org.openqa.selenium.support.ui.Select(
                WaitUtils.waitForVisible(driver, filterSelect, WAIT)
            ).selectByVisibleText(option);
            log.info("Filter applied: " + option);
        } catch (Exception e) { log.warn("Filter select not found."); }
    }

    // ── Toast ──────────────────────────────────────────────────────────────

    public boolean isToastVisible() { return WaitUtils.isVisible(driver, toastMsg, 5); }
    public String getToastText() {
        try { return WaitUtils.waitForVisible(driver, toastMsg, 5).getText(); } catch (Exception e) { return ""; }
    }
}
