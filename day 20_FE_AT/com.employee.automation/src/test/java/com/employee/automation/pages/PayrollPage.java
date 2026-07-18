package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * PayrollPage - Page Object for both Admin (salary register) and Employee (payslips) modules.
 */
public class PayrollPage {

    private static final Logger log = LogManager.getLogger(PayrollPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading        = By.cssSelector("h2");
    private final By payrollTable       = By.cssSelector(".table-wrap .table, .table-wrap table, table.table");
    private final By tableRows          = By.cssSelector("tbody tr");
    private final By statCards          = By.cssSelector(".card.stat-card, .stat-card");
    private final By viewBreakdownBtns  = By.cssSelector("button.btn-secondary.btn-sm");
    private final By downloadBtns       = By.cssSelector("button.btn-ghost.btn-sm");
    private final By modalOverlay       = By.cssSelector(".modal-overlay");
    private final By modalCloseBtn      = By.cssSelector(".close-btn, .modal-header button");
    private final By modalTitle         = By.cssSelector(".modal-title");
    // Net salary div uses inline style color: var(--success-light), not a CSS class
    private final By netSalaryLine      = By.cssSelector(".modal-body div[style*='success'], .modal-body [style*='success'], .modal-body strong");
    private final By printBtn           = By.cssSelector(".modal-footer button.btn-primary");
    private final By closeModalBtn      = By.cssSelector(".modal-footer button.btn-secondary");
    // Employee compensation plan banner: first .card on the page for employees
    private final By salaryBanner       = By.cssSelector(".table-wrap, .card");
    private final By complianceBtn      = By.cssSelector("button.btn-primary.btn-sm");
    private final By emptyState         = By.cssSelector(".empty-state");

    public PayrollPage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        // For admin: payroll table or stat cards. For employee: payslip table or salary banner.
        return WaitUtils.isVisible(driver, payrollTable, WAIT)
            || WaitUtils.isVisible(driver, statCards, WAIT)
            || WaitUtils.isVisible(driver, salaryBanner, WAIT);
    }

    public boolean isTableVisible() { return WaitUtils.isVisible(driver, payrollTable, 5); }

    public int getRowCount() {
        try { return WaitUtils.waitForAllVisible(driver, tableRows, WAIT).size(); } catch (Exception e) { return 0; }
    }

    public int getStatCardCount() {
        try { return WaitUtils.waitForAllVisible(driver, statCards, WAIT).size(); } catch (Exception e) { return 0; }
    }

    public boolean isSalaryBannerVisible() { return WaitUtils.isVisible(driver, salaryBanner, 5); }

    // ── Employee Actions ───────────────────────────────────────────────────

    /**
     * Click the "View Breakdown" button for the first payslip row.
     */
    public void clickViewBreakdown() {
        List<WebElement> btns = driver.findElements(viewBreakdownBtns);
        if (!btns.isEmpty()) {
            try {
                // Use JS click to avoid interception issues
                ((org.openqa.selenium.JavascriptExecutor) driver)
                    .executeScript("arguments[0].click();", btns.get(0));
                // Brief wait for React state to update setSelectedPayslip
                try { Thread.sleep(600); } catch (InterruptedException ignored) {}
                log.info("Payslip 'View Breakdown' clicked.");
            } catch (Exception e) {
                btns.get(0).click();
                try { Thread.sleep(600); } catch (InterruptedException ignored) {}
                log.info("Payslip 'View Breakdown' clicked (fallback).");
            }
        } else {
            log.warn("No 'View Breakdown' buttons found.");
        }
    }

    public boolean isModalOpen() { return WaitUtils.isVisible(driver, modalOverlay, 5); }

    public String getModalTitle() {
        try { return WaitUtils.waitForVisible(driver, modalTitle, 5).getText(); } catch (Exception e) { return ""; }
    }

    public boolean isNetSalaryVisible() { return WaitUtils.isVisible(driver, netSalaryLine, 5); }

    public void clickPrintStatement() {
        try {
            WaitUtils.waitForClickable(driver, printBtn, 5).click();
            log.info("Print statement clicked.");
        } catch (Exception e) { log.warn("Print button not found."); }
    }

    public void closeModal() {
        try {
            WaitUtils.waitForClickable(driver, closeModalBtn, WAIT).click();
            log.info("Payslip modal closed.");
        } catch (Exception e) {
            try { WaitUtils.waitForClickable(driver, modalCloseBtn, WAIT).click(); }
            catch (Exception ex) { log.warn("Could not close modal."); }
        }
    }

    // ── Admin Actions ──────────────────────────────────────────────────────

    /**
     * Click the admin "Compile Compliance Run" button.
     */
    public void clickComplianceRun() {
        try {
            WaitUtils.waitForClickable(driver, complianceBtn, WAIT).click();
            log.info("Compliance run initiated.");
        } catch (Exception e) { log.warn("Compliance run button not found."); }
    }

    /**
     * Dismiss any browser alert/dialog that appears after compliance run.
     */
    public void dismissAlert() {
        try {
            driver.switchTo().alert().accept();
            log.info("Alert dismissed.");
        } catch (Exception e) { log.debug("No alert to dismiss."); }
    }
}
