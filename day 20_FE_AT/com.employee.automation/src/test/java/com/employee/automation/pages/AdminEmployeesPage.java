package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * AdminEmployeesPage - Page Object for the Admin Employee Directory module.
 * Covers: Add Employee, Edit Employee, Delete Employee, Search, Filter, Table verification.
 */
public class AdminEmployeesPage {

    private static final Logger log = LogManager.getLogger(AdminEmployeesPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────

    // Page heading
    private final By pageHeading     = By.cssSelector("h2, .page-title");

    // Employee table
    private final By employeeTable   = By.cssSelector(".table, table");
    private final By tableRows       = By.cssSelector("tbody tr");

    // Search bar
    private final By searchInput     = By.cssSelector(".search-panel input, input[placeholder*='Search'], input[placeholder*='search']");

    // Filter dropdowns
    private final By statusFilter    = By.cssSelector("select[name*='status'], select option[value='Active']");
    private final By deptFilter      = By.cssSelector("select[name*='department'], select[name*='dept']");

    // Register / Add Employee button
    private final By addEmployeeBtn  = By.cssSelector("button.btn-primary, button[class*='primary']");

    // Modal elements
    private final By modalOverlay    = By.cssSelector(".modal-overlay, .modal-backdrop");
    private final By modalTitle      = By.cssSelector(".modal-title, .modal h3");
    private final By modalCloseBtn   = By.cssSelector(".close-btn, .modal button[class*='close']");

    // Form fields inside modal
    private final By inputName       = By.cssSelector("input[name='name']");
    private final By inputEmail      = By.cssSelector("input[name='email']");
    private final By inputPhone      = By.cssSelector("input[name='phone']");
    private final By selectJobTitle  = By.cssSelector("select[name='jobTitle']");
    private final By inputSalary     = By.cssSelector("input[name='salary']");
    private final By selectDept      = By.cssSelector("select[name='department']");
    private final By selectStatus    = By.cssSelector("select[name='status']");
    private final By selectRole      = By.cssSelector("select[name='role']");
    private final By inputLocation   = By.cssSelector("input[name='location']");
    private final By inputJoinDate   = By.cssSelector("input[name='joinDate']");
    private final By selectGender    = By.cssSelector("select[name='gender']");
    private final By inputPassword   = By.cssSelector("input[name='password']");
    private final By formSaveBtn     = By.cssSelector("button[type='submit'], .modal-footer button.btn-primary");
    private final By formCancelBtn   = By.cssSelector(".modal-footer button.btn-secondary, .modal-footer button.btn-ghost");

    // Action buttons in table rows
    private final By editButtons     = By.cssSelector("table tbody tr button[title*='Edit'], table tbody tr button.btn-ghost:first-of-type, button[title='Edit employee record']");
    private final By deleteButtons   = By.cssSelector("table tbody tr button[title*='Delete'], table tbody tr button.btn-danger, table tbody tr button[class*='danger'], button[title='Delete employee profile']");

    // Delete confirm modal
    private final By deleteConfirmBtn = By.cssSelector(".confirm-modal button.btn-danger, .modal-footer button.btn-danger, button.btn-danger");

    // Pagination
    private final By paginationNext = By.cssSelector(".pagination button[aria-label*='Next'], .pagination-btn:last-child, button:has-text('›'), button[disabled*='false'] ~ button");
    private final By paginationPrev = By.cssSelector(".pagination button[aria-label*='Prev'], .pagination-btn:first-child");
    private final By pageInfoText   = By.cssSelector(".pagination-info, .page-info, span:has-text('Page')");

    // Toast / success message
    private final By toastMsg       = By.cssSelector(".toast, .toast-message, [class*='toast']");

    // ── Constructor ────────────────────────────────────────────────────────

    public AdminEmployeesPage(WebDriver driver) {
        this.driver = driver;
    }

    // ── Verification ───────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        return WaitUtils.isVisible(driver, employeeTable, WAIT);
    }

