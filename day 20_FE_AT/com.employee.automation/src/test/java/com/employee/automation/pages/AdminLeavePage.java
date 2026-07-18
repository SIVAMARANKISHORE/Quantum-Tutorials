package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * AdminLeavePage - Page Object for Admin Leave Management module.
 * Covers: pending queue, approve/reject actions, stats verification.
 */
public class AdminLeavePage {

    private static final Logger log = LogManager.getLogger(AdminLeavePage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading     = By.cssSelector("h2");
    private final By leaveTable      = By.cssSelector(".table, table");
    private final By tableRows       = By.cssSelector("tbody tr");
    private final By approveButtons  = By.cssSelector("button[title*='Approve'], button.btn-success, button[class*='success']");
    private final By rejectButtons   = By.cssSelector("button[title*='Reject'], button[class*='danger']:not(.btn-danger)");
    private final By pendingBadges   = By.cssSelector(".badge[class*='warn'], .badge-warning, [class*='pending']");
    private final By statCards       = By.cssSelector(".stat-card, .card.stat-card");
    private final By filterDropdown  = By.cssSelector("select[name*='status'], select[name*='filter']");
    private final By toastMsg        = By.cssSelector(".toast, [class*='toast']");
    private final By emptyState      = By.cssSelector(".empty-state, .empty-text");

    public AdminLeavePage(WebDriver driver) { this.driver = driver; }

    public boolean isPageLoaded()    { return WaitUtils.isVisible(driver, leaveTable, WAIT) || WaitUtils.isVisible(driver, emptyState, WAIT); }
    public boolean isTableVisible()  { return WaitUtils.isVisible(driver, leaveTable, 5); }
    public int getStatCardCount() {
        try { return WaitUtils.waitForAllVisible(driver, statCards, WAIT).size(); } catch (Exception e) { return 0; }
    }
    public int getPendingCount() {
        try { return driver.findElements(pendingBadges).size(); } catch (Exception e) { return 0; }
    }
    public int getRowCount() {
        try { return WaitUtils.waitForAllVisible(driver, tableRows, 5).size(); } catch (Exception e) { return 0; }
    }

    public void approveFirstLeave() {
        List<WebElement> btns = driver.findElements(approveButtons);
        if (!btns.isEmpty()) { btns.get(0).click(); log.info("Leave approved."); }
        else                 { log.warn("No approve buttons found."); }
    }

    public void rejectFirstLeave() {
        List<WebElement> btns = driver.findElements(rejectButtons);
        if (!btns.isEmpty()) { btns.get(0).click(); log.info("Leave rejected."); }
        else                 { log.warn("No reject buttons found."); }
    }

    public boolean isToastVisible() { return WaitUtils.isVisible(driver, toastMsg, 5); }
    public String getToastText() {
        try { return WaitUtils.waitForVisible(driver, toastMsg, 5).getText(); } catch (Exception e) { return ""; }
    }
}
