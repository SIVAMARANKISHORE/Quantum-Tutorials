package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * EmployeeLeavePage - Page Object for the Employee Leave Request module.
 * Covers: apply leave form, history timeline, quota balance, form validation.
 */
public class EmployeeLeavePage {

    private static final Logger log = LogManager.getLogger(EmployeeLeavePage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    // Leave.jsx has no h2 — topbar has h1.topbar-title; cards use h3
    private final By pageHeading      = By.cssSelector("h1.topbar-title, h3, .card-title");
    private final By applyLeaveBtn    = By.cssSelector("button.btn-primary, .toolbar button.btn-primary");
    private final By leaveFormSection = By.cssSelector(".card form, form");
    private final By leaveTypeSelect  = By.cssSelector("select[name='type'], select[name='leaveType'], select");
    private final By startDateInput   = By.cssSelector("input[name='startDate'], input[type='date']:first-of-type");
    private final By endDateInput     = By.cssSelector("input[name='endDate'], input[type='date']:last-of-type");
    private final By reasonTextarea   = By.cssSelector("textarea[name='reason'], textarea[placeholder*='reason'], textarea");
    private final By submitLeaveBtn   = By.cssSelector("button[type='submit'], form button.btn-primary");
    private final By cancelLeaveBtn   = By.cssSelector("form button.btn-secondary, form button.btn-ghost");
    private final By leaveHistoryRows = By.cssSelector("tbody tr, .leave-item, [class*='leave-row']");
    private final By quotaCards       = By.cssSelector(".stat-card, .card.stat-card, .quota-card");
    private final By statusBadges     = By.cssSelector("tbody .badge, [class*='badge']");
    private final By toastMsg         = By.cssSelector(".toast, [class*='toast']");
    private final By emptyState       = By.cssSelector(".empty-state, .empty-text");
    private final By validationErrors = By.cssSelector(".error, [class*='error-msg'], .form-error");

    public EmployeeLeavePage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        // Leave.jsx renders quota cards, a form card, and apply button — no dedicated h2
        return WaitUtils.isVisible(driver, pageHeading, WAIT)
            || WaitUtils.isVisible(driver, quotaCards, WAIT)
            || WaitUtils.isVisible(driver, applyLeaveBtn, WAIT);
    }

    public boolean isApplyBtnVisible()     { return WaitUtils.isVisible(driver, applyLeaveBtn, WAIT); }
    public boolean isLeaveFormVisible()    { return WaitUtils.isVisible(driver, leaveFormSection, 5); }
    public boolean isHistoryTableVisible() { return WaitUtils.isVisible(driver, leaveHistoryRows, 5) || WaitUtils.isVisible(driver, emptyState, 5); }

    public int getHistoryRowCount() {
        try { return WaitUtils.waitForAllVisible(driver, leaveHistoryRows, 5).size(); } catch (Exception e) { return 0; }
    }

    public int getQuotaCardCount() {
        try { return driver.findElements(quotaCards).size(); } catch (Exception e) { return 0; }
    }

    public int getStatusBadgeCount() {
        try { return driver.findElements(statusBadges).size(); } catch (Exception e) { return 0; }
    }

    // ── Apply Leave Form ───────────────────────────────────────────────────

    public void clickApplyLeave() {
        try {
            WaitUtils.waitForClickable(driver, applyLeaveBtn, WAIT).click();
            log.info("Apply leave form opened.");
        } catch (Exception e) { log.warn("Apply leave button not found: " + e.getMessage()); }
    }

    public void selectLeaveType(String leaveType) {
        try {
            new org.openqa.selenium.support.ui.Select(
                WaitUtils.waitForVisible(driver, leaveTypeSelect, WAIT)
            ).selectByVisibleText(leaveType);
            log.info("Leave type selected: " + leaveType);
        } catch (Exception e) { log.warn("Leave type select not found."); }
    }

    public void setStartDate(String date) {
        try {
            WebElement el = WaitUtils.waitForVisible(driver, startDateInput, 5);
            el.clear(); el.sendKeys(date);
        } catch (Exception e) { log.warn("Start date field not found."); }
    }

    public void setEndDate(String date) {
        try {
            WebElement el = WaitUtils.waitForVisible(driver, endDateInput, 5);
            el.clear(); el.sendKeys(date);
        } catch (Exception e) { log.warn("End date field not found."); }
    }

    public void enterReason(String reason) {
        try {
            WebElement el = WaitUtils.waitForVisible(driver, reasonTextarea, 5);
            el.clear(); el.sendKeys(reason);
        } catch (Exception e) { log.warn("Reason textarea not found."); }
    }

    public void submitLeave() {
        WaitUtils.waitForClickable(driver, submitLeaveBtn, WAIT).click();
        log.info("Leave request submitted.");
    }

    public void cancelLeave() {
        try { WaitUtils.waitForClickable(driver, cancelLeaveBtn, 5).click(); }
        catch (Exception e) { log.warn("Cancel button not found."); }
    }

    // ── Validation ─────────────────────────────────────────────────────────

    /**
     * Try to submit an empty form and check for validation errors.
     */
    public boolean hasValidationError() {
        try {
            WaitUtils.waitForClickable(driver, submitLeaveBtn, WAIT).click();
            return WaitUtils.isVisible(driver, validationErrors, 3)
                || driver.findElements(validationErrors).size() > 0;
        } catch (Exception e) { return false; }
    }

    public boolean isToastVisible() { return WaitUtils.isVisible(driver, toastMsg, 5); }
    public String getToastText() {
        try { return WaitUtils.waitForVisible(driver, toastMsg, 5).getText(); } catch (Exception e) { return ""; }
    }
}