    public int getEmployeeRowCount() {
        try {
            List<WebElement> rows = WaitUtils.waitForAllVisible(driver, tableRows, WAIT);
            return rows.size();
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean isTableVisible()     { return WaitUtils.isVisible(driver, employeeTable, WAIT); }
    public boolean isAddBtnVisible()    { return WaitUtils.isVisible(driver, addEmployeeBtn, WAIT); }
    public boolean isSearchBarVisible() { return WaitUtils.isVisible(driver, searchInput, WAIT); }

    // ── Search ─────────────────────────────────────────────────────────────

    public void searchEmployee(String query) {
        log.info("Searching for employee: " + query);
        WebElement input = WaitUtils.waitForVisible(driver, searchInput, WAIT);
        input.clear();
        input.sendKeys(query);
    }

    public void clearSearch() {
        WebElement input = WaitUtils.waitForVisible(driver, searchInput, WAIT);
        input.clear();
    }

    // ── Add Employee ───────────────────────────────────────────────────────

    public void clickAddEmployee() {
        WaitUtils.waitForClickable(driver, addEmployeeBtn, WAIT).click();
        WaitUtils.waitForVisible(driver, modalOverlay, WAIT);
        log.info("Add Employee modal opened.");
    }

    public boolean isModalOpen() {
        return WaitUtils.isVisible(driver, modalOverlay, 5);
    }

    public void fillEmployeeForm(String name, String empId, String email,
                                  String phone, String jobTitle, String salary,
                                  String dept, String status, String location, String joinDate) {
        typeField(inputName,       name);
        typeField(inputEmail,      email);
        typeField(inputPhone,      phone);
        
        selectOption(selectDept,   dept);
        try { Thread.sleep(200); } catch (Exception ignored) {} // allow React hook to sync jobTitles
        selectOption(selectJobTitle, jobTitle);
        
        typeField(inputSalary,     salary);
        selectOption(selectStatus, status);
        typeField(inputLocation,   location);
        setDateField(inputJoinDate, joinDate);  // JS injection bypasses date-picker locale issues
        
        // select employee role by default
        selectOption(selectRole, "Employee (Limited Access)");
        typeField(inputPassword, "password123");
        
        log.info("Filled employee form for: " + name);
    }

    public void saveEmployee() {
        WaitUtils.waitForClickable(driver, formSaveBtn, WAIT).click();
        log.info("Save Employee clicked.");
        // Wait briefly for UI to respond, then close any residual modal
        try { Thread.sleep(600); } catch (InterruptedException ignored) {}
        closeModalIfOpen();
    }

    /**
     * Force-close any open modal overlay (Escape key, then close button, then JS removal).
     */
    public void closeModalIfOpen() {
        try {
            if (WaitUtils.isVisible(driver, modalOverlay, 2)) {
                log.warn("Residual modal detected after save — closing.");
                driver.findElement(By.cssSelector("body")).sendKeys(Keys.ESCAPE);
                Thread.sleep(400);
                if (WaitUtils.isVisible(driver, modalOverlay, 1)) {
                    if (WaitUtils.isVisible(driver, modalCloseBtn, 1)) {
                        driver.findElement(modalCloseBtn).click();
                    } else {
                        ((JavascriptExecutor) driver).executeScript(
                            "document.querySelectorAll('.modal-overlay,.modal-backdrop').forEach(e=>e.remove());"
                        );
                    }
                }
                Thread.sleep(300);
                log.info("Modal closed.");
            }
        } catch (Exception e) {
            log.warn("closeModalIfOpen error: " + e.getMessage());
        }
    }

    public void cancelModal() {
        try {
            WaitUtils.waitForClickable(driver, formCancelBtn, WAIT).click();
            log.info("Modal cancelled.");
        } catch (Exception e) {
            WaitUtils.waitForClickable(driver, modalCloseBtn, WAIT).click();
        }
    }

    // ── Edit Employee ──────────────────────────────────────────────────────

    public void clickFirstEditButton() {
        List<WebElement> editBtns = driver.findElements(editButtons);
        if (!editBtns.isEmpty()) {
            editBtns.get(0).click();
            WaitUtils.waitForVisible(driver, modalOverlay, WAIT);
            log.info("Edit modal opened for first employee.");
        } else {
            log.warn("No edit buttons found in employee table.");
        }
    }

    public void updateJobTitle(String newTitle) {
        // jobTitle is a <select> in the form
        try {
            WebElement sel = WaitUtils.waitForVisible(
                driver, By.cssSelector("select[name='jobTitle']"), 5);
            new org.openqa.selenium.support.ui.Select(sel).selectByVisibleText(newTitle);
            log.info("Job title updated to: " + newTitle);
        } catch (Exception e) {
            // Fallback: try selectJobTitle locator
            try {
                selectOption(selectJobTitle, newTitle);
                log.info("Job title updated (fallback select) to: " + newTitle);
            } catch (Exception ex) {
                log.warn("Could not update job title: " + ex.getMessage());
            }
        }
    }


    // ── Delete Employee ────────────────────────────────────────────────────

    public void clickFirstDeleteButton() {
        List<WebElement> delBtns = driver.findElements(deleteButtons);
        if (!delBtns.isEmpty()) {
            delBtns.get(0).click();
            log.info("Delete confirmation modal triggered.");
        } else {
            log.warn("No delete buttons found in employee table.");
        }
    }

    public void confirmDelete() {
        try {
            WaitUtils.waitForClickable(driver, deleteConfirmBtn, WAIT).click();
            log.info("Delete confirmed.");
        } catch (Exception e) {
            log.error("Delete confirm button not found: " + e.getMessage());
        }
    }

    // ── Pagination ─────────────────────────────────────────────────────────

    public boolean isPaginationVisible() {
        return WaitUtils.isVisible(driver, pageInfoText, 5)
            || WaitUtils.isVisible(driver, paginationNext, 5);
    }

    public void clickNextPage() {
        try {
            WaitUtils.waitForClickable(driver, paginationNext, 5).click();
            log.info("Navigated to next page.");
        } catch (Exception e) {
            log.warn("Next page button not available.");
        }
    }

    // ── Toast ──────────────────────────────────────────────────────────────

    public boolean isToastVisible() {
        return WaitUtils.isVisible(driver, toastMsg, 5);
    }

    public String getToastText() {
        try {
            return WaitUtils.waitForVisible(driver, toastMsg, 5).getText();
        } catch (Exception e) {
            return "";
        }
    }

    // ── Private Helpers ────────────────────────────────────────────────────

    private void typeField(By locator, String value) {
        try {
            WebElement el = WaitUtils.waitForVisible(driver, locator, 5);
            el.clear();
            el.sendKeys(value);
        } catch (Exception e) {
            log.warn("Field not found: " + locator);
        }
    }

    /**
     * Set a date input value via JavaScript (bypasses native browser date picker).
     */
    private void setDateField(By locator, String value) {
        try {
            WebElement el = WaitUtils.waitForVisible(driver, locator, 5);
            ((JavascriptExecutor) driver).executeScript(
                "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', {bubbles:true})); arguments[0].dispatchEvent(new Event('change', {bubbles:true}));",
                el, value
            );
            log.info("Date field set via JS: " + value);
        } catch (Exception e) {
            log.warn("Date field not found: " + locator);
        }
    }

    private void selectOption(By locator, String value) {
        try {
            WebElement select = WaitUtils.waitForVisible(driver, locator, 5);
            new org.openqa.selenium.support.ui.Select(select).selectByVisibleText(value);
        } catch (Exception e) {
            log.warn("Select not found or option unavailable: " + locator + " / " + value);
        }
    }
}
